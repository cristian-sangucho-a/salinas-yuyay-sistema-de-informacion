import Link from "next/link";
import Image from "next/image";
import Badge from "@atoms/Badge";
import Text from "@atoms/Text";
import type { Categoria } from "@/lib/types/productivo";

interface CategoriaCardProps extends Categoria {
  delay?: number;
}

export default function CategoriaCard({
  name,
  description,
  icon,
  href,
  badge,
  badgeVariant = "primary",
  delay = 0,
}: CategoriaCardProps) {
  return (
    <Link
      href={href}
      className="group block relative"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative bg-base-200 aspect-[3/4] overflow-hidden mb-4 group-hover:shadow-2xl transition-all duration-500 rounded-2xl">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Image
            src={icon}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Dark Overlay Gradient on Hover */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />

        {badge && (
          <div className="absolute top-4 left-4 z-10">
            <Badge
              variant={badgeVariant}
              className="shadow-lg backdrop-blur-md"
            >
              {badge}
            </Badge>
          </div>
        )}

        {/* Overlay con descripción en hover */}
        {description && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center">
            <div className="p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center text-center">
              <div className="w-12 h-1 bg-primary mb-4 rounded-full"></div>
              <Text
                variant="small"
                className="text-white/95 font-medium leading-relaxed mb-4 drop-shadow-md"
              >
                {description}
              </Text>
              <div className="px-5 py-2 border border-white/30 rounded-full text-xs text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                Ver Colección
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center px-2">
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors duration-300 font-serif">
          {name}
        </h3>
        <div className="h-0.5 w-0 bg-primary mx-auto group-hover:w-16 transition-all duration-500 ease-out"></div>
      </div>
    </Link>
  );
}
