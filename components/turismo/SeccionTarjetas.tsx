import Link from "next/link";
import MuseumCard from "./Tarjeta";
import type { TarjetaItem } from "@/lib/types";
/**
 * SeccionMuseo
 * Componente que renderiza la sección "Museo" con una lista de salas.
 */
export default function SeccionTarjetas(items: { salas: TarjetaItem[] }) {
  const list: TarjetaItem[] = items.salas ?? [];
  return (
    <section id="museo" className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Museo</h2>
      <p className="text-base-content/70 mt-1">Recorre las salas y conoce la historia de la sal y los oficios.</p>
      <div className="mt-6">
        {list.length > 0 ? (
          list.map((item, i) => (
            <Link key={`${item.id}`} href={`/turismo/museo/${item.id}`} className="block">
              <MuseumCard item={item} reverse={i % 2 === 1} />
            </Link>
          ))
        ) : (
          <p className="text-base-content/60">No hay salas disponibles por el momento.</p>
        )}
      </div>
    </section>
  );
}
