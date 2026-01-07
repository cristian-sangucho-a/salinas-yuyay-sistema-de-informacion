import React from "react";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SALINAS_YUYAY } from "../../../utils/empresa";

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual dinámicamente
  const { landing, redesSociales, logo } = SALINAS_YUYAY;
  const { contact } = landing;

  return (
    // Fondo transparente para integrarse mejor, asegurando contraste de texto
    <footer className="text-base-content relative z-10">
      {/* Contenedor principal con padding y ancho máximo */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
        {/* Línea divisora superior: Arena oscura para contraste */}
        <div className="border-t border-primary/20 mb-12"></div>

        {/* Contenido principal del footer (Ahora 3 columnas en lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8 text-center">
          {/* Columna 1: Salinas de Guaranda */}
          <div className="space-y-4 flex flex-col items-center">
            <div className="flex flex-col items-center gap-4 w-full">
              {/* Logo grande */}
              <div className="w-full flex justify-center">
                <Image
                  src={logo || "/logo.png"}
                  alt="Salinas Yuyay"
                  width={160}
                  height={160}
                  className="h-40 w-auto object-contain mix-blend-multiply"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-base-content leading-relaxed max-w-xs mx-auto">
                  {SALINAS_YUYAY.descripcion}
                </p>
              </div>
            </div>
          </div>
          {/* Columna 2: Contacto */}
          <div className="space-y-3 flex flex-col items-center">
            <h3 className="font-bold text-lg text-primary">{contact.title}</h3>
            <ul className="space-y-2 text-sm font-medium text-base-content flex flex-col items-center">
              <li className="flex items-center gap-2 group justify-center">
                <FaMapMarkerAlt className="w-4 h-4 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-primary transition-colors">
                  {contact.location.address}
                </span>
              </li>
              <li className="flex items-center gap-2 group justify-center">
                <FaPhoneAlt className="w-4 h-4 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href={`tel:${contact.phone.number}`}
                  className="hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  {contact.phone.number}
                </a>
              </li>
              <li className="flex items-center gap-2 group justify-center">
                <FaEnvelope className="w-4 h-4 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <a
                  href={`mailto:${contact.email.address}`}
                  className="hover:text-primary hover:translate-x-1 transition-all inline-block"
                >
                  {contact.email.address}
                </a>
              </li>
            </ul>
          </div>
          {/* Columna 3 (antes 4): Síguenos y Horario */}
          <div className="space-y-3 flex flex-col items-center">
            <h3 className="font-bold text-lg text-primary">Síguenos</h3>
            <div className="flex gap-3 justify-center">
              {/* Iconos sociales: Fondo Arena, icono Gris pizarra */}
              {redesSociales.facebook && (
                <a
                  href={redesSociales.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="btn btn-square btn-ghost bg-base-300 text-base-content hover:bg-[#1877F2] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>
              )}
              {redesSociales.instagram && (
                <a
                  href={redesSociales.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="btn btn-square btn-ghost bg-base-300 text-base-content hover:bg-linear-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              )}
              {redesSociales.twitter && (
                <a
                  href={redesSociales.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="btn btn-square btn-ghost bg-base-300 text-base-content hover:bg-[#1DA1F2] hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <FaXTwitter className="w-5 h-5" />
                </a>
              )}
            </div>
            <div className="pt-2">
              <h4 className="font-bold text-base-content">
                Horario de atención:
              </h4>
              <p className="text-sm font-medium text-base-content">
                Lunes a Viernes
                <br />
                8:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisora inferior */}
        <div className="border-t border-primary/20 mt-12 pt-8 flex flex-col sm:flex-row justify-between text-xs font-medium text-base-content/70">
          <p>
            &copy; {currentYear} {SALINAS_YUYAY.nombre}. Todos los derechos
            reservados.
          </p>
          <p className="mt-2 sm:mt-0">{SALINAS_YUYAY.eslogan}</p>
        </div>
      </div>
    </footer>
  );
}
