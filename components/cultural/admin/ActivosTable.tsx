'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import type { Activo } from '@/lib/types';
import { deleteActivo } from '@/lib/admin-data';
import ConfirmDialog from './ConfirmDialog';

interface ActivosTableProps {
  activos: Activo[];
  onEdit: (activo: Activo) => void;
  onDelete: () => void;
}

export default function ActivosTable({ activos, onEdit, onDelete }: ActivosTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    activo: Activo | null;
  }>({ isOpen: false, activo: null });

  const handleDeleteClick = (activo: Activo) => {
    setConfirmDialog({ isOpen: true, activo });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.activo) return;

    try {
      setDeletingId(confirmDialog.activo.id);
      await deleteActivo(confirmDialog.activo.id);
      onDelete();
    } catch (error) {
      console.error('Error al eliminar activo:', error);
      alert('Error al eliminar el activo.');
    } finally {
      setDeletingId(null);
    }
  };

  if (activos.length === 0) {
    return (
      <div className="bg-white border border-[#D9C3A3] rounded-lg p-12 text-center">
        <p className="text-[#4A3B31]/60">No hay activos registrados.</p>
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
                <th className="text-left">Título</th>
                <th className="text-left">Categoría</th>
                <th className="text-center">Archivos</th>
                <th className="text-center">Visibilidad</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activos.map((activo) => {
                const categoryName = activo.expand?.categoria?.nombre || 'Sin categoría';
                const fileCount = activo.archivos?.length || 0;
                
                return (
                  <tr key={activo.id} className="hover:bg-[#F8F3ED] transition-colors border-b border-[#D9C3A3]">
                    <td>
                      <div>
                        <span className="font-semibold text-[#5A1E02]">
                          {activo.titulo}
                        </span>
                        <p className="text-xs text-[#4A3B31]/70 line-clamp-1 mt-1">
                          {activo.descripcion}
                        </p>
                        {(activo.autor || activo.anio) && (
                          <p className="text-xs text-[#4A3B31]/50 mt-1">
                            {activo.autor && <span>{activo.autor}</span>}
                            {activo.autor && activo.anio && <span> • </span>}
                            {activo.anio && <span>{activo.anio}</span>}
                          </p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm bg-[#8B3C10] text-white border-none">
                        {categoryName}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="text-sm font-medium text-[#4A3B31]">
                        {fileCount}
                      </span>
                    </td>
                    <td className="text-center">
                      {activo.publico ? (
                        <div className="flex items-center justify-center gap-1 text-[#7C8B56]">
                          <FaEye className="w-4 h-4" />
                          <span className="text-xs font-medium">Público</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-[#4A3B31]/50">
                          <FaEyeSlash className="w-4 h-4" />
                          <span className="text-xs font-medium">Privado</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(activo)}
                          className="btn btn-sm bg-[#7C8B56] hover:bg-[#7C8B56]/80 text-white border-none gap-1"
                        >
                          <FaEdit className="w-3 h-3" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(activo)}
                          disabled={deletingId === activo.id}
                          className="btn btn-sm bg-[#B63A1B] hover:bg-[#B63A1B]/80 text-white border-none gap-1"
                        >
                          {deletingId === activo.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <FaTrash className="w-3 h-3" />
                          )}
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el activo "${confirmDialog.activo?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, activo: null })}
      />
    </>
  );
}
