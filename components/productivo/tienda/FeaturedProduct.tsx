import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';

interface FeaturedProductProps {
  title: string;
  description: string;
  features: string[];
  buttonText?: string;
  buttonHref: string;
  imageIcon?: string;
}

export default function FeaturedProduct({
  title,
  description,
  features,
  buttonText = 'EXPLORAR AHORA',
  buttonHref,
  imageIcon = '🧀',
}: FeaturedProductProps) {
  return (
    <section className="py-16 md:py-24 bg-[#F5EDE7]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 order-2 lg:order-1 animate-in fade-in slide-in-from-left duration-700">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3C2A21] leading-tight">
              {title}
            </h2>
            <p className="text-lg text-[#6B5B52] leading-relaxed">
              {description}
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-[#6B5B52]">
                  <div className="w-2 h-2 rounded-full bg-[#5A1E02] shrink-0"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <Link
                href={buttonHref}
                className="bg-[#5A1E02] hover:bg-[#4A1602] text-white px-8 py-4 rounded-md text-sm font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                {buttonText}
                <FaChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2 animate-in fade-in slide-in-from-right duration-700 delay-200">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
              <div className="w-full h-full bg-linear-to-br from-[#E8DDD5] to-[#D4C4B8] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <span className="text-8xl">{imageIcon}</span>
                  <p className="text-xl font-bold text-[#3C2A21]">
                    Producto Destacado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
