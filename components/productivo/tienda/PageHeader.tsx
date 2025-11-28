import Title from "@atoms/Title";
import Text from "@atoms/Text";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <section className="bg-base-200 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Breadcrumb */}
        <div className="mb-2">
          <Breadcrumb items={breadcrumbs} />
        </div>

        {/* Title and Badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <Title variant="h1" serif className="mb-0 text-2xl md:text-3xl">
              {title}
            </Title>
            {badge && <div className="mt-2">{badge}</div>}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>

        {/* Description */}
        {description && (
          <Text
            variant="body"
            color="muted"
            className="max-w-3xl text-sm md:text-base"
          >
            {description}
          </Text>
        )}
      </div>
    </section>
  );
}
