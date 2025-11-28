import Link from "next/link";
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
      className="group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative bg-base-200 aspect-3/4 overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl">{icon}</span>
        </div>
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={badgeVariant}>{badge}</Badge>
          </div>
        )}
        
        {/* Overlay con descripción en hover */}
        {description && (
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <Text variant="small" className="text-white leading-relaxed">
                {description}
              </Text>
            </div>
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="text-sm font-medium text-base-content mb-1 group-hover:underline">
          {name}
        </h3>
      </div>
    </Link>
  );
}
