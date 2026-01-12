"use client"; // Necesario para el estado del menú móvil y usePathname

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Hook para saber la ruta activa
import { FaBars, FaTimes } from "react-icons/fa"; // Iconos para menú móvil
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SALINAS_YUYAY } from "../../../utils/empresa";

// Define la estructura de un enlace de navegación
interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  variant?: "transparent" | "solid";
  scrollThreshold?: number;
}

export default function Navbar({
  variant = "solid",
  scrollThreshold = 20,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false); // Estado para el menú móvil
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname(); // Obtiene la ruta actual
  const { totalItems, toggleCart } = useCart();

  // Cierra el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    // Check initial scroll position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const isTransparent = variant === "transparent" && !isScrolled;

  // Lista de enlaces de navegación
  const navLinks: NavLink[] = [
    { href: "/tienda", label: "Tienda" },
    { href: "/turismo", label: "Turismo" },
    { href: "/cultural", label: "Archivo" },
  ];

  return (
    // Header con transición suave de fondo y color
    <nav
      className={`transition-all duration-1000 ease-in-out z-50 ${
        variant === "transparent" ? "fixed top-0 w-full" : "sticky top-0"
      } ${
        isTransparent
          ? "bg-transparent text-white"
          : "bg-base-100 text-base-content shadow-sm"
      }`}
    >
      <div
        className={`mx-auto transition-all duration-1000 ease-in-out ${
          isTransparent && pathname === "/"
            ? "max-w-[95%] px-6 md:px-12"
            : "max-w-7xl px-4 md:px-8 lg:px-16"
        }`}
      >
        <div className="flex justify-between items-center h-20">
          {/* Logo/Título Principal */}
          <div className="shrink-0 flex items-center h-full">
            <Link
              href="/"
              className="transition-all duration-300 hover:scale-105 inline-block h-full w-auto"
            >
              <Image
                src={
                  isTransparent && pathname === "/"
                    ? "/salinas-yuyay-white.png"
                    : "/salinas-yuyay.png"
                }
                alt={SALINAS_YUYAY.nombre}
                width={300}
                height={100}
                className="h-full w-auto object-contain py-2 transition-all duration-1000 ease-in-out"
                priority
              />
            </Link>
          </div>

          {/* Enlaces de Navegación (Escritorio) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative group py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? isTransparent
                        ? "text-white"
                        : "text-secondary"
                      : isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-base-content/80 hover:text-primary"
                  }`}
                >
                  {link.label}
                  {/* Animated Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-current transition-all duration-300 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    } ${isTransparent ? "bg-white" : "bg-secondary"}`}
                  />
                </Link>
              );
            })}

            {/* Botón Carrito */}
            <button
              onClick={toggleCart}
              className={`btn btn-ghost btn-circle relative transition-all duration-300 hover:scale-110 ${
                isTransparent
                  ? "text-white hover:bg-white/20"
                  : "text-base-content/80 hover:text-primary hover:bg-base-200"
              }`}
              aria-label="Ver carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-content animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleCart}
              className={`btn btn-ghost btn-circle relative transition-colors ${
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-base-content/80 hover:text-primary"
              }`}
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
              className={`btn btn-ghost btn-square transition-colors ${
                isTransparent
                  ? "text-white hover:bg-white/10"
                  : "text-base-content/80 hover:text-primary"
              }`}
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
      <div
        className={`${isOpen ? "block" : "hidden"} md:hidden border-t ${
          isTransparent
            ? "bg-black/90 border-white/10 backdrop-blur-md"
            : "bg-base-100 border-base-300"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? isTransparent
                    ? "bg-white/20 text-white"
                    : "bg-secondary text-secondary-content"
                  : isTransparent
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-base-content/80 hover:bg-base-200 hover:text-primary"
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
