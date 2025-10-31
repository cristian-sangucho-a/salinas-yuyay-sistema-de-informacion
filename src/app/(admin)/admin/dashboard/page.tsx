'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSignOutAlt, FaFolder } from 'react-icons/fa';
import { logout, getAuthUser, isAuthenticated } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    setUser(getAuthUser());
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#F8F3ED] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#4A3B31]/70"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Header con fondo marrón */}
      <div className=" text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#5A1E02]">Panel de Administración</h1>
              <p className="text-sm text-[#4A3B31]/70">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-[#8B3C10] hover:bg-[#B63A1B] text-white border-none gap-2"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <h2 className="text-3xl font-bold text-[#5A1E02] mb-8">
          Bienvenido al Sistema de Gestión de Salinas Yuyay
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card de Archivo Cultural */}
          <Link
            href="/admin/categorias"
            className="bg-white border border-[#D9C3A3] rounded-lg p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#5A1E02] rounded-lg flex items-center justify-center group-hover:bg-[#8B3C10] transition-colors">
                <FaFolder className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#5A1E02]">Archivo Cultural</h3>
              </div>
            </div>
            <p className="text-sm text-[#4A3B31]/70">
              Gestiona los archivos culturales
            </p>
          </Link>

          {/* Cards deshabilitadas */}
          <div className="bg-white border border-[#D9C3A3] rounded-lg p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#D9C3A3] rounded-lg flex items-center justify-center">
                <FaFolder className="w-7 h-7 text-[#4A3B31]/50" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#4A3B31]/50">Turístico</h3>
              </div>
            </div>
            <p className="text-sm text-[#4A3B31]/50">
              Administra los activos históricos y archivos
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-[#D9C3A3] text-[#4A3B31]/70 text-xs rounded">
              Próximamente
            </span>
          </div>

          <div className="bg-white border border-[#D9C3A3] rounded-lg p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#D9C3A3] rounded-lg flex items-center justify-center">
                <FaFolder className="w-7 h-7 text-[#4A3B31]/50" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#4A3B31]/50">Productivo</h3>
              </div>
            </div>
            <p className="text-sm text-[#4A3B31]/50">
              Revisa y gestiona las solicitudes de acceso
            </p>
            <span className="inline-block mt-3 px-3 py-1 bg-[#D9C3A3] text-[#4A3B31]/70 text-xs rounded">
              Próximamente
            </span>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-4 right-4">
        <p className="text-xs text-[#4A3B31]/50 italic">
          Desarrollado por Hakan Team
        </p>
      </footer>
    </div>
  );
}
