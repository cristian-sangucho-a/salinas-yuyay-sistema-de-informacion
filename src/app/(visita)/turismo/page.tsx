import EventsCarousel from "@components/turismo/EventsCarousel";
import SeccionMuseo from "@components/turismo/SeccionMuseo";
import TicketCalculator from "@components/turismo/TicketCalculator";
import { getSalasMuseoPublicas, getUpcomingPublicEvents, getFileUrl } from "@/lib/data";
import type { SalaMuseo, Evento } from "@/lib/types";

export const metadata = {
  title: "Visita — Salinas Yuyay",
};

export default async function VisitaPage() {
  // obtener todos los eventos futuros y públicos desde el servidor (sin límite)
  let events: Evento[] = [];
  try {
    events = await getUpcomingPublicEvents();
  } catch {
    events = [];
  }

  // obtener salas del museo públicas (ocultar = false)
  let salas: Array<{ id: string; title: string; description?: string; image?: string }> = [];
  try {
    const salasResp: SalaMuseo[] = await getSalasMuseoPublicas();
    salas = salasResp.map((s) => {
      const imageUrl = getFileUrl(s as any, "portada");
      return {
        id: s.id,
        title: s.titulo ?? "",
        description: s.resumen,
        image: imageUrl ?? undefined,
      };
    });
  } catch {
    // en caso de error, usar lista vacía
    salas = [];
  }

  return (
    <main className="flex-1">
      <EventsCarousel events={events.map((it) => ({ ...(it as unknown as Record<string, unknown>) }))} />
      <SeccionMuseo salas={salas} />
      <TicketCalculator />
    </main>
  );
}
