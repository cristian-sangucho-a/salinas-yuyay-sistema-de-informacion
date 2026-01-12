import SeccionTarjetas from "@components/turismo/SeccionTarjetas";
import TicketCalculator from "@components/turismo/TicketCalculator";
import EventsSection from "@components/turismo/EventsSection";

import { obtenerEventosServer } from "@/lib/data/turismo/eventos-server";
import { obtenerSalasMuseoServer } from "@/lib/data/turismo/salas-museo-server";
import { generarUrlImagen } from "@/lib/data/turismo/eventos";
import type { Evento, SalaMuseo } from "@/lib/types/turismo";
import Carrusel from "@components/turismo/Carrusel";
import type { CarouselItem, TarjetaItem } from "@/lib/types";

export const metadata = {
  title: "Visita — Salinas Yuyay",
};

export default async function VisitaPage() {
  // obtener todos los eventos futuros y públicos desde el servidor (sin límite)
  let events: Evento[] = [];
  let salas: TarjetaItem[] = [];
  events = await obtenerEventosServer();
  const eventos: CarouselItem[] = (events ?? []).map((ev) => ({
    id: ev.id,
    titulo: ev.titulo,
    portada: generarUrlImagen(ev.collectionId, ev.id, ev.portada),
    eslogan: ev.eslogan,
  }));

  const salasResp: SalaMuseo[] = await obtenerSalasMuseoServer();
  salas = salasResp.map((sala) => ({
    id: sala.id,
    titulo: sala.titulo,
    eslogan: sala.eslogan,
    portada: generarUrlImagen(sala.collectionId, sala.id, sala.portada),
  }));
  const eventosParaComponente = (events ?? []).map((ev) => ({
    id: ev.id,
    title: ev.titulo,
    subtitle: ev.eslogan ?? "",
    image: generarUrlImagen(ev.collectionId, ev.id, ev.portada),
    date: ev.fecha_de_inicio,
  }));
  return (
    <main className="flex-1">
      <EventsSection events={eventosParaComponente} />
      <SeccionTarjetas salas={salas} />
      <TicketCalculator />
    </main>
  );
}
