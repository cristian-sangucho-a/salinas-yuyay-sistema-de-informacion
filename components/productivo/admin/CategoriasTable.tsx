"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import type { CategoriaProducto } from "@/lib/types/productivo";
import { deleteCategoria } from "@/lib/admin-data-productivo";
import ConfirmDialog from "@components/cultural/admin/ConfirmDialog";
import ConfirmationModal from "@components/molecules/ConfirmationModal";
import { getFileUrl } from "@/lib/data";
import Image from "next/image";
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

interface CategoriasTableProps {
  categorias: CategoriaProducto[];
  onEdit: (categoria: CategoriaProducto) => void;
  onDelete: () => void;
}

export default function CategoriasTable({
  categorias,
  onEdit,
  onDelete,
}: CategoriasTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    categoria: CategoriaProducto | null;
  }>({ isOpen: false, categoria: null });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleDeleteClick = (categoria: CategoriaProducto) => {
    setConfirmDialog({ isOpen: true, categoria });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.categoria) return;

    try {
      setDeletingId(confirmDialog.categoria.id);
      await deleteCategoria(confirmDialog.categoria.id);
      onDelete();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setErrorModal({
        isOpen: true,
        title: "Error al Eliminar",
        message:
          "No se pudo eliminar la categoría. Por favor, intenta de nuevo.",
      });
    } finally {
      setDeletingId(null);
      setConfirmDialog({ isOpen: false, categoria: null });
    }
  };

  if (categorias.length === 0) {
    return (
      <div className="bg-white border border-base-300 rounded-lg p-12 text-center">
        <Text color="muted">No hay categorías registradas.</Text>
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
                <th className="text-center w-20">Imagen</th>
                <th className="text-left">Nombre</th>
                <th className="text-left">Slug</th>
                <th className="text-left">Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => {
                const imageUrl: string | null = categoria.field
                  ? getFileUrl(categoria, "field")
                  : null;

                return (
                  <tr
                    key={categoria.id}
                    className="hover:bg-base-100 transition-colors border-b border-base-300"
                  >
                    <td className="text-center">
                      <div className="avatar placeholder">
                        <div className="bg-base-200 text-base-content/30 rounded-lg w-12 h-12 relative overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={categoria.nombre || "Categoría"}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <FaImage className="text-xl" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Text variant="body" className="font-bold text-primary">
                        {categoria.nombre}
                      </Text>
                    </td>
                    <td>
                      <Text
                        variant="small"
                        className="font-mono text-base-content/70"
                      >
                        {categoria.slug}
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
                            __html: categoria.descripcion_categoria || "",
                          }}
                        />
                      </Text>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => onEdit(categoria)}
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          title="Editar"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(categoria)}
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          title="Eliminar"
                          disabled={deletingId === categoria.id}
                        >
                          {deletingId === categoria.id ? (
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
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${confirmDialog.categoria?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, categoria: null })}
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
