import Link from "next/link";
import { CarouselItem } from "@/lib/types";

interface CoverCardProps {
  item: CarouselItem;
}

export default function CoverCard({ item }: CoverCardProps) {

  const cardContent = (
    <article className="snap-start card bg-base-100 shadow-md flex-shrink-0 h-[85vh] relative overflow-hidden w-full">
      {/* imagen como fondo absoluto para cubrir todo el slide */}
      {item.portada ? (
        <img src={item.portada} alt={item.titulo} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-base-200 flex items-center justify-center text-base-content/50">
          <span>Vista Previa</span>
        </div>
      )}

      {/* overlay para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-transparent to-transparent" />

      <div className="absolute left-4 md:left-20 lg:left-24 bottom-0 p-6 max-w-3xl">
        <h3 className="font-semibold text-3xl text-base-content">{item.titulo}</h3>
        <p className="text-base text-base-content/80 mt-2">{item.eslogan}</p>
      </div>
    </article>
  );

  // Si no hay ID (estamos en modo previsualización), no envolvemos con Link
  if (!item.id) {
    return <div className="mx-auto no-underline w-full cursor-default">{cardContent}</div>;
  }

  return (
    <Link href={`/turismo/evento/${item.id}`} className="mx-auto no-underline w-full">
      {cardContent}
    </Link>
  );
}
