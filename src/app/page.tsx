"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaShoppingBag,
  FaLandmark,
  FaMapMarkedAlt,
  FaArrowRight,
  FaLeaf,
  FaHistory,
  FaTicketAlt,
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaBars,
  FaGlobeAmericas,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import Title from "@atoms/Title";
import Text from "@atoms/Text";
import Button from "@atoms/Button";
import Footer from "./(visita)/Footer";
import Navbar from "./(visita)/Header";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@components/productivo/tienda/CartDrawer";
import { SALINAS_YUYAY } from "../../utils/empresa";

const iconMap: Record<string, React.ReactElement> = {
  FaShoppingBag: <FaShoppingBag />,
  FaLandmark: <FaLandmark />,
  FaMapMarkedAlt: <FaMapMarkedAlt />,
  FaLeaf: <FaLeaf />,
  FaHistory: <FaHistory />,
  FaTicketAlt: <FaTicketAlt />,
  FaUser: <FaUser />,
  FaGlobeAmericas: <FaGlobeAmericas />,
  FaArrowRight: <FaArrowRight />,
  FaSearch: <FaSearch />,
  FaShoppingCart: <FaShoppingCart />,
  FaBars: <FaBars />,
  FaInstagram: <FaInstagram />,
  FaFacebook: <FaFacebook />,
  FaTwitter: <FaTwitter />,
  FaMapMarkerAlt: <FaMapMarkerAlt />,
  FaEnvelope: <FaEnvelope />,
  FaPhone: <FaPhone />,
};

// --- Componentes Internos para esta Página ---

// 1. Componente de Partículas (Fondo Atmosférico Global) - ELIMINADO
// const ParticleBackground = () => { ... }

// 2. Componente de Portal Interactivo
interface PortalProps {
  title: string;
  subtitle: string;
  icon: string;
  bgImage: string;
  colorClass: string;
  id: string;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onExpand: () => void;
}

const Portal = ({
  title,
  subtitle,
  icon,
  bgImage,
  colorClass,
  id,
  isActive,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onExpand,
}: PortalProps) => {
  const isProductivo = id === "productivo";
  const isCultural = id === "cultural";
  const isTurismo = id === "turismo";

  return (
    <div
      onClick={onClick}
      className={`relative flex-1 min-w-[100px] transition-all duration-1000 ease-in-out overflow-hidden group border-r border-white/10 last:border-r-0 cursor-pointer
        ${isActive ? "flex-3 md:flex-4" : "flex-1 hover:flex-[1.5]"}
      `}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Fondo Imagen - Modificado para ser transparente y mostrar el fondo principal */}
      <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
        <div
          className={`absolute inset-0 ${colorClass} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}
        ></div>

        {/* Imagen de fondo específica para Tienda (Productivo) */}
        {id === "productivo" && (
          <div
            className={`absolute inset-0 bg-[url('/productivo/subseccion-tienda.jpeg')] bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          ></div>
        )}

        {/* Imagen de fondo específica para Archivo (Cultural) */}
        {id === "cultural" && (
          <div
            className={`absolute inset-0 bg-[url('/cultural/subseccion-archivo.jpeg')] bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          ></div>
        )}

        {/* Imagen de fondo específica para Turismo */}
        {id === "turismo" && (
          <div
            className={`absolute inset-0 bg-[url('/turistico/subsecccion-turismo.jpg')] bg-cover bg-center transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          ></div>
        )}
      </div>

      {/* Overlay Gradiente */}
      <div
        className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-500 ${
          isActive ? "opacity-80" : "opacity-60 group-hover:opacity-70"
        }`}
      ></div>

      {/* Contenedor Flex para Contenido (Evita traslape) */}
      <div
        className={`absolute inset-0 z-20 flex flex-col md:justify-end md:pt-0 transition-all duration-500
          ${
            isProductivo && !isActive
              ? "justify-start pt-36"
              : "justify-end pt-16"
          }
        `}
      >
        {/* Parte Superior: Paneles Interactivos (Subsecciones) - Oculto en móvil */}
        <div
          className={`relative w-full transition-all duration-700 ease-in-out hidden md:block ${
            isActive ? "md:h-[50%] md:flex-none" : "h-0 overflow-hidden"
          }`}
        >
          {isActive && (
            <div className="absolute inset-0 flex flex-col md:pt-20">
              {/* Elementos específicos de Tienda (Productivo) */}
              {isProductivo && (
                <div className="flex-1 flex flex-col animate-fade-in">
                  {/* Fila Superior: Categorías y Productos */}
                  <div className="flex-1 flex border-b border-white/10">
                    <Link
                      href="/categorias"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 border-r border-white/10 group/panel relative overflow-hidden hover:bg-white/5 transition-colors"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 transform group-hover/panel:scale-105 transition-transform duration-500">
                        <span className="font-bold text-sm md:text-lg mb-1 text-center leading-tight">
                          Ver categorías
                        </span>
                        <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-widest text-center hidden md:block">
                          de productos
                        </span>
                      </div>
                    </Link>
                    <Link
                      href="/productos"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 group/panel relative overflow-hidden hover:bg-white/5 transition-colors"
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 transform group-hover/panel:scale-105 transition-transform duration-500">
                        <span className="font-bold text-sm md:text-lg mb-1 text-center leading-tight">
                          Ver productos
                        </span>
                        <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-widest text-center hidden md:block">
                          Explorar todo
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* Fila Inferior: Ir a la Tienda */}
                  <Link
                    href="/tienda"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 group/panel relative overflow-hidden hover:bg-white/5 transition-colors"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 transform group-hover/panel:scale-105 transition-transform duration-500">
                      <span className="font-bold text-sm md:text-lg mb-1 text-center leading-tight">
                        Ir a la tienda
                      </span>
                      <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-widest text-center hidden md:block">
                        principal
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Elementos específicos de Cultural */}
              {isCultural && (
                <div className="flex-1 flex flex-col animate-fade-in">
                  <Link
                    href="/cultural"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 group/panel relative overflow-hidden hover:bg-white/5 transition-colors"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 transform group-hover/panel:scale-105 transition-transform duration-500">
                      <span className="font-bold text-sm md:text-lg mb-1 text-center leading-tight">
                        Explorar archivo
                      </span>
                      <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-widest text-center hidden md:block">
                        histórico y cultural
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Elementos específicos de Turismo */}
              {isTurismo && (
                <div className="flex-1 flex flex-col animate-fade-in">
                  <Link
                    href="/turismo"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 group/panel relative overflow-hidden hover:bg-white/5 transition-colors"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 transform group-hover/panel:scale-105 transition-transform duration-500">
                      <span className="font-bold text-sm md:text-lg mb-1 text-center leading-tight">
                        Planificar visita
                      </span>
                      <span className="text-[10px] md:text-xs opacity-80 uppercase tracking-widest text-center hidden md:block">
                        turismo comunitario
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Parte Inferior: Texto Principal */}
        <div className="shrink-0 p-6 md:p-12 flex flex-col justify-end items-center text-center relative">
          <div
            className={`mb-6 transform transition-all duration-1000 ease-out ${
              isActive
                ? "scale-100 translate-y-0"
                : "scale-90 translate-y-4 opacity-100"
            }`}
          >
            {/* Icono sin background */}
            <div
              className={`flex items-center justify-center text-white drop-shadow-lg ${
                isActive ? "animate-pulse-slow" : ""
              }`}
            >
              {React.isValidElement(iconMap[icon])
                ? React.cloneElement(iconMap[icon], {
                    size: 70, // Aumentado significativamente y con más opacidad
                  } as { size: number })
                : null}
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ease-out w-full ${
              isActive
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-90"
            }`}
          >
            <h2 className="text-2xl md:text-5xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
              {title}
            </h2>
            <div className="w-full flex flex-col items-center gap-4 mt-2">
              <p
                className={`text-white/80 text-sm md:text-lg max-w-md transition-all ${
                  isActive
                    ? "duration-500 delay-100 opacity-100 max-h-20"
                    : "duration-200 delay-0 opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <span className="hidden md:inline">{subtitle}</span>
              </p>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                className={`flex items-center text-accent font-bold uppercase tracking-widest text-sm md:text-xl whitespace-nowrap transition-all cursor-pointer hover:text-white ${
                  isActive
                    ? "duration-500 delay-200 opacity-100 translate-x-0"
                    : "duration-200 delay-0 opacity-0 -translate-x-4"
                }`}
              >
                Leer más <FaArrowRight className="ml-3 animate-bounce-x" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4.5 Componente de Pestañas de Sección
const SectionTabs = ({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) => {
  const portals = SALINAS_YUYAY.landing.hero.portals;

  return (
    <div className="flex justify-center mb-6 animate-fade-in-down w-full">
      <div className="overflow-x-auto max-w-full pb-2 no-scrollbar px-1">
        <div className="bg-base-200/50 backdrop-blur-sm p-1 rounded-2xl md:rounded-full inline-flex shadow-lg border border-white/10 min-w-max">
          {portals.map((portal) => {
            const isActive = activeSection === portal.id;
            return (
              <button
                key={portal.id}
                onClick={() => onSectionChange(portal.id)}
                className={`px-4 py-2 md:px-6 md:py-2.5 rounded-xl md:rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? "text-white shadow-md scale-105"
                    : "text-base-content/60 hover:text-base-content hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <div
                    className={`absolute inset-0 ${portal.colorClass} opacity-100 -z-10`}
                  ></div>
                )}
                <span className="relative z-10">{portal.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 4. Componente de Contenido Dinámico
const DynamicContent = ({ section }: { section: string | null }) => {
  if (!section) return null;

  const content = SALINAS_YUYAY.landing.dynamicContent;
  const data = content[section as keyof typeof content];

  if (!data) return null;

  return (
    <div className="animate-fade-in-up py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-0 overflow-hidden">
            <span
              className={`px-2 py-1 ${data.bg} ${data.color} text-sm font-medium uppercase tracking-wide rounded-md`}
            >
              {data.subtitle}
            </span>
          </div>

          <Title variant="h1" serif className={data.color}>
            {data.title}
          </Title>

          <Text variant="large" color="muted" className="leading-relaxed">
            {data.description}
          </Text>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {data.features.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/50 border border-base-200 backdrop-blur-sm hover:bg-white transition-colors"
              >
                <div className={`${data.color} text-2xl mb-2`}>
                  {iconMap[f.icon]}
                </div>
                <Text variant="small" className="font-bold">
                  {f.title}
                </Text>
                <Text variant="caption" color="muted">
                  {f.text}
                </Text>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Link href={data.link}>
              <Button
                variant={
                  data.color.replace("text-", "") as
                    | "primary"
                    | "secondary"
                    | "neutral"
                }
                size="lg"
                className="shadow-lg hover:scale-105 transition-transform text-white"
              >
                {data.cta} <FaArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual Preview (Placeholder) */}
        <div
          className={`aspect-video rounded-3xl overflow-hidden shadow-2xl relative group ${data.bg}`}
        >
          <div
            className={`absolute inset-0 bg-linear-to-br ${data.color.replace(
              "text-",
              "from-"
            )} to-black/50 opacity-40`}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl opacity-20 text-white mix-blend-overlay font-black">
              {section.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Ticker de Estadísticas (Barra inferior animada)
const StatsTicker = () => {
  const stats = SALINAS_YUYAY.landing.statsTicker;

  return (
    <div className="bg-base-content text-base-100 py-3 overflow-hidden relative z-30 border-t border-white/10">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <div
            key={i}
            className="flex items-center mx-8 opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="text-neutral mr-2">{iconMap[stat.icon]}</span>
            <span className="text-sm font-medium tracking-wider uppercase">
              {stat.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Sección de Impacto (Social Proof)
const ImpactSection = () => {
  const { title, stats } = SALINAS_YUYAY.landing.impact;

  return (
    <section className="py-20 relative z-10 bg-primary text-primary-content overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative">
        <Title variant="h2" className="mb-12 text-primary-content">
          {title}
        </Title>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors"
            >
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-neutral">
                {stat.value}
              </div>
              <Text variant="small" className="opacity-90 text-primary-content">
                {stat.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 6. Sección FAQ (SEO Rich Snippets)
const FAQSection = () => {
  const { title, subtitle, items } = SALINAS_YUYAY.landing.faq;

  return (
    <section className="py-24 relative z-10 bg-base-100">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <span className="text-secondary font-bold tracking-widest uppercase text-sm">
            {subtitle}
          </span>
          <Title variant="h2" className="mt-2">
            {title}
          </Title>
        </div>

        <div className="space-y-4">
          {items.map((faq, i) => (
            <div
              key={i}
              className="collapse collapse-plus bg-base-200 rounded-xl border border-base-300 hover:border-primary/50 transition-colors"
            >
              <input
                type="radio"
                name="my-accordion-3"
                defaultChecked={i === 0}
              />
              <div className="collapse-title text-lg font-medium text-primary">
                {faq.q}
              </div>
              <div className="collapse-content text-base-content/80">
                <Text>{faq.a}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 7. Sección de Contacto y Ubicación
const ContactSection = () => {
  const { title, subtitle, description, location, email, phone, mapButton } =
    SALINAS_YUYAY.landing.contact;

  return (
    <section id="contacto" className="py-24 relative z-10 bg-base-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-sm">
              {subtitle}
            </span>
            <Title variant="h2" className="mt-2">
              {title}
            </Title>
            <Text variant="large" color="muted" className="mt-4">
              {description}
            </Text>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{location.title}</h4>
                <Text color="muted">{location.address}</Text>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{email.title}</h4>
                <Text color="muted">{email.address}</Text>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral/10 text-neutral-content flex items-center justify-center shrink-0">
                <FaPhone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{phone.title}</h4>
                <Text color="muted">{phone.number}</Text>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa Simulado / Imagen */}
        <div className="h-[400px] bg-base-300 rounded-3xl overflow-hidden shadow-xl relative group">
          {/* Aquí iría un Google Maps iframe o imagen estática */}
          <div className="absolute inset-0 bg-[url('/images/map-placeholder.jpg')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Button
              variant="primary"
              size="lg"
              className="shadow-lg animate-bounce"
            >
              <FaMapMarkedAlt className="mr-2" /> {mapButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const router = useRouter();
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [headerThreshold, setHeaderThreshold] = useState(20);

  useEffect(() => {
    // Ajustar el umbral para que el header cambie justo al pasar la sección Hero
    // Restamos un poco para asegurar la transición suave antes de llegar al contenido
    setHeaderThreshold(window.innerHeight - 100);

    const handleResize = () => {
      setHeaderThreshold(window.innerHeight - 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleExpandClick = (section: string) => {
    setSelectedSection(section);
    // Scroll suave hacia la sección de contenido
    const contentElement = document.getElementById("dynamic-content");
    if (contentElement) {
      setTimeout(() => {
        contentElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handlePortalClick = (section: string) => {
    if (section === "productivo") {
      router.push("/tienda");
    } else if (section === "cultural") {
      router.push("/cultural");
    } else if (section === "turismo") {
      router.push("/turismo");
    }
  };

  return (
    <CartProvider>
      <Navbar variant="transparent" scrollThreshold={headerThreshold} />
      <CartDrawer />
      <main className="min-h-screen w-full flex flex-col bg-base-300 font-sans overflow-x-hidden">
        {/* SECCIÓN 1: PORTALES (HERO) - Ocupa toda la pantalla inicial */}
        <section className="h-screen flex flex-col relative">
          {/* Contenedor Principal de Portales */}
          <div className="flex-1 flex flex-col md:flex-row relative">
            {/* Fondo Global con Partículas (Visible en las uniones y fondo) */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[url('/vista-superior-salinas.png')] bg-cover bg-center opacity-100"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {SALINAS_YUYAY.landing.hero.portals.map((portal) => (
              <Portal
                key={portal.id}
                id={portal.id}
                title={portal.title}
                subtitle={portal.description}
                icon={portal.icon}
                bgImage={portal.bgImage}
                colorClass={portal.colorClass}
                isActive={activePortal === portal.id}
                onMouseEnter={() => setActivePortal(portal.id)}
                onMouseLeave={() => setActivePortal(null)}
                onClick={() => handlePortalClick(portal.id)}
                onExpand={() => handleExpandClick(portal.id)}
              />
            ))}
          </div>

          {/* Ticker al final del Hero */}
          <StatsTicker />
        </section>

        {/* SECCIÓN 2: CONTENIDO DINÁMICO (Reemplaza a las secciones estáticas) */}
        {selectedSection && (
          <section
            id="dynamic-content"
            className="min-h-[80vh] flex flex-col items-center justify-start bg-base-100/80 backdrop-blur-md relative z-10 transition-colors duration-500 pt-16 pb-10"
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <SectionTabs
                activeSection={selectedSection}
                onSectionChange={setSelectedSection}
              />
              <DynamicContent section={selectedSection} />
            </div>
          </section>
        )}

        {/* SECCIÓN 3: IMPACTO (Social Proof) */}
        <ImpactSection />

        {/* SECCIÓN 4: FAQ (SEO) */}
        <FAQSection />

        {/* SECCIÓN 5: CONTACTO */}
        <ContactSection />

        {/* FOOTER */}
        <Footer />
      </main>
    </CartProvider>
  );
}
