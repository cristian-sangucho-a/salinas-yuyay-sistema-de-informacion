import { loadAuthFromCookies } from "@/lib/server-auth";
import type { Evento } from "@/lib/types/turismo";

/**
 * Obtener evento por ID con autenticación desde cookies (Server Component)
 * Usar solo en Server Components
 */
export async function obtenerEventoByIdServer(id: string): Promise<Evento | null> {
  if (!id) return null;
  try {
    const pb = await loadAuthFromCookies();
    console.log(`Fetching evento with id: ${id} with ${pb.authStore.token ? "auth" : "no auth"}`);
    const ev = await pb.collection("evento").getOne<Evento>(id);

    return ev ?? null;
  } catch (error) {
    console.error(`Error fetching evento ${id}:`, error);
    return null;
  }
}

/**
 * Obtener todos los eventos con autenticación desde cookies (Server Component)
 * Usar solo en Server Components
 */
export async function obtenerEventosServer(): Promise<Evento[]> {
  try {
    const pb = await loadAuthFromCookies();
    const items = await pb.collection("evento").getFullList<Evento>({
      sort: "fecha_de_inicio",
    });
    console.log("Fetched events with server auth:", items.length);
    return items;
  } catch (error) {
    console.error("Error fetching events (server):", error);
    return [];
  }
}

export function generarUrlImagen(collectionId: string, itemId: string, filename: string): string {
  return `http://127.0.0.1:8090/api/files/${collectionId}/${itemId}/${filename}`;
}
