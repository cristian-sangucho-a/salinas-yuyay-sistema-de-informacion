'use client';

import React, { useState } from 'react';
import type { Solicitud } from '@/lib/types';
import { updateSolicitudEstado } from '@/lib/admin-data';
import { FaCheck, FaTimes, FaSpinner, FaEnvelope, FaBuilding, FaUser } from 'react-icons/fa';

interface SolicitudesTableProps {
  solicitudes: Solicitud[];
  onUpdate: () => void; // Para refrescar la lista
}

export default function SolicitudesTable({ solicitudes, onUpdate }: SolicitudesTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const handleUpdateEstado = async (id: string, estado: 'aprobado' | 'rechazado') => {
    setLoadingId(id);
    setErrorId(null);
    try {
      await updateSolicitudEstado(id, estado);
      onUpdate(); // Refresca la lista en la página padre
    } catch (error) {
      console.error(error);
      setErrorId(id);
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'badge badge-warning text-warning-content'; // Ocre salino
      case 'aprobado':
        return 'badge badge-success text-success-content'; // Verde andino
      case 'rechazado':
        return 'badge badge-error text-error-content'; // Rojo achiote
      default:
        return 'badge badge-neutral';
    }
  };

  if (solicitudes.length === 0) {
    return (
      <div className="bg-white border border-[#D9C3A3] rounded-lg p-12 text-center">
        <p className="text-[#4A3B31]/60">No hay solicitudes registradas.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#D9C3A3] rounded-lg overflow-hidden shadow-md">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-white text-[#5A1E02]">
            <tr>
              <th className="text-left">Solicitante</th>
              <th className="text-left">Activo Solicitado</th>
              <th className="text-left">Motivo</th>
              <th className="text-center">Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => {
              const activoTitulo = solicitud.expand?.activo?.titulo || 'Activo no encontrado';
              const isLoading = loadingId === solicitud.id;

              return (
                <tr key={solicitud.id} className="hover:bg-[#F8F3ED] transition-colors border-b border-[#D9C3A3]">
                  {/* Solicitante */}
                  <td>
                    <div className="font-semibold text-[#5A1E02]">
                      {solicitud.nombre} {solicitud.apellido}
                    </div>
                    <div className="text-xs text-[#4A3B31]/70 mt-1 flex items-center gap-1.5">
                      <FaEnvelope className="w-3 h-3" />
                      {solicitud.correo}
                    </div>
                    {solicitud.institucion && (
                      <div className="text-xs text-[#4A3B31]/50 mt-1 flex items-center gap-1.5">
                        <FaBuilding className="w-3 h-3" />
                        {solicitud.institucion}
                      </div>
                    )}
                  </td>
                  
                  {/* Activo Solicitado */}
                  <td className="text-sm text-[#4A3B31]/80">
                    {activoTitulo}
                  </td>
                  
                  {/* Motivo */}
                  <td className="text-sm text-[#4A3B31]/80 max-w-xs">
                    <p className="line-clamp-3">{solicitud.motivo}</p>
                  </td>

                  {/* Estado */}
                  <td className="text-center">
                    <span className={`badge badge-sm ${getStatusBadge(solicitud.estado)}`}>
                      {solicitud.estado}
                    </span>
                    {errorId === solicitud.id && (
                      <p className="text-xs text-error mt-1">Error al actualizar</p>
                    )}
                  </td>

                  {/* Acciones */}
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      {solicitud.estado === 'pendiente' ? (
                        <>
                          <button
                            onClick={() => handleUpdateEstado(solicitud.id, 'aprobado')}
                            disabled={isLoading}
                            className="btn btn-sm bg-[#7C8B56] hover:bg-[#7C8B56]/80 text-white border-none gap-1"
                          >
                            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <FaCheck className="w-3 h-3" />}
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleUpdateEstado(solicitud.id, 'rechazado')}
                            disabled={isLoading}
                            className="btn btn-sm bg-[#B63A1B] hover:bg-[#B63A1B]/80 text-white border-none gap-1"
                          >
                            {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <FaTimes className="w-3 h-3" />}
                            Rechazar
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-[#4A3B31]/50 italic">Gestionada</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}