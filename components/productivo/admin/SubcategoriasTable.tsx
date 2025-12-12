"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { SubcategoriaProducto } from "@/lib/types/productivo";
import { deleteSubcategoria } from "@/lib/admin-data-productivo";
import ConfirmDialog from "@components/cultural/admin/ConfirmDialog";
import ConfirmationModal from "@components/molecules/ConfirmationModal";
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

interface SubcategoriasTableProps {
  subcategorias: SubcategoriaProducto[];
  onEdit: (subcategoria: SubcategoriaProducto) => void;
  onDelete: () => void;
}

export default function SubcategoriasTable({
  subcategorias,
  onEdit,
  onDelete,
}: SubcategoriasTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    subcategoria: SubcategoriaProducto | null;
  }>({ isOpen: false, subcategoria: null });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleDeleteClick = (subcategoria: SubcategoriaProducto) => {
    setConfirmDialog({ isOpen: true, subcategoria });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.subcategoria) return;

    try {
      setDeletingId(confirmDialog.subcategoria.id);
      await deleteSubcategoria(confirmDialog.subcategoria.id);
      onDelete();
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error);
      setErrorModal({
        isOpen: true,
        title: "Error al Eliminar",
        message:
          "No se pudo eliminar la subcategoría. Por favor, intenta de nuevo.",
      });
    } finally {
      setDeletingId(null);
      setConfirmDialog({ isOpen: false, subcategoria: null });
    }
  };

  if (subcategorias.length === 0) {
    return (
      <div className="bg-white border border-base-300 rounded-lg p-12 text-center">
        <Text color="muted">No hay subcategorías registradas.</Text>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-2 border-base-300 rounded-lg overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-white text-primary">
              <tr>
                <th className="text-left">Nombre</th>
                <th className="text-left">Slug</th>
                <th className="text-left">Categoría Padre</th>
                <th className="text-left">Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subcategorias.map((subcategoria) => {
                const categoriaNombre =
                  subcategoria.expand?.categoria_producto?.nombre ||
                  "Sin categoría";

                return (
                  <tr
                    key={subcategoria.id}
                    className="hover:bg-base-100 transition-colors border-b border-base-300"
                  >
                    <td>
                      <Text variant="body" className="font-bold text-primary">
                        {subcategoria.nombre}
                      </Text>
                    </td>
                    <td>
                      <Text
                        variant="small"
                        className="font-mono text-base-content/70"
                      >
                        {subcategoria.slug}
                      </Text>
                    </td>
                    <td>
                      <Text variant="small" className="font-medium">
                        {categoriaNombre}
                      </Text>
                    </td>
                    <td>
                      <Text
                        variant="caption"
                        color="muted"
                        className="truncate max-w-[300px]"
                        as="div"
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: subcategoria.descripcion_subcategoria || "",
                          }}
                        />
                      </Text>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => onEdit(subcategoria)}
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          title="Editar"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(subcategoria)}
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          title="Eliminar"
                          disabled={deletingId === subcategoria.id}
                        >
                          {deletingId === subcategoria.id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <FaTrash />
                          )}
                        </Button>
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
        title="Eliminar Subcategoría"
        message={`¿Estás seguro de que deseas eliminar la subcategoría "${confirmDialog.subcategoria?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, subcategoria: null })}
        type="danger"
      />

      {/* Error Modal */}
      <ConfirmationModal
        isOpen={errorModal.isOpen}
        type="error"
        title={errorModal.title}
        message={errorModal.message}
        confirmText="Entendido"
        onConfirm={async () => {
          setErrorModal({ ...errorModal, isOpen: false });
        }}
        onCancel={() => {
          setErrorModal({ ...errorModal, isOpen: false });
        }}
      />
    </>
  );
}
