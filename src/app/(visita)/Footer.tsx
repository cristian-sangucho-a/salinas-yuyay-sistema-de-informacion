import React from 'react';
import Link from 'next/link'; // Link sigue importado por si lo necesitas en otro lado, aunque no se usa aquí
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram } from 'react-icons/fa'; // Importa iconos necesarios

export default function Footer() {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual dinámicamente

  return (
    // Fondo: Neutro claro (Beige sal)
    <footer className="bg-base-100 text-base-content">
      {/* Contenedor principal con padding y ancho máximo */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16">
        {/* Línea divisora superior: Arena */}
        <div className="border-t border-base-300 mb-12"></div>

        {/* Contenido principal del footer (Ahora 3 columnas en lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8"> {/* Ajustado a lg:grid-cols-3 */}

          {/* Columna 1: Salinas de Guaranda */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary">Salinas de Guaranda</h3> {/* Título: Marrón tierra */}
            <p className="text-sm text-base-content/80"> {/* Texto: Gris pizarra */}
              Comunidad ubicada en la provincia de Bolívar, Ecuador, reconocida por su tradición cooperativista y producción artesanal de quesos y chocolates.
            </p>
          </div>

          {/* Columna 2: Contacto */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary">Contacto</h3>
            <ul className="space-y-2 text-sm text-base-content/80">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="w-4 h-4 mt-1 text-secondary shrink-0" /> {/* Icono: Marrón arcilla */}
                <span>Salinas de Guaranda, Bolívar, Ecuador</span>
              </li>
              <li className="flex items-start gap-2">
                <FaPhoneAlt className="w-4 h-4 mt-1 text-secondary shrink-0" />
                <a href="tel:+59332210xxx" className="hover:text-primary transition-colors">+593 (03) 221-0xxx</a> {/* Reemplazar con número real */}
              </li>
              <li className="flex items-start gap-2">
                <FaEnvelope className="w-4 h-4 mt-1 text-secondary shrink-0" />
                <a href="mailto:archivo@salinas.gob.ec" className="hover:text-primary transition-colors">archivo@salinas.gob.ec</a> {/* Reemplazar con email real */}
              </li>
            </ul>
          </div>

          {/* Columna 3 (antes 4): Síguenos y Horario */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary">Síguenos</h3>
            <div className="flex gap-3">
              {/* Iconos sociales: Fondo Arena, icono Gris pizarra */}
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Salinas" className="btn btn-square btn-ghost bg-base-300 text-base-content hover:bg-secondary hover:text-secondary-content transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Salinas" className="btn btn-square btn-ghost bg-base-300 text-base-content hover:bg-secondary hover:text-secondary-content transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
            <div className="pt-2">
                 <h4 className="font-medium text-base-content">Horario de atención:</h4>
                 <p className="text-sm text-base-content/80">Lunes a Viernes<br/>8:00 AM - 5:00 PM</p>
            </div>
          </div>
        </div>

        {/* Línea divisora inferior */}
        <div className="border-t border-base-300 mt-12 pt-8 flex flex-col sm:flex-row justify-between text-xs text-base-content/60">
          <p>&copy; {currentYear} SAISAL - Sistema de Archivo Institucional de Salinas de Guaranda. Todos los derechos reservados.</p>
          <p className="mt-2 sm:mt-0">Preservando nuestra historia para el futuro.</p>
        </div>
      </div>
    </footer>
  );
}

