import Link from "next/link";

type EventRecord = Record<string, unknown>;

interface EventCardProps {
  event: EventRecord;
  previewImageUrl?: string | null;
}

export default function EventCard({ event, previewImageUrl }: EventCardProps) {
  const id = String(event.id ?? "");
  const titulo = String(event.titulo ?? "Evento");
  const resumen = String(event.resumen ?? "");
  const portada = String(event.portada ?? "");
  const collectionName = String(event.collectionName ?? "eventos_pepa");

  const portadaUrl =
    previewImageUrl ??
    (portada &&
      (portada.startsWith("http")
        ? portada
        : `${process.env.NEXT_PUBLIC_PB_URL ?? "http://127.0.0.1:8090"}/api/files/${collectionName}/${id}/${portada}`));

  const cardContent = (
    <article className="snap-start card bg-base-100 shadow-md flex-shrink-0 h-[85vh] relative overflow-hidden w-full">
      {/* imagen como fondo absoluto para cubrir todo el slide */}
      {portadaUrl ? (
        <img src={portadaUrl} alt={titulo} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-base-200 flex items-center justify-center text-base-content/50">
          <span>Vista Previa</span>
        </div>
      )}

      {/* overlay para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-transparent to-transparent" />

      <div className="absolute left-4 md:left-20 lg:left-24 bottom-0 p-6 max-w-3xl">
        <h3 className="font-semibold text-3xl text-base-content">{titulo}</h3>
        <p className="text-base text-base-content/80 mt-2">{resumen}</p>
      </div>
    </article>
  );

  // Si no hay ID (estamos en modo previsualización), no envolvemos con Link
  if (!id) {
    return <div className="mx-auto no-underline w-full cursor-default">{cardContent}</div>;
  }

  return (
    <Link href={`/turismo/evento/${id}`} className="mx-auto no-underline w-full">
      {cardContent}
    </Link>
  );
}
