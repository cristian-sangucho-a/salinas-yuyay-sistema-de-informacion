"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaImage } from "react-icons/fa";
import type { Producto } from "@/lib/types/productivo";
import { deleteProducto } from "@/lib/admin-data-productivo";
import ConfirmDialog from "@components/cultural/admin/ConfirmDialog";
import ConfirmationModal from "@components/molecules/ConfirmationModal";
import { getFileUrl } from "@/lib/data";
import Image from "next/image";
import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";

interface ProductsTableProps {
  productos: Producto[];
  onEdit: (producto: Producto) => void;
  onDelete: () => void;
}

export default function ProductsTable({
  productos,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    producto: Producto | null;
  }>({ isOpen: false, producto: null });
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleDeleteClick = (producto: Producto) => {
    setConfirmDialog({ isOpen: true, producto });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.producto) return;

    try {
      setDeletingId(confirmDialog.producto.id);
      await deleteProducto(confirmDialog.producto.id);
      onDelete();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setErrorModal({
        isOpen: true,
        title: "Error al Eliminar",
        message:
          "No se pudo eliminar el producto. Por favor, intenta de nuevo.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (productos.length === 0) {
    return (
      <div className="bg-white border border-base-300 rounded-lg p-12 text-center">
        <Text color="muted">No hay productos registrados.</Text>
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
                <th className="text-left">Categoría</th>
                <th className="text-right">Precio</th>
                <th className="text-center">Estado</th>
                <th className="text-center">Destacado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => {
                const categoryName =
                  producto.expand?.categoria?.nombre || "Sin categoría";
                const subcategoryName = producto.expand?.subcategoria?.nombre;
                const imageUrl: string | null =
                  producto.imagenes && producto.imagenes.length > 0
                    ? getFileUrl(producto, "imagenes")
                    : null;

                return (
                  <tr
                    key={producto.id}
                    className="hover:bg-base-100 transition-colors border-b border-base-300"
                  >
                    <td className="text-center">
                      <div className="avatar placeholder">
                        <div className="bg-base-200 text-base-content/30 rounded-lg w-12 h-12 relative overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={producto.nombre || "Producto"}
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
                        {producto.nombre}
                      </Text>
                      <Text
                        variant="caption"
                        color="muted"
                        className="truncate max-w-[200px]"
                      >
                        {producto.descripcion}
                      </Text>
                    </td>
                    <td>
                      <Text variant="small" className="font-medium">
                        {categoryName}
                      </Text>
                      {subcategoryName && (
                        <Text variant="caption" color="muted">
                          {subcategoryName}
                        </Text>
                      )}
                    </td>
                    <td className="text-right">
                      <Text variant="body" className="font-mono font-medium">
                        ${(producto.pvp1 || 0).toFixed(2)}
                      </Text>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          producto.estado === "A"
                            ? "badge-success text-white"
                            : "badge-ghost"
                        }`}
                      >
                        {producto.estado === "A" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="text-center">
                      {producto.destacado ? (
                        <span className="text-warning" title="Destacado">
                          ★
                        </span>
                      ) : (
                        <span className="text-base-content/20">☆</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => onEdit(producto)}
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:bg-primary/10"
                          title="Editar"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(producto)}
                          variant="ghost"
                          size="sm"
                          className="text-error hover:bg-error/10"
                          title="Eliminar"
                          disabled={deletingId === producto.id}
                        >
                          {deletingId === producto.id ? (
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
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${confirmDialog.producto?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, producto: null })}
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
