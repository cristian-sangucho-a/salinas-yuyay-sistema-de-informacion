import { notFound } from "next/navigation";
import { buildImageUrl, getSalaById } from "@/lib/pocketbase";

interface Props {
  params: {
    id: string;
  };
}

export default async function SalaPage({ params }: Props) {
  const { id } = params;
  let record: Record<string, unknown>;
  try {
    record = await getSalaById(id);
  } catch {
    return notFound();
  }

  const r = record as Record<string, unknown>;
  const titulo = String(r.Titulo ?? r["Titulo"] ?? "Sala del museo");
  const resumen = String(r.Resumen ?? r["Resumen"] ?? "");
  const contenido = String(r.Contenido ?? r["Contenido"] ?? resumen);
  const portada = String(r.Portada ?? r["Portada"] ?? "");
  const rawGaleria = r.Galeria ?? r["Galeria"];
  const galeria: string[] = Array.isArray(rawGaleria)
    ? (rawGaleria as unknown[]).map((x) => String(x))
    : [];

  const portadaUrl = portada ? buildImageUrl(record, portada) : null;

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
                {galeria.map((f) => (
                  <div key={f} className="h-44 overflow-hidden rounded shadow-sm">
                    <img src={buildImageUrl(record, f)} alt={f} className="w-full h-full object-cover" />
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
