import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getSalaMuseoByIdServer,
  generarUrlImagenSala,
} from "@/lib/data/turismo/salas-museo-server";
import type { SalaMuseo } from "@/lib/types/turismo";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SalaPage({ params }: Props) {
  const { id } = await params;
  const sala: SalaMuseo | null = await getSalaMuseoByIdServer(id);
  if (!sala) return notFound();

  return (
    <main className="flex-1">
      <article className="max-w-4xl mx-auto my-8">
        {sala.portada && (
          <div className="w-full h-72 md:h-96 overflow-hidden rounded-b-md relative">
            <Image
              src={generarUrlImagenSala(
                sala.collectionId,
                sala.id,
                sala.portada
              )}
              alt={sala.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{sala.titulo}</h1>
          {sala.resumen && (
            <p className="text-base-content/70 mb-6">{sala.resumen}</p>
          )}
          <div className="prose max-w-none text-base-content/90 mt-4 whitespace-pre-wrap">
            {sala.contenido}
          </div>

          {sala.galeria.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {sala.galeria.map((url, index) => (
                  <div
                    key={`gallery-${index}`}
                    className="h-44 overflow-hidden rounded shadow-sm relative"
                  >
                    <Image
                      src={generarUrlImagenSala(
                        sala.collectionId,
                        sala.id,
                        url
                      )}
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
