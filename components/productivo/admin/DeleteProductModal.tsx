"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteFromContifico: boolean) => Promise<void>;
  productName: string;
  hasContificoId: boolean;
}

export default function DeleteProductModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
  hasContificoId,
}: DeleteProductModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [deleteFromContifico, setDeleteFromContifico] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      setDeleteFromContifico(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(deleteFromContifico);
      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-base-100 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-base-300 flex items-center justify-between">
          <Title
            variant="h4"
            className="font-bold text-error flex items-center gap-2"
          >
            <FaExclamationTriangle />
            Eliminar Producto
          </Title>
          <button
            onClick={onClose}
            className="text-base-content/60 hover:text-error hover:bg-error/10 rounded-full p-2 transition-all duration-200"
            disabled={isDeleting}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <Text>
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <span className="font-bold text-primary">
              &quot;{productName}&quot;
            </span>
            ?
          </Text>
          <Text variant="small" color="muted">
            Esta acción no se puede deshacer.
          </Text>

          {hasContificoId && (
            <div className="form-control bg-base-200/50 p-3 rounded-lg border border-base-300 mt-4">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  checked={deleteFromContifico}
                  onChange={(e) => setDeleteFromContifico(e.target.checked)}
                  className="checkbox checkbox-error"
                  disabled={isDeleting}
                />
                <span className="label-text font-medium">
                  Eliminar también de Contífico
                </span>
              </label>
              <Text
                variant="small"
                className="pl-9 text-base-content/70 text-xs"
              >
                Si marcas esta opción, el producto se eliminará permanentemente
                de tu cuenta de Contífico.
              </Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-base-200/50 px-6 py-4 flex justify-end gap-3 border-t border-base-300">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="hover:bg-base-300"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-error hover:bg-error/90 border-error text-white gap-2"
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <FaTrash />
            )}
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
