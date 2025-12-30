import { notFound } from "next/navigation";
import Image from "next/image";
import {
  obtenerEventoByIdServer,
  generarUrlImagen,
} from "@/lib/data/turismo/eventos-server";
import type { Evento } from "@/lib/types/turismo";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const evento: Evento | null = await obtenerEventoByIdServer(id);
  if (!evento) return notFound();

  return (
    <main className="flex-1">
      <article className="max-w-4xl mx-auto my-8">
        {evento.portada && (
          <div className="w-full h-72 md:h-96 overflow-hidden rounded-b-md relative">
            <Image
              src={generarUrlImagen("evento", evento.id, evento.portada)}
              alt={evento.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            {evento.titulo}
          </h1>

          <div className="text-sm text-base-content/70 flex flex-wrap gap-x-6 gap-y-2 mb-4">
            {evento.fecha_de_inicio && (
              <div>
                <span className="font-semibold">Inicio:</span>{" "}
                {formatDDMMYYYY(evento.fecha_de_inicio)}
              </div>
            )}
            {evento.fecha_de_finalizacion && (
              <div>
                <span className="font-semibold">Fin:</span>{" "}
                {formatDDMMYYYY(evento.fecha_de_finalizacion)}
              </div>
            )}
            {evento.organizadores && (
              <div>
                <span className="font-semibold">Organizadores:</span>{" "}
                {evento.organizadores}
              </div>
            )}
          </div>

          <div
            className="prose max-w-none text-base-content/90 mt-4 evento-content"
            dangerouslySetInnerHTML={{ __html: evento.contenido || "" }}
          />

          {evento.galeria.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {evento.galeria.map((url, index) => (
                  <div
                    key={`gallery-${index}`}
                    className="h-44 overflow-hidden rounded shadow-sm relative"
                  >
                    <Image
                      src={generarUrlImagen("evento", evento.id, url)}
                      alt={`Imagen de galería ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}

function formatDDMMYYYY(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}