'use client';

import React, { useState } from 'react';
import type { Solicitud } from '@/lib/types';
import { updateSolicitudEstado } from '@/lib/admin-data';
import { FaCheck, FaTimes, FaEnvelope, FaBuilding } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal';
import ResultModal from './ResultModal';

interface SolicitudesTableProps {
  solicitudes: Solicitud[];
  onUpdate: () => void;
}

export default function SolicitudesTable({ solicitudes, onUpdate }: SolicitudesTableProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Modal de confirmación
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    id: string;
    estado: 'aprobado' | 'rechazado';
    solicitud: Solicitud | null;
  }>({
    isOpen: false,
    id: '',
    estado: 'aprobado',
    solicitud: null,
  });

  // Modal de resultado
  const [resultModal, setResultModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const handleOpenConfirm = (id: string, estado: 'aprobado' | 'rechazado', solicitud: Solicitud) => {
    setConfirmModal({
      isOpen: true,
      id,
      estado,
      solicitud,
    });
  };

  const handleConfirmAction = async () => {
    const { id, estado, solicitud } = confirmModal;
    
    if (!solicitud) return;

    try {
      setProcessingId(id);
      const result = await updateSolicitudEstado(id, estado);

      setConfirmModal({ isOpen: false, id: '', estado: 'aprobado', solicitud: null });

      if (result.success) {
        setResultModal({
          isOpen: true,
          type: 'success',
          title: estado === 'aprobado' ? '¡Solicitud Aprobada!' : 'Solicitud Rechazada',
          message: estado === 'aprobado' 
            ? `La solicitud de ${solicitud.nombre} ${solicitud.apellido} ha sido aprobada exitosamente.\n\nSe ha enviado un correo electrónico a ${solicitud.correo} con los archivos adjuntos.`
            : `La solicitud de ${solicitud.nombre} ${solicitud.apellido} ha sido rechazada.`,
        });
        onUpdate();
      } else {
        setResultModal({
          isOpen: true,
          type: 'error',
          title: 'Error al Procesar Solicitud',
          message: result.error || 'No se pudo actualizar la solicitud. Por favor, intente nuevamente.',
        });
      }
    } catch (error: unknown) {
      console.error('Error:', error);
      const message = error instanceof Error ? error.message : 'Ocurrió un error al procesar la solicitud.';
      setResultModal({
        isOpen: true,
        type: 'error',
        title: 'Error Inesperado',
        message: message,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'badge badge-warning text-warning-content';
      case 'aprobado':
        return 'badge badge-success text-success-content';
      case 'rechazado':
        return 'badge badge-error text-error-content';
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
    <>
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
                const isLoading = processingId === solicitud.id;

                return (
                  <tr key={solicitud.id} className="hover:bg-[#F8F3ED] transition-colors border-b border-[#D9C3A3]">
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
                    
                    <td className="text-sm text-[#4A3B31]/80">
                      {activoTitulo}
                    </td>
                    
                    <td className="text-sm text-[#4A3B31]/80 max-w-xs">
                      <p className="line-clamp-3">{solicitud.motivo}</p>
                    </td>

                    <td className="text-center">
                      <span className={`badge badge-sm ${getStatusBadge(solicitud.estado)}`}>
                        {solicitud.estado}
                      </span>
                    </td>

                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {solicitud.estado === 'pendiente' ? (
                          <>
                            <button
                              onClick={() => handleOpenConfirm(solicitud.id, 'aprobado', solicitud)}
                              disabled={isLoading}
                              className="btn btn-sm bg-[#7C8B56] hover:bg-[#7C8B56]/80 text-white border-none gap-1"
                            >
                              {isLoading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <FaCheck className="w-3 h-3" />
                              )}
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleOpenConfirm(solicitud.id, 'rechazado', solicitud)}
                              disabled={isLoading}
                              className="btn btn-sm bg-[#B63A1B] hover:bg-[#B63A1B]/80 text-white border-none gap-1"
                            >
                              {isLoading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                              ) : (
                                <FaTimes className="w-3 h-3" />
                              )}
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

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.estado === 'aprobado' ? '¿Aprobar Solicitud?' : '¿Rechazar Solicitud?'}
        message={
          confirmModal.estado === 'aprobado'
            ? `¿Está seguro de aprobar la solicitud de ${confirmModal.solicitud?.nombre} ${confirmModal.solicitud?.apellido}?\n\nSe enviará un correo electrónico con los archivos adjuntos a:\n${confirmModal.solicitud?.correo}`
            : `¿Está seguro de rechazar la solicitud de ${confirmModal.solicitud?.nombre} ${confirmModal.solicitud?.apellido}?`
        }
        confirmText={confirmModal.estado === 'aprobado' ? 'Aprobar y Enviar' : 'Rechazar'}
        cancelText="Cancelar"
        type={confirmModal.estado === 'aprobado' ? 'success' : 'danger'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal({ isOpen: false, id: '', estado: 'aprobado', solicitud: null })}
        isProcessing={processingId !== null}
      />

      {/* Modal de Resultado */}
      <ResultModal
        isOpen={resultModal.isOpen}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onClose={() => setResultModal({ isOpen: false, type: 'success', title: '', message: '' })}
      />
    </>
  );
}