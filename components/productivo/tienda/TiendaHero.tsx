import Image from "next/image";
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
  const backgroundImage = "/productivo/tienda-hero.jpg";

  return (
    <section className="relative w-full h-full flex items-center overflow-hidden">
      {/* Background Image & Overlay */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt="Fondo de tienda"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Overlay removed as requested */}
        </>
      ) : (
        <div className="absolute inset-0 bg-base-200" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16 w-full">
        <div className="flex flex-col items-start gap-4 max-w-2xl w-full">
          {/* Badge outside */}
          <div className="inline-flex items-center gap-0 overflow-hidden rounded-lg shadow-lg self-start ml-8">
            <span className=" pr-3 py-1 bg-transparent  text-white text-sm font-bold uppercase tracking-wide">
              CALIDAD
            </span>
            <span className="px-2 py-1 bg-base-300/90 backdrop-blur-md text-sm font-bold uppercase tracking-wide">
              + TRADICIÓN
            </span>
          </div>

          {/* Content */}
          <div className="space-y-0 w-full bg-base-100/90 p-8 rounded-xl backdrop-blur-sm shadow-xl">
            <Title
              variant="h1"
              serif
              className="!text-2xl md:!text-3xl lg:!text-4xl"
            >
              {title}
            </Title>
            <Title
              variant="h1"
              serif
              className="!text-3xl md:!text-3xl lg:!text-7xl"
            >
              <span className="italic text-primary">{titleHighlight}</span>
            </Title>

            <div className="sm:h-4 md:h-6 lg:h-8"></div>

            <Text
              variant="large"
              color="muted"
              className="max-w-lg leading-relaxed"
            >
              {description}
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full">
            <Link href={primaryButtonHref}>
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 text-lg font-bold"
              >
                {primaryButtonText}
                <FaChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={secondaryButtonHref}>
              <Button
                variant="neutral"
                size="lg"
                className="w-full sm:w-auto px-8 text-lg font-bold bg-base-100/80 backdrop-blur-sm hover:bg-base-100"
              >
                {secondaryButtonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
