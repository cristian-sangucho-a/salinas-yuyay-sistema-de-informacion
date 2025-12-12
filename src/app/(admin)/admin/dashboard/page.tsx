"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSignOutAlt, FaFolder } from "react-icons/fa";
import { logout, getAuthUser, isAuthenticated } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setUser(getAuthUser());
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-base-content/70"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header con fondo marrón */}
      <div className=" text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">
                Panel de Administración
              </h1>
              <p className="text-sm text-base-content/70">
                {String(user?.email || "")}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-secondary hover:bg-error text-white border-none gap-2"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <h2 className="text-3xl font-bold text-primary mb-8">
          Bienvenido al Sistema de Gestión de Salinas Yuyay
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Archivo Cultural */}
          <Link
            href="/admin/categorias"
            className="bg-white border border-base-300 rounded-lg p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
                <FaFolder className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">
                  Archivo Cultural
                </h3>
              </div>
            </div>
            <p className="text-sm text-base-content/70">
              Gestiona los archivos culturales
            </p>
          </Link>

          {/* Turístico - activado */}
          <Link
            href="/admin/eventos"
            className="bg-white border border-base-300 rounded-lg p-6 hover:shadow-lg transition-all flex flex-col"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
                <FaFolder className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">Turístico</h3>
              </div>
            </div>
            <p className="text-sm text-base-content/70">
              Administra eventos, salas del museo y contenidos turísticos.
            </p>
          </Link>

          {/* Productivo - activado */}
          <Link
            href="/admin/productos"
            className="bg-white border border-base-300 rounded-lg p-6 hover:shadow-lg transition-all flex flex-col group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
                <FaFolder className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">Productivo</h3>
              </div>
            </div>
            <p className="text-sm text-base-content/70">
              Gestiona productos, categorías y pedidos.
            </p>
          </Link>
        </div>
      </main>

      <footer className="fixed bottom-4 right-4">
        <p className="text-xs text-base-content/50 italic">
          Desarrollado por Hakan Team
        </p>
      </footer>
    </div>
  );
}
