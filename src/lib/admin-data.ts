import { pb } from "./pocketbase";
import type { Categoria, Activo, Solicitud } from "./types";
import { ListResult } from "pocketbase";
import { sendApprovalEmail } from "./email-service";
import JSZip from "jszip";

// Funciones de Categorías
export async function createCategoria(data: {
  nombre: string;
  descripcion: string;
  imagen?: File;
}): Promise<Categoria> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);

  if (data.imagen) {
    formData.append("imagen", data.imagen);
  }

  return await pb.collection("categoria").create(formData);
}

export async function updateCategoria(
  id: string,
  data: {
    nombre?: string;
    descripcion?: string;
    imagen?: File | null;
  }
): Promise<Categoria> {
  const formData = new FormData();

  if (data.nombre !== undefined) {
    formData.append("nombre", data.nombre);
  }

  if (data.descripcion !== undefined) {
    formData.append("descripcion", data.descripcion);
  }

  if (data.imagen) {
    formData.append("imagen", data.imagen);
  } else if (data.imagen === null) {
    formData.append("imagen", "");
  }

  return await pb.collection("categoria").update(id, formData);
}

export async function deleteCategoria(id: string): Promise<boolean> {
  return await pb.collection("categoria").delete(id);
}

export async function getCategoriasAdmin(): Promise<Categoria[]> {
  try {
    const categorias = await pb.collection("categoria").getFullList<Categoria>({
      sort: "-created",
    });
    return categorias;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Funciones de Activos
export async function createActivo(data: {
  titulo: string;
  descripcion: string;
  anio?: number;
  autor?: string;
  archivos?: File[];
  publico: boolean;
  categoria: string;
}): Promise<Activo> {
  const formData = new FormData();
  formData.append("titulo", data.titulo);
  formData.append("descripcion", data.descripcion);
  formData.append("publico", data.publico.toString());
  formData.append("categoria", data.categoria);

  if (data.anio) {
    formData.append("anio", data.anio.toString());
  }

  if (data.autor) {
    formData.append("autor", data.autor);
  }

  if (data.archivos && data.archivos.length > 0) {
    data.archivos.forEach((file) => {
      formData.append("archivos", file);
    });
  }

  return await pb.collection("activo").create(formData);
}

export async function updateActivo(
  id: string,
  data: {
    titulo?: string;
    descripcion?: string;
    anio?: number | null;
    autor?: string;
    publico?: boolean;
    categoria?: string;
    nuevosArchivos?: File[];
    archivosAEliminar?: string[];
  }
): Promise<Activo> {
  const formData = new FormData();

  if (data.titulo !== undefined) {
    formData.append("titulo", data.titulo);
  }

  if (data.descripcion !== undefined) {
    formData.append("descripcion", data.descripcion);
  }

  if (data.anio !== undefined) {
    formData.append("anio", data.anio ? data.anio.toString() : "");
  }

  if (data.autor !== undefined) {
    formData.append("autor", data.autor);
  }

  if (data.publico !== undefined) {
    formData.append("publico", data.publico.toString());
  }

  if (data.categoria !== undefined) {
    formData.append("categoria", data.categoria);
  }

  // Manejo correcto de archivos
  // Si hay cambios en archivos (eliminación o adición), necesitamos manejarlos
  if (
    (data.archivosAEliminar && data.archivosAEliminar.length > 0) ||
    (data.nuevosArchivos && data.nuevosArchivos.length > 0)
  ) {
    // Obtener el activo actual para saber qué archivos tiene
    const activoActual = await pb.collection("activo").getOne(id);
    const archivosActuales: string[] = activoActual.archivos || [];

    // Filtrar los archivos que NO están en la lista de eliminación
    const archivosAMantener = archivosActuales.filter(
      (archivo) => !(data.archivosAEliminar || []).includes(archivo)
    );

    // Primero, agregar los archivos existentes que se deben mantener
    // usando el formato "filename.ext" que PocketBase reconoce
    archivosAMantener.forEach((archivo) => {
      formData.append("archivos", archivo);
    });

    // Luego, agregar los nuevos archivos (objetos File)
    if (data.nuevosArchivos && data.nuevosArchivos.length > 0) {
      data.nuevosArchivos.forEach((file) => {
        formData.append("archivos", file);
      });
    }

    // Si no quedan archivos después de todo, enviar string vacío
    if (
      archivosAMantener.length === 0 &&
      (!data.nuevosArchivos || data.nuevosArchivos.length === 0)
    ) {
      formData.set("archivos", "");
    }
  }

  return await pb.collection("activo").update(id, formData);
}

export async function deleteActivo(id: string): Promise<boolean> {
  return await pb.collection("activo").delete(id);
}

// Helper genérico para eliminar un registro en cualquier colección
export async function deleteRecord(
  collectionName: string,
  id: string
): Promise<boolean> {
  try {
    console.log(`Deleting record ${id} from collection ${collectionName}`);
    await pb.collection(collectionName).delete(id);

    return true;
  } catch (error) {
    console.error(`Error deleting ${collectionName} ${id}:`, error);
    return false;
  }
}

export async function getActivosAdmin(
  categoriaId?: string,
  page: number = 1,
  perPage: number = 50
): Promise<{ items: Activo[]; totalItems: number; totalPages: number }> {
  try {
    let filter = "";
    if (categoriaId && categoriaId !== "Todas") {
      filter = `categoria = "${categoriaId}"`;
    }

    const result = await pb
      .collection("activo")
      .getList<Activo>(page, perPage, {
        filter: filter || undefined,
        expand: "categoria",
        sort: "-created",
      });

    return {
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  } catch (error) {
    console.error("Error fetching activos:", error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

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
 * Descarga todos los archivos de un activo como un archivo ZIP
 */
export async function downloadActivoArchivosAsZip(
  activo: Activo
): Promise<{ success: boolean; blob?: Blob; error?: string }> {
  try {
    if (!activo.archivos || activo.archivos.length === 0) {
      return {
        success: false,
        error: "El activo no tiene archivos para descargar",
      };
    }

    const zip = new JSZip();

    // Descargar cada archivo y agregarlo al ZIP
    for (const archivo of activo.archivos) {
      try {
        const fileUrl = pb.files.getURL(activo, archivo);
        const response = await fetch(fileUrl);

        if (!response.ok) {
          console.error(
            `Error descargando archivo ${archivo}: ${response.statusText}`
          );
          continue;
        }

        const blob = await response.blob();
        zip.file(archivo, blob);
      } catch (fileError) {
        console.error(`Error procesando archivo ${archivo}:`, fileError);
      }
    }

    // Generar el ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });

    return { success: true, blob: zipBlob };
  } catch (error: unknown) {
    console.error("Error creando ZIP:", error);
    const message =
      error instanceof Error ? error.message : "Error al crear el archivo ZIP";
    return {
      success: false,
      error: message,
    };
  }
}

export async function getSolicitudesAdmin(
  page: number = 1,
  perPage: number = 30
): Promise<ListResult<Solicitud>> {
  try {
    const result = await pb
      .collection("solicitud")
      .getList<Solicitud>(page, perPage, {
        expand: "activo", // Para poder ver el nombre del activo solicitado
        sort: "-created", // Mostrar las más nuevas primero
      });
    return result;
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    return { page: 1, perPage, totalItems: 0, totalPages: 1, items: [] };
  }
}
export async function updateSolicitudEstado(
  id: string,
  estado: "aprobado" | "rechazado"
): Promise<{ success: boolean; error?: string }> {
  try {
    // Actualizar el estado de la solicitud
    await pb.collection("solicitud").update<Solicitud>(id, {
      estado,
    });

    // Si fue aprobada, enviar email con archivos
    if (estado === "aprobado") {
      // Obtener la solicitud con el activo expandido
      const solicitudCompleta = await pb
        .collection("solicitud")
        .getOne<Solicitud>(id, {
          expand: "activo",
        });

      if (solicitudCompleta.expand?.activo) {
        const emailResult = await sendApprovalEmail(
          solicitudCompleta,
          solicitudCompleta.expand.activo
        );

        if (!emailResult.success) {
          console.error("Error al enviar correo:", emailResult.error);
          return {
            success: false,
            error: `Solicitud aprobada pero falló el envío del correo: ${emailResult.error}`,
          };
        }
      }
    }

    return { success: true };
  } catch (error: unknown) {
    console.error(`Error updating solicitud ${id} to ${estado}:`, error);
    const message =
      error instanceof Error
        ? error.message
        : "Error al actualizar la solicitud";
    return {
      success: false,
      error: message,
    };
  }
}
