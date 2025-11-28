import { pb } from "./pocketbase"; // Importa la instancia de Pocketbase
import {
  type Categoria,
  type Activo,
  Solicitud,
  SalaMuseo,
  Evento,
} from "./types"; // Importa los tipos
import type { ListResult, RecordModel } from "pocketbase"; // Importa tipos necesarios

/**
 * Función para construir la URL de un archivo de Pocketbase.
 */
export function getFileUrl(
  record: RecordModel | null | undefined,
  filenameField: string,
  specificFilename?: string
): string | null {
  if (!record || !record.id || !filenameField) {
    return null;
  }

  try {
    if (specificFilename) {
      return pb.files.getURL(record, specificFilename);
    }

    const fileValue = record[filenameField];

    // Manejar campo de archivo Múltiple (como 'archivos' en Activo)
    if (Array.isArray(fileValue) && fileValue.length > 0) {
      // Devuelve la URL del primer archivo de la lista
      // Usa la nueva sintaxis pb.files.getURL()
      return pb.files.getURL(record, fileValue[0]);
    }
    // Manejar campo de archivo Único (como 'imagen' en Categoria)
    else if (typeof fileValue === "string" && fileValue) {
      // Usa la nueva sintaxis pb.files.getURL()
      return pb.files.getURL(record, fileValue);
    }

    return null; // No hay archivo válido
  } catch (error) {
    console.error(
      `Error constructing file URL for record ${record.collectionId}/${record.id}, field ${filenameField}:`,
      error
    );
    return null;
  }
}

/**
 * Obtiene TODAS las categorías de Pocketbase, ordenadas por nombre.
 * (Sin cambios en esta función)
 */
export async function getCategorias(): Promise<Categoria[]> {
  try {
    const categorias = await pb.collection("categoria").getFullList<Categoria>({
      sort: "nombre",
    });
    return categorias;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Obtiene una lista paginada de activos, opcionalmente filtrados por categoría.
 * La visibilidad es manejada por las API Rules de Pocketbase.
 * (Sin cambios en esta función)
 */
export async function getActivos(
  categoryId?: string,
  page: number = 1,
  perPage: number = 50
): Promise<ListResult<Activo>> {
  let filter = "";
  if (categoryId && categoryId !== "Todas") {
    filter = `categoria = "${categoryId}"`;
  }
  const finalFilter = filter === "" ? undefined : filter;

  try {
    const activos = await pb
      .collection("activo")
      .getList<Activo>(page, perPage, {
        filter: finalFilter,
        expand: "categoria",
        sort: "-created",
      });
    return activos;
  } catch (error) {
    console.error("Error fetching activos:", error);
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }
}

/**
 * Obtiene el conteo de activos por categoría.
 */
export async function getAssetCountsByCategory(): Promise<
  Record<string, number>
> {
  try {
    const activos = await pb.collection("activo").getFullList<Activo>({
      filter: "publico = true",
      fields: "id,categoria",
    });

    const counts: Record<string, number> = {};
    activos.forEach((activo) => {
      if (activo.categoria) {
        counts[activo.categoria] = (counts[activo.categoria] || 0) + 1;
      }
    });

    return counts;
  } catch (error) {
    console.error("Error fetching asset counts:", error);
    return {};
  }
}

/**
 * Obtiene un activo específico por su ID.
 */
export async function getActivoById(id: string): Promise<Activo | null> {
  try {
    const activo = await pb.collection("activo").getOne<Activo>(id, {
      expand: "categoria",
    });
    return activo;
  } catch (error) {
    console.error("Error fetching activo:", error);
    return null;
  }
}

/**
 * Devuelve todas las salas del museo que no están ocultas (ocultar = false).
 */
export async function getSalasMuseoPublicas(): Promise<SalaMuseo[]> {
  try {
    // Usar getFullList para recuperar todas las entradas públicas
    const salas = await pb.collection("sala_museo").getFullList<SalaMuseo>({
      filter: "ocultar = false",
      sort: "-created",
    });
    return salas;
  } catch (error) {
    console.error("Error fetching public salas_museo:", error);
    return [];
  }
}

/**
 * Devuelve todas las salas del museo que no están ocultas (ocultar = false).
 */
export async function getSalasMuseo(): Promise<SalaMuseo[]> {
  try {
    // Usar getFullList para recuperar todas las entradas públicas
    const salas = await pb.collection("sala_museo").getFullList<SalaMuseo>({
      sort: "-created",
    });
    return salas;
  } catch (error) {
    console.error("Error fetching public salas_museo:", error);
    return [];
  }
}

/**
 * Devuelve una sala del museo por id solo si no está oculta; de lo contrario retorna null.
 */
export async function getSalaMuseoPublicaById(
  id: string
): Promise<SalaMuseo | null> {
  if (!id) return null;
  try {
    const sala = await pb.collection("sala_museo").getOne<SalaMuseo>(id);
    if ((sala as unknown as { ocultar?: boolean }).ocultar) return null;
    return sala;
  } catch (error) {
    console.error(`Error fetching sala_museo ${id}:`, error);
    return null;
  }
}

export async function getSalaMuseoById(id: string): Promise<SalaMuseo | null> {
  if (!id) return null;
  try {
    const sala = await pb.collection("sala_museo").getOne<SalaMuseo>(id);
    return sala;
  } catch (error) {
    console.error(`Error fetching sala_museo ${id}:`, error);
    return null;
  }
}

/**
 * Crea una solicitud para un activo.
 */
export async function createSolicitud(data: {
  nombre: string;
  apellido: string;
  correo: string;
  institucion?: string;
  motivo: string;
  activo: string;
}): Promise<boolean> {
  try {
    await pb.collection("solicitud").create({
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      institucion: data.institucion,
      motivo: data.motivo,
      activo: data.activo,
      estado: "pendiente",
    });
    return true;
  } catch (error) {
    console.error("Error creating solicitud:", error);
    return false;
  }
}

/**
 * Devuelve los eventos futuros (fecha_de_inicio > ahora) que estén públicos.
 */
export async function getUpcomingPublicEvents(): Promise<Evento[]> {
  try {
    // Filtrar SOLO por la parte de FECHA (YYYY-MM-DD). Esto devuelve eventos cuyo
    // día de inicio sea posterior al día actual, independientemente de la hora.
    const todayDate = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
    console.log("Today's date for filtering:", todayDate);
    // Ejemplo de filtro: ?filter=(publico = true && fecha_de_inicio > '2025-11-09')
    const filter = `publico = true && fecha_de_inicio > '${todayDate}'`;

    // Usar getFullList para recuperar todos los registros que cumplan el filtro, ordenados por fecha asc
    const items = await pb.collection("evento").getFullList<Evento>({
      filter,
      sort: "fecha_de_inicio",
    });
    console.log("Fetched upcoming public events:", items);
    return items;
  } catch (error) {
    console.error(
      "Error fetching upcoming public events (server filter):",
      error
    );
    return [];
  }
}

/**
 * Devuelve un evento por su id sólo si está público.
 */
export async function getEventoPublicoById(id: string): Promise<Evento | null> {
  if (!id) return null;
  try {
    const ev = await pb.collection("evento").getOne<Evento>(id);
    if (!ev) return null;
    // Aceptar booleano true o string 'true'
    if (ev.publico === false || String(ev.publico) !== "true") return null;
    return ev;
  } catch (error) {
    console.error(`Error fetching evento ${id}:`, error);
    return null;
  }
}

/**
 * Devuelve un evento por su id sin comprobar su bandera `publico`.
 */
export async function getEventoById(id: string): Promise<Evento | null> {
  if (!id) return null;
  try {
    const ev = await pb.collection("evento").getOne<Evento>(id);
    return ev ?? null;
  } catch (error) {
    console.error(`Error fetching evento ${id}:`, error);
    return null;
  }
}

/**
 * Devuelve todos los eventos sin filtrar por `publico` ni por fecha.
 * Útil en paneles/admin donde se requieren todos los registros.
 */
export async function getAllEventos(): Promise<Evento[]> {
  try {
    const items = await pb.collection("evento").getFullList<Evento>({
      sort: "-created",
    });
    return items;
  } catch (error) {
    console.error("Error fetching all eventos:", error);
    return [];
  }
}
