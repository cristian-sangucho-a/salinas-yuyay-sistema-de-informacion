"use client"; // Necesario para el estado del menú móvil y usePathname

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook para saber la ruta activa
import { FaBars, FaTimes } from "react-icons/fa"; // Iconos para menú móvil
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Define la estructura de un enlace de navegación
interface NavLink {
  href: string;
  label: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const pathname = usePathname(); // Obtiene la ruta actual
  const { totalItems, toggleCart } = useCart();

  // Cierra el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lista de enlaces de navegación
  const navLinks: NavLink[] = [
    { href: "/tienda", label: "Tienda" },
    { href: "/turismo", label: "Turismo" },
    { href: "/cultural", label: "Historia Cultural" },
  ];

  return (
    // Fondo: Beige sal, con sombra sutil
    <nav className="bg-base-100 text-base-content shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Título Principal */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-primary hover:text-secondary transition-colors"
            >
              SAISAL
            </Link>
          </div>

          {/* Enlaces de Navegación (Escritorio) */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // Resalta el enlace activo usando Marrón arcilla (secundario)
                // Añadido hover:bg-base-200 para mejor feedback
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith(link.href) // Comprueba si la ruta actual empieza con el href del enlace
                    ? "text-secondary font-semibold border-b-2 border-secondary" // Estilo activo
                    : "text-base-content/80 hover:text-primary hover:bg-base-200" // Estilo inactivo con hover mejorado
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Botón Carrito */}
            <button
              onClick={toggleCart}
              className="btn btn-ghost btn-circle relative text-base-content/80 hover:text-primary"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-content">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleCart}
              className="btn btn-ghost btn-circle relative text-base-content/80 hover:text-primary"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-content">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="btn btn-ghost btn-square text-base-content/80 hover:text-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {/* Se muestra/oculta basado en el estado 'isOpen' */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden border-t border-base-300`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "bg-secondary text-secondary-content" // Estilo activo móvil
                  : "text-base-content/80 hover:bg-base-200 hover:text-primary" // Estilo inactivo móvil
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
