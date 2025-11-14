import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import Badge from "@atoms/Badge";

interface CollectionCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  badgeVariant?: "primary" | "secondary" | "accent" | "neutral";
  delay?: number;
}

export default function CollectionCard({
  name,
  description,
  icon,
  href,
  badge,
  badgeVariant = "primary",
  delay = 0,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className="group block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative bg-base-200 aspect-[3/4] overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl">{icon}</span>
        </div>
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={badgeVariant}>{badge}</Badge>
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
