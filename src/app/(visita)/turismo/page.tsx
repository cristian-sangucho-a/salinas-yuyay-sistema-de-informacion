import EventsCarousel from "@components/turismo/EventsCarousel";
import MuseumCard from "@components/turismo/MuseumCard";
import TicketCalculator from "@components/turismo/TicketCalculator";
import Link from "next/link";
import { PB_URL, getEvents, getSalasMuseo } from "@/lib/pocketbase";

export const metadata = {
  title: "Visita — Salinas Yuyay",
};

export default async function VisitaPage() {
  // obtener primeros 6 eventos desde PocketBase (server)
  let eventsResponse: { items?: Record<string, unknown>[] };
  try {
    eventsResponse = await getEvents(6);
  } catch {
    // en caso de error, usar lista vacía
    eventsResponse = { items: [] };
  }

  const events = eventsResponse.items || [];

  // obtener salas del museo desde la ruta REST solicitada
  let salasResp: Awaited<ReturnType<typeof getSalasMuseo>> = {
    items: [],
    page: 1,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
  };
  try {
    salasResp = await getSalasMuseo({ perPage: 30 });
  } catch {
    // mantener default vacío si falla
  }

  const salas = (salasResp.items ?? []).map((it) => ({
    id: it.id,
    title: it.Titulo,
    description: it.Resumen,
    // construir URL de portada si existe
    image: it.Portada ? `${PB_URL}/api/files/${it.collectionName}/${it.id}/${it.Portada}` : undefined,
  }));

  return (
    <main className="flex-1">
      {/* Carrusel mostrado al inicio */}
      <EventsCarousel events={events.map((it) => ({ ...(it as Record<string, unknown>) }))} />

      <section id="museo" className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold">Museo</h2>
        <p className="text-base-content/70 mt-1">Recorre las salas y conoce la historia de la sal y los oficios.</p>
        <div className="mt-4">
          <Link href="/museo/crear-inline" className="btn btn-sm btn-outline">Crear nueva sala</Link>
        </div>

        <div className="mt-6">
          {salas.length > 0 ? (
            salas.map((s, i) => (
              <Link key={`${s.id}`} href={`/turismo/museo/${s.id}`} className="block">
                <MuseumCard title={s.title} image={s.image} description={s.description} reverse={i % 2 === 1} />
              </Link>
            ))
          ) : (
            <p className="text-base-content/60">No hay salas disponibles por el momento.</p>
          )}
        </div>
      </section>

      <TicketCalculator />
    </main>
  );
}
