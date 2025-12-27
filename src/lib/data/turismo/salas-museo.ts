import { pb } from "@/lib/pocketbase";
import type { SalaMuseo } from "@/lib/types/turismo";

export async function obtenerSalasMuseo(): Promise<SalaMuseo[]> {
  try {
    // Usar getFullList para recuperar todas las entradas públicas
    const salas = await pb.collection("sala_museo").getFullList<SalaMuseo>({
      sort: "-created",
    });

    console.log("Fetched upcoming public salas:", salas);
    return salas;
  } catch (error) {
    console.error("Error fetching public salas_museo:", error);
    return [];
  }
}

/**
 * Devuelve una sala del museo por id solo si no está oculta; de lo contrario retorna null.
 */
export async function getSalaMuseoById(
  id: string
): Promise<SalaMuseo | null> {
  if (!id) return null;
  try {
    const sala = await pb.collection("sala_museo").getOne<SalaMuseo>(id);
    return sala;
  } catch (error) {
    console.error(`Error fetching sala_museo ${id}:`, error);
    return null;
  }
}

export async function updateSalaMuseo(
  id: string,
  data: {
    titulo?: string;
    resumen?: string | null;
    contenido?: string | null;
    portada?: File | null; // null => clear
    nuevosGaleria?: File[];
    galeriaAEliminar?: string[];
    publico?: boolean;
  }
): Promise<SalaMuseo> {
  const formData = new FormData();

  if (data.titulo !== undefined) formData.append('titulo', data.titulo);
  if (data.resumen !== undefined) formData.append('resumen', data.resumen ?? '');
  if (data.contenido !== undefined) formData.append('contenido', data.contenido ?? '');

  if (data.portada) {
    formData.append('portada', data.portada);
  } else if (data.portada === null) {
    formData.append('portada', '');
  }

  if (data.nuevosGaleria && data.nuevosGaleria.length > 0) {
    data.nuevosGaleria.forEach((f) => formData.append('galeria', f));
  }

  if (data.galeriaAEliminar && data.galeriaAEliminar.length > 0) {
    const salaActual = await pb.collection('sala_museo').getOne(id);
    const galeriaActual: string[] = salaActual.galeria || [];
    const galeriaAMantener = galeriaActual.filter((g) => !data.galeriaAEliminar!.includes(g));
    if (galeriaAMantener.length === 0) {
      formData.append('galeria', '');
    }
  }

  if (data.publico !== undefined) formData.append('publico', String(data.publico));

  return await pb.collection('sala_museo').update(id, formData);
}

// Funciones para Sala de Museo
export async function createSalaMuseo(data: {
  titulo: string;
  resumen?: string;
  contenido?: string;
  portada?: File;
  galeria?: File[];
  publico?: boolean;
}): Promise<SalaMuseo> {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  if (data.resumen !== undefined) formData.append('resumen', data.resumen);
  if (data.contenido !== undefined) formData.append('contenido', data.contenido);
  if (data.portada) formData.append('portada', data.portada);
  if (data.galeria && data.galeria.length > 0) {
    data.galeria.forEach((f) => formData.append('galeria', f));
  }
  if (data.publico !== undefined) formData.append('publico', String(data.publico));

  return await pb.collection('sala_museo').create(formData);
}

