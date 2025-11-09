import Link from "next/link";
import MuseumCard from "./MuseumCard";

interface Sala {
  id: string;
  title?: string;
  description?: string;
  image?: string;
}

interface SeccionMuseoProps {
  salas: Sala[];
}

/**
 * SeccionMuseo
 * Componente que renderiza la sección "Museo" con una lista de salas.
 */
export default function SeccionMuseo({ salas }: SeccionMuseoProps) {
  return (
    <section id="museo" className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold">Museo</h2>
      <p className="text-base-content/70 mt-1">Recorre las salas y conoce la historia de la sal y los oficios.</p>
      <div className="mt-6">
        {salas.length > 0 ? (
          salas.map((s, i) => (
            <Link key={`${s.id}`} href={`/turismo/museo/${s.id}`} className="block">
              <MuseumCard title={s.title ?? ""} image={s.image} description={s.description} reverse={i % 2 === 1} />
            </Link>
          ))
        ) : (
          <p className="text-base-content/60">No hay salas disponibles por el momento.</p>
        )}
      </div>
    </section>
  );
}
