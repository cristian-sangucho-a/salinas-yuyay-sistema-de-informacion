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
}

export interface ContificoAdditionalFields {
  codigo: string;
  codigo_barra: string;
  pvp2?: string;
  pvp3?: string;
  pvp4?: string;
  pvp_comisariato?: string;
  para_comisariato?: boolean;
  codigo_sap?: string;
}

export default function ContificoFieldsModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: ContificoFieldsModalProps) {
  const [codigo, setCodigo] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [pvp2, setPvp2] = useState("");
  const [pvp3, setPvp3] = useState("");
  const [pvp4, setPvp4] = useState("");
  const [paraComisariato, setParaComisariato] = useState(false);
  const [pvpComisariato, setPvpComisariato] = useState("");
  const [codigoSap, setCodigoSap] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo.trim()) {
      setError("El código del producto es requerido");
      return;
    }

    if (!codigoBarras.trim()) {
      setError("El código de barras es requerido");
      return;
    }

    const fields: ContificoAdditionalFields = {
      codigo: codigo.trim(),
      codigo_barra: codigoBarras.trim(),
      ...(pvp2 && { pvp2 }),
      ...(pvp3 && { pvp3 }),
      ...(pvp4 && { pvp4 }),
      ...(paraComisariato && { para_comisariato: true }),
      ...(pvpComisariato && { pvp_comisariato: pvpComisariato }),
      ...(codigoSap && { codigo_sap: codigoSap }),
    };

    onSubmit(fields);
  };

  const handleClose = () => {
    setCodigo("");
    setCodigoBarras("");
    setPvp2("");
    setPvp3("");
    setPvp4("");
    setParaComisariato(false);
    setPvpComisariato("");
    setCodigoSap("");
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

            {/* Campos Obligatorios */}
            <div>
              <Title variant="h4" className="font-bold text-primary mb-4">
                Campos Obligatorios
              </Title>

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
                      Código de Barras *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                    placeholder="Ej: 000000011115"
                    disabled={isLoading}
                  />
                  <Text color="muted" className="text-xs mt-1">
                    Código de barras estándar del producto
                  </Text>
                </div>
              </div>
            </div>

            {/* Campos Opcionales */}
            <div>
              <Title variant="h4" className="font-bold text-primary mb-4">
                Campos Opcionales
              </Title>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        PVP 2
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pvp2}
                      onChange={(e) => setPvp2(e.target.value)}
                      className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        PVP 3
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pvp3}
                      onChange={(e) => setPvp3(e.target.value)}
                      className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        PVP 4
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pvp4}
                      onChange={(e) => setPvp4(e.target.value)}
                      className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                      placeholder="0.00"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      checked={paraComisariato}
                      onChange={(e) => setParaComisariato(e.target.checked)}
                      className="checkbox checkbox-primary"
                      disabled={isLoading}
                    />
                    <span className="label-text font-medium text-primary">
                      Válido para Comisariato
                    </span>
                  </label>
                </div>

                {paraComisariato && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium text-primary">
                          PVP Comisariato
                        </span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={pvpComisariato}
                        onChange={(e) => setPvpComisariato(e.target.value)}
                        className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium text-primary">
                          Código SAP
                        </span>
                      </label>
                      <input
                        type="text"
                        value={codigoSap}
                        onChange={(e) => setCodigoSap(e.target.value)}
                        className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none"
                        placeholder="Ej: 000000000040009212"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
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
