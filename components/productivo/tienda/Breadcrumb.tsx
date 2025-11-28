import Link from "next/link";
import { FaChevronRight, FaHome } from "react-icons/fa";
import Text from "@atoms/Text";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
      {/* Home */}
      <Link
        href="/tienda"
        className="text-base-content/60 hover:text-primary transition-colors"
      >
        <FaHome className="w-4 h-4" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <FaChevronRight className="w-3 h-3 text-base-content/40" />
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-base-content/60 hover:text-primary transition-colors"
              >
                <Text variant="small">{item.label}</Text>
              </Link>
            ) : (
              <Text
                variant="small"
                className={isLast ? "text-base-content font-medium" : ""}
              >
                {item.label}
              </Text>
            )}
          </div>
        );
      })}
    </nav>
  );
}
