import { notFound } from "next/navigation";
import { getEventoById, getFileUrl } from "@/lib/data";
import type { Evento } from "@/lib/types";

interface Props {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: Props) {
  const { id } = params;
  let evento: Evento | null = null;
  try {
    evento = await getEventoById(id);
  } catch {
    return notFound();
  }

  if (!evento) return notFound();

  const r = evento as unknown as Record<string, unknown>;
  const titulo = String(r.titulo ?? r["titulo"] ?? "Evento");
  const contenido = String(r.contenido ?? r["contenido"] ?? r.resumen ?? r["resumen"] ?? "");
  const portada = String(r.portada ?? r["portada"] ?? "");
  const galeria: string[] = Array.isArray(r.galeria ?? r["galeria"]) ? ((r.galeria ?? r["galeria"]) as unknown[]).map((x) => String(x)) : [];

  // Leer fechas y organizadores manejando variantes de nombre
  const rawInicio = r.fecha_inicio ?? r["fecha_inicio"] ?? r.fecha_de_inicio ?? r["fecha_de_inicio"] ?? r.fechaInicio ?? r["fechaInicio"];
  const rawFin = r.fecha_fin ?? r["fecha_fin"] ?? r.fecha_de_fin ?? r["fecha_de_fin"] ?? r.fechaFin ?? r["fechaFin"];
  const organizadores = String(r.organizadores ?? r["organizadores"] ?? "");

  const parseDate = (v: unknown): Date | null => {
    if (!v) return null;
    if (v instanceof Date) return v;
    const s = String(v);
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  };

  const fmt = (d: Date | null) =>
    d
      ? new Intl.DateTimeFormat("es", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(d)
      : null;

  const fechaInicio = fmt(parseDate(rawInicio));
  const fechaFin = fmt(parseDate(rawFin));

  const portadaUrl = getFileUrl(evento as any, "portada");
  
  // Procesar galería usando getFileUrl para cada imagen
  const galeriaUrls: string[] = galeria
    .map((filename) => {
      // Crear un objeto temporal para usar con getFileUrl
      const tempRecord = { ...evento, galeria: filename };
      return getFileUrl(tempRecord as any, "galeria");
    })
    .filter((url): url is string => url !== null);

  return (
    <main className="flex-1">
      <article className="max-w-4xl mx-auto my-8">
        {portadaUrl && (
          <div className="w-full h-72 md:h-96 overflow-hidden rounded-b-md">
            <img src={portadaUrl} alt={titulo} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{titulo}</h1>
          {(fechaInicio || fechaFin || organizadores) && (
            <div className="text-sm text-base-content/70 flex flex-wrap gap-x-6 gap-y-2 mb-4">
              {fechaInicio && (
                <div>
                  <span className="font-semibold">Inicio:</span> {fechaInicio}
                </div>
              )}
              {fechaFin && (
                <div>
                  <span className="font-semibold">Fin:</span> {fechaFin}
                </div>
              )}
              {organizadores && (
                <div>
                  <span className="font-semibold">Organizadores:</span> {organizadores}
                </div>
              )}
            </div>
          )}
          <div className="prose max-w-none text-base-content/90 mt-4">
            {contenido.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {galeriaUrls.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {galeriaUrls.map((url, index) => (
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
