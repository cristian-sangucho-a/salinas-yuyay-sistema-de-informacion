import { notFound } from "next/navigation";
import { getSalaMuseoPublicaById, getFileUrl } from "@/lib/data";
import type { SalaMuseo } from "@/lib/types";

interface Props {
  params: {
    id: string;
  };
}

export default async function SalaPage({ params }: Props) {
  const { id } = params;
  let sala: SalaMuseo | null = null;
  try {
    sala = await getSalaMuseoPublicaById(id);
  } catch {
    return notFound();
  }

  if (!sala) return notFound();

  const r = sala as unknown as Record<string, unknown>;
  const titulo = String(r.titulo ?? r["titulo"] ?? "Sala del museo");
  const resumen = String(r.resumen ?? r["resumen"] ?? "");
  const contenido = String(r.contenido ?? r["contenido"] ?? resumen);
  const portada = String(r.portada ?? r["portada"] ?? "");
  const rawGaleria = r.galeria ?? r["galeria"];
  const galeria: string[] = Array.isArray(rawGaleria)
    ? (rawGaleria as unknown[]).map((filename) => {
        const tempRecord = { ...sala, galeria: filename };
        return getFileUrl(tempRecord as any, "galeria");
      }).filter((url): url is string => url !== null)
    : [];

  const portadaUrl = getFileUrl(sala as any, "portada");

  return (
    <main className="flex-1">
      <article className="max-w-4xl mx-auto my-8">
        {portadaUrl && (
          <div className="w-full h-72 md:h-96 overflow-hidden rounded-b-md">
            <img src={portadaUrl} alt={titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{titulo}</h1>
          {resumen && <p className="text-base-content/70 mb-6">{resumen}</p>}
          <div className="prose max-w-none text-base-content/90 mt-4">
            {contenido.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {galeria.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {galeria.map((url, index) => (
                  <div key={`gallery-${index}`} className="h-44 overflow-hidden rounded shadow-sm">
                    <img src={url} alt={`Imagen de galería ${index + 1}`} className="w-full h-full object-cover" />
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
