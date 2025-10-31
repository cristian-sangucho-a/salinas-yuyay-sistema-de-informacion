'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { getAuthUser, isAuthenticated } from '@/lib/auth';
import type { Solicitud } from '@/lib/types';
import CulturalNavTabs from '@cultural/admin/CulturalNavTabs';
import SolicitudesTable from '@cultural/admin/SolicitudesTable';
import { getSolicitudesAdmin } from '@/lib/admin-data';
import { ListResult } from 'pocketbase';

export default function SolicitudesAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [solicitudesData, setSolicitudesData] = useState<ListResult<Solicitud> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    setUser(getAuthUser());
    loadData();
  }, [router]);

  const loadData = async (page = 1) => {
    try {
      setIsLoading(true);
      const data = await getSolicitudesAdmin(page);
      setSolicitudesData(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#F8F3ED] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#5A1E02]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Header */}
      <div className="bg-white border-b border-[#D9C3A3]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-[#5A1E02] hover:text-[#8B3C10] transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <div className="border-l border-[#D9C3A3] h-6"></div>
              <div>
                <h1 className="text-lg font-bold text-[#5A1E02]">Panel Administrativo</h1>
                <p className="text-xs text-[#4A3B31]/60">Archivo Histórico de Salinas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CulturalNavTabs/>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#5A1E02]">
              Gestión de Solicitudes
            </h2>
            <p className="text-sm text-[#4A3B31]/70 mt-1">
              Aprueba o rechaza las solicitudes de acceso a los activos
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-[#5A1E02]"></span>
          </div>
        ) : (
          <SolicitudesTable
            solicitudes={solicitudesData?.items || []}
            onUpdate={loadData}
          />
        )}
        
        {/* Aquí podrías agregar paginación si lo necesitas */}
        
      </main>

      <footer className="fixed bottom-4 right-4">
        <p className="text-xs text-[#4A3B31]/50 italic">
          Desarrollado por Hakan Team
        </p>
      </footer>
    </div>
  );
}