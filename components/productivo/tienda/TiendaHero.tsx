import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import Button from "@atoms/Button";
import Text from "@atoms/Text";
import Title from "@atoms/Title";

interface TiendaHeroProps {
  title: string;
  titleHighlight: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  heroIcon?: string;
}

export default function TiendaHero({
  title,
  titleHighlight,
  description,
  primaryButtonText = "Ver categorías",
  primaryButtonHref = "/categorias",
  secondaryButtonText = "Explorar productos",
  secondaryButtonHref = "/productos",
  heroIcon = "🧀",
}: TiendaHeroProps) {
  return (
    <section className="relative bg-base-200 min-h-[600px] flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-0 overflow-hidden">
              <span className="px-1 py-1 text-base-content text-md font-medium uppercase tracking-wide">
                CALIDAD
              </span>
              <span className="px-1 py-1 bg-base-300 text-md font-medium uppercase tracking-wide">
                + TRADICIÓN
              </span>
            </div>

            <Title variant="h1" serif>
              {title}
              <br />
              <span className="italic">{titleHighlight}</span>
            </Title>

            <Text
              variant="large"
              color="muted"
              className="max-w-lg leading-relaxed"
            >
              {description}
            </Text>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href={primaryButtonHref}>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {primaryButtonText}
                  <FaChevronRight className="w-3 h-3 ml-2" />
                </Button>
              </Link>
              <Link href={secondaryButtonHref}>
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  {secondaryButtonText}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative aspect-4/3 max-w-xl mx-auto bg-base-300/50 overflow-hidden">
              {/* Placeholder for product image */}
              <div className="w-full h-full bg-linear-to-br from-base-200 to-base-300 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-32 h-32 mx-auto bg-base-100/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-5xl">{heroIcon}</span>
                  </div>
                  <Text variant="large" className="font-medium">
                    Productos Destacados
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
