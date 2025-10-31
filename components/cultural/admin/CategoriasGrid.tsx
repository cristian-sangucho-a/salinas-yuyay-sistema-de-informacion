'use client';

import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import type { Categoria } from '@/lib/types';
import { deleteCategoria } from '@/lib/admin-data';
import { getAssetCountsByCategory } from '@/lib/data';
import ConfirmDialog from './ConfirmDialog';

interface CategoriasGridProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: () => void;
}

export default function CategoriasGrid({ categorias, onEdit, onDelete }: CategoriasGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [assetCounts, setAssetCounts] = React.useState<Record<string, number>>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    categoria: Categoria | null;
  }>({ isOpen: false, categoria: null });

  React.useEffect(() => {
    const loadCounts = async () => {
      const counts = await getAssetCountsByCategory();
      setAssetCounts(counts);
    };
    loadCounts();
  }, []);

  const handleDeleteClick = (categoria: Categoria) => {
    setConfirmDialog({ isOpen: true, categoria });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.categoria) return;

    try {
      setDeletingId(confirmDialog.categoria.id);
      await deleteCategoria(confirmDialog.categoria.id);
      onDelete();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar la categoría.');
    } finally {
      setDeletingId(null);
    }
  };

  if (categorias.length === 0) {
    return (
      <div className="bg-white border border-[#D9C3A3] rounded-lg p-12 text-center">
        <p className="text-[#4A3B31]/60">No hay categorías registradas.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categorias.map((categoria) => {
          const activoCount = assetCounts[categoria.id] || 0;
          
          return (
            <div
              key={categoria.id}
              className="bg-white border border-[#D9C3A3] rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#5A1E02] mb-2">
                  {categoria.nombre}
                </h3>
                <p className="text-sm text-[#4A3B31]/70 mb-3">
                  {categoria.descripcion}
                </p>
                <p className="text-sm text-[#4A3B31]/60">
                  {activoCount} activos
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(categoria)}
                  className="btn btn-sm btn-outline border-[#D9C3A3] text-[#5A1E02] hover:bg-[#F8F3ED] hover:border-[#7C8B56] gap-1 flex-1"
                >
                  <FaEdit className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(categoria)}
                  disabled={deletingId === categoria.id}
                  className="btn btn-sm btn-outline border-[#D9C3A3] text-[#B63A1B] hover:bg-red-50 hover:border-[#B63A1B] gap-1 flex-1"
                >
                  {deletingId === categoria.id ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <FaTrash className="w-3 h-3" />
                  )}
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar la categoría "${confirmDialog.categoria?.nombre}"? Esta acción también eliminará todos los activos asociados y no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, categoria: null })}
      />
    </>
  );
}
