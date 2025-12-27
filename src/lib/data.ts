import { pb } from "./pocketbase"; // Importa la instancia de Pocketbase
import {
  type Categoria,
  type Activo,
  Solicitud,
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