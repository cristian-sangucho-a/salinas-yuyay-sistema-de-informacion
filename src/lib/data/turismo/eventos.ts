import { pb } from "@/lib/pocketbase";
import type { Evento } from "@/lib/types/turismo";

export async function obtenerEventos(): Promise<Evento[]> {
  try {
    const items = await pb.collection("evento").getFullList<Evento>({
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

export async function obtenerEventoById(id: string): Promise<Evento | null> {
  if (!id) return null;
  try {
    console.log(`Fetching evento with id: ${id} with ${pb.authStore.token ? "auth" : "no auth"}`);
    const ev = await pb.collection("evento").getOne<Evento>(id);

    return ev ?? null;
  } catch (error) {
    console.error(`Error fetching evento ${id}:`, error);
    return null;
  }
}

export function generarUrlImagen(collectionId: string, itemId: string, filename: string): string {
  if (!collectionId || !itemId || !filename) {
    return '';
  }
  
  // Crear un objeto mock con las propiedades necesarias para pb.files.getURL
  const mockRecord = {
    id: itemId,
    collectionId: collectionId,
  };
  
  return pb.files.getURL(mockRecord as any, filename);
}

export async function updateEvento(
  id: string,
  data: {
    titulo?: string;
    eslogan?: string | null;
    contenido?: string | null;
    fecha_de_inicio?: string | Date | null;
    fecha_de_finalizacion?: string | Date | null;
    organizadores?: string | null;
    portada?: File | null; // null => clear
    nuevosGaleria?: File[];
    galeriaAEliminar?: string[]; // filenames to remove
    publico?: boolean;
  }
): Promise<Evento> {
  const formData = new FormData();

  if (data.titulo !== undefined) formData.append('titulo', data.titulo);
  if (data.eslogan !== undefined) formData.append('eslogan', data.eslogan ?? '');
  if (data.contenido !== undefined) formData.append('contenido', data.contenido ?? '');

  if (data.fecha_de_inicio !== undefined) {
    if (data.fecha_de_inicio === null) {
      formData.append('fecha_de_inicio', '');
    } else {
      const v = data.fecha_de_inicio instanceof Date ? data.fecha_de_inicio.toISOString() : String(data.fecha_de_inicio);
      formData.append('fecha_de_inicio', v);
    }
  }

  if (data.fecha_de_finalizacion !== undefined) {
    if (data.fecha_de_finalizacion === null) {
      formData.append('fecha_de_finalizacion', '');
    } else {
      const v = data.fecha_de_finalizacion instanceof Date ? data.fecha_de_finalizacion.toISOString() : String(data.fecha_de_finalizacion);
      formData.append('fecha_de_finalizacion', v);
    }
  }

  if (data.organizadores !== undefined) formData.append('organizadores', data.organizadores ?? '');

  if (data.portada) {
    formData.append('portada', data.portada);
  } else if (data.portada === null) {
    // clear portada
    formData.append('portada', '');
  }

  // Agregar nuevas imágenes a la galería
  if (data.nuevosGaleria && data.nuevosGaleria.length > 0) {
    data.nuevosGaleria.forEach((f) => formData.append('galeria', f));
  }

  // Si se piden eliminar imágenes, calcular las que quedan y enviar '' si no queda ninguna
  if (data.galeriaAEliminar && data.galeriaAEliminar.length > 0) {
    const evActual = await pb.collection('evento').getOne(id);
    const galeriaActual: string[] = evActual.galeria || [];
    const galeriaAMantener = galeriaActual.filter((g) => !data.galeriaAEliminar!.includes(g));
    if (galeriaAMantener.length === 0) {
      formData.append('galeria', '');
    }
  }

  if (data.publico !== undefined) formData.append('publico', String(data.publico));
  console.log(`Updating evento with id: ${id} with ${pb.authStore.token ? "auth" : "no auth"}`);
  return await pb.collection('evento').update(id, formData);
}


// Función para crear un nuevo evento (admin)
export async function createEvento(data: {
  titulo: string;
  eslogan?: string;
  contenido?: string;
  fecha_de_inicio: string | Date;
  fecha_de_finalizacion?: string | Date;
  organizadores?: string;
  portada?: File;
  galeria?: File[];
  publico?: boolean;
}): Promise<Evento> {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  if (data.eslogan !== undefined) formData.append('eslogan', data.eslogan ?? '');
  if (data.contenido !== undefined) formData.append('contenido', data.contenido);

  // fechas: enviar como ISO strings
  if (data.fecha_de_inicio) {
    const v = data.fecha_de_inicio instanceof Date ? data.fecha_de_inicio.toISOString() : String(data.fecha_de_inicio);
    formData.append('fecha_de_inicio', v);
  }
  if (data.fecha_de_finalizacion) {
    const v = data.fecha_de_finalizacion instanceof Date ? data.fecha_de_finalizacion.toISOString() : String(data.fecha_de_finalizacion);
    formData.append('fecha_de_finalizacion', v);
  }

  if (data.organizadores !== undefined) formData.append('organizadores', data.organizadores);
  if (data.portada) formData.append('portada', data.portada);
  if (data.galeria && data.galeria.length > 0) {
    data.galeria.forEach((f) => formData.append('galeria', f));
  }
  if (data.publico !== undefined) formData.append('publico', String(data.publico));

  return await pb.collection('evento').create(formData);
}

