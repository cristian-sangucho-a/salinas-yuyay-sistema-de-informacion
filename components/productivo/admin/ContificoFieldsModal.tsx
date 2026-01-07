"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";

interface ContificoFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fields: ContificoAdditionalFields) => void;
  isLoading?: boolean;
  productName?: string;
  externalError?: string;
}

export interface ContificoAdditionalFields {
  codigo: string;
  minimo: string;
}

export default function ContificoFieldsModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  productName = "",
  externalError = "",
}: ContificoFieldsModalProps) {
  const [codigo, setCodigo] = useState("");
  const [minimo, setMinimo] = useState("1.0");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setError(""); // Clear error on open
      // Generate code if empty
      if (!codigo) {
        const timestamp = Date.now().toString().slice(-6);
        const namePrefix = productName
          ? productName
              .substring(0, 3)
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, "X")
          : "PROD";
        setCodigo(`${namePrefix}-${timestamp}`);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, productName]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo.trim()) {
      setError("El código del producto es requerido");
      return;
    }

    if (!minimo.trim()) {
      setError("El stock mínimo es requerido");
      return;
    }

    const fields: ContificoAdditionalFields = {
      codigo: codigo.trim(),
      minimo: minimo.trim(),
    };

    onSubmit(fields);
  };

  const handleClose = () => {
    setCodigo("");
    setMinimo("1.0");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-base-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white text-primary px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-base-300 sticky top-0 z-10">
          <Title variant="h3" className="font-bold">
            Información Adicional de Contífico
          </Title>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-base-content/60 hover:text-error hover:bg-error/10 rounded-full p-2 transition-all duration-200 hover:rotate-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <div className="mb-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
            <Text className="text-sm text-warning">
              Para crear el producto en Contífico, se requieren algunos campos
              adicionales. Completa los campos obligatorios (*) y opcionalmente
              los demás.
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error text-white shadow-lg">
                <FaTimes />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-primary">
                    Código del Producto *
                  </span>
                </label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                  placeholder="Ej: 00024"
                  disabled={isLoading}
                />
                <Text color="muted" className="text-xs mt-1">
                  Código único del producto en Contífico
                </Text>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-primary">
                    Stock Mínimo *
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={minimo}
                  onChange={(e) => setMinimo(e.target.value)}
                  className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                  placeholder="1.0"
                  disabled={isLoading}
                />
                <Text color="muted" className="text-xs mt-1">
                  Valor mínimo de stock que debe estar disponible
                </Text>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-6 border-t border-base-300">
              <Button
                type="button"
                onClick={handleClose}
                variant="secondary"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Creando...
                  </span>
                ) : (
                  "Crear Producto"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
