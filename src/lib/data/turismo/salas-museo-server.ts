import { loadAuthFromCookies } from "@/lib/server-auth";
import type { SalaMuseo } from "@/lib/types/turismo";

/**
 * Obtener todas las salas de museo con autenticación desde cookies (Server Component)
 * Usar solo en Server Components
 */
export async function obtenerSalasMuseoServer(): Promise<SalaMuseo[]> {
  try {
    const pb = await loadAuthFromCookies();
    const salas = await pb.collection("sala_museo").getFullList<SalaMuseo>({
      sort: "-created",
    });
    console.log("Fetched salas with server auth:", salas.length);
    return salas;
  } catch (error) {
    console.error("Error fetching salas_museo (server):", error);
    return [];
  }
}

/**
 * Obtener sala de museo por ID con autenticación desde cookies (Server Component)
 * Usar solo en Server Components
 */
export async function getSalaMuseoByIdServer(id: string): Promise<SalaMuseo | null> {
  if (!id) return null;
  try {
    const pb = await loadAuthFromCookies();
    console.log(`Fetching sala_museo with id: ${id} with ${pb.authStore.token ? "auth" : "no auth"}`);
    const sala = await pb.collection("sala_museo").getOne<SalaMuseo>(id);
    return sala;
  } catch (error) {
    console.error(`Error fetching sala_museo ${id}:`, error);
    return null;
  }
}

export function generarUrlImagenSala(collectionId: string, itemId: string, filename: string): string {
  return `http://127.0.0.1:8090/api/files/${collectionId}/${itemId}/${filename}`;
}
