"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaImage, FaEye } from "react-icons/fa";
import type { Producto } from "@/lib/types/productivo";
import { deleteProducto } from "@/lib/admin-data-productivo";
import DeleteProductModal from "./DeleteProductModal";
import ProductDetailsModal from "./ProductDetailsModal";
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
  const [detailsModal, setDetailsModal] = useState<{
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

  const handleViewClick = (producto: Producto) => {
    setDetailsModal({ isOpen: true, producto });
  };

  const deleteProductFromContifico = async (id: string) => {
    const response = await fetch(`/api/contifico/productos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const text = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }
      throw new Error(
        errorData.error ||
          errorData.mensaje ||
          errorData.message ||
          "Error al eliminar de Contífico"
      );
    }
  };

  const handleConfirmDelete = async (deleteFromContifico: boolean) => {
    if (!confirmDialog.producto) return;

    try {
      setDeletingId(confirmDialog.producto.id);

      if (deleteFromContifico && confirmDialog.producto.contifico_id) {
        await deleteProductFromContifico(confirmDialog.producto.contifico_id);
      }

      await deleteProducto(confirmDialog.producto.id);
      onDelete();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setErrorModal({
        isOpen: true,
        title: "Error al Eliminar",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el producto. Por favor, intenta de nuevo.",
      });
    } finally {
      setDeletingId(null);
      setConfirmDialog({ isOpen: false, producto: null });
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
                          onClick={() => handleViewClick(producto)}
                          variant="ghost"
                          size="sm"
                          className="text-info hover:bg-info/10"
                          title="Ver Detalles"
                        >
                          <FaEye />
                        </Button>
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

      <DeleteProductModal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, producto: null })}
        onConfirm={handleConfirmDelete}
        productName={confirmDialog.producto?.nombre || ""}
        hasContificoId={!!confirmDialog.producto?.contifico_id}
      />

      <ProductDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, producto: null })}
        producto={detailsModal.producto}
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
