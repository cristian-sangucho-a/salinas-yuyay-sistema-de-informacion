"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaBox, FaCloud, FaDatabase, FaImage } from "react-icons/fa";
import type { Producto } from "@/lib/types/productivo";
import { getFileUrl } from "@/lib/data";
import Image from "next/image";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  producto: Producto | null;
}

interface ContificoProduct {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  descripcion: string;
  pvp1: string;
  pvp2: string;
  pvp3: string;
  pvp4: string;
  cantidad_stock: string;
  minimo: string;
  estado: string;
  tipo: string;
  porcentaje_iva: number;
  fecha_creacion: string;
  [key: string]: unknown;
}

export default function ProductDetailsModal({
  isOpen,
  onClose,
  producto,
}: ProductDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [contificoData, setContificoData] = useState<ContificoProduct | null>(
    null
  );
  const [loadingContifico, setLoadingContifico] = useState(false);
  const [errorContifico, setErrorContifico] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      if (producto?.contifico_id) {
        fetchContificoData(producto.contifico_id);
      } else {
        setContificoData(null);
        setLoadingContifico(false);
        setErrorContifico("");
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, producto]);

  const fetchContificoData = async (id: string) => {
    setLoadingContifico(true);
    setErrorContifico("");
    try {
      const response = await fetch(`/api/contifico/productos/${id}`);
      if (!response.ok) {
        throw new Error("Error al obtener datos de Contífico");
      }
      const data = await response.json();
      setContificoData(data);
    } catch (err) {
      console.error(err);
      setErrorContifico("No se pudo cargar la información de Contífico");
      setContificoData(null);
    } finally {
      setLoadingContifico(false);
    }
  };

  if (!isOpen || !producto) return null;

  const InfoRow = ({
    label,
    value,
    isCurrency = false,
  }: {
    label: string;
    value: React.ReactNode;
    isCurrency?: boolean;
  }) => (
    <tr className="border-b border-base-200 last:border-0">
      <td className="py-2 px-3 font-medium text-base-content/70 w-1/3 text-sm">
        {label}
      </td>
      <td className="py-2 px-3 font-semibold text-base-content text-sm">
        {isCurrency && typeof value === "number"
          ? `$${value.toFixed(2)}`
          : isCurrency && typeof value === "string"
          ? `$${parseFloat(value).toFixed(2)}`
          : value || "-"}
      </td>
    </tr>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-base-100 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-base-300 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <FaBox className="text-xl" />
            </div>
            <div>
              <Title
                variant="h4"
                className="font-bold text-primary leading-tight"
              >
                {producto.nombre}
              </Title>
              <Text variant="small" color="muted">
                Detalles del Producto
              </Text>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-base-content/60 hover:text-error hover:bg-error/10 rounded-full p-2 transition-all duration-200"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección PocketBase */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-primary/20">
              <FaDatabase className="text-primary" />
              <h3 className="font-bold text-lg text-primary">
                Datos en PocketBase
              </h3>
            </div>

            <div className="bg-white rounded-lg border border-base-300 overflow-hidden">
              <table className="w-full">
                <tbody>
                  <InfoRow label="ID" value={producto.id} />
                  <InfoRow label="Slug" value={producto.slug} />
                  <InfoRow
                    label="Categoría"
                    value={producto.expand?.categoria?.nombre}
                  />
                  <InfoRow
                    label="Subcategoría"
                    value={producto.expand?.subcategoria?.nombre}
                  />
                  <InfoRow
                    label="Precio (PVP1)"
                    value={producto.pvp1}
                    isCurrency
                  />
                  <InfoRow
                    label="Estado"
                    value={
                      <span
                        className={`badge badge-sm ${
                          producto.estado === "A"
                            ? "badge-success text-white"
                            : "badge-ghost"
                        }`}
                      >
                        {producto.estado === "A" ? "Activo" : "Inactivo"}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Destacado"
                    value={producto.destacado ? "Sí" : "No"}
                  />
                  <InfoRow
                    label="Almacenamiento"
                    value={producto.condicionesAlmacenamiento}
                  />
                  <InfoRow
                    label="Descripción"
                    value={
                      <p className="line-clamp-3 text-xs">
                        {producto.descripcion}
                      </p>
                    }
                  />
                  <InfoRow
                    label="Ingredientes"
                    value={
                      <p className="line-clamp-3 text-xs">
                        {producto.ingredientes}
                      </p>
                    }
                  />
                </tbody>
              </table>
            </div>

            {/* Imágenes */}
            <div>
              <h4 className="font-semibold text-sm text-base-content/70 mb-2">
                Imágenes ({producto.imagenes?.length || 0})
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {producto.imagenes && producto.imagenes.length > 0 ? (
                  producto.imagenes.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-base-300 shrink-0"
                    >
                      <Image
                        src={getFileUrl(producto, "imagenes", img) || ""}
                        alt={`Imagen ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="w-full py-4 text-center bg-base-200/50 rounded-lg border border-dashed border-base-300">
                    <FaImage className="mx-auto text-base-content/30 mb-1" />
                    <span className="text-xs text-base-content/50">
                      Sin imágenes
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sección Contífico */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-info/20">
              <FaCloud className="text-info" />
              <h3 className="font-bold text-lg text-info">
                Datos en Contífico
              </h3>
            </div>

            {!producto.contifico_id ? (
              <div className="bg-base-200/50 rounded-lg p-8 text-center border border-dashed border-base-300">
                <Text color="muted">
                  Este producto no está vinculado con Contífico.
                </Text>
              </div>
            ) : loadingContifico ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg text-info"></span>
              </div>
            ) : errorContifico ? (
              <div className="alert alert-error text-white text-sm">
                <span>{errorContifico}</span>
              </div>
            ) : contificoData ? (
              <div className="bg-white rounded-lg border border-base-300 overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <InfoRow label="ID Contífico" value={contificoData.id} />
                    <InfoRow label="Código" value={contificoData.codigo} />
                    <InfoRow
                      label="Código de Barras"
                      value={contificoData.codigo_barra}
                    />
                    <InfoRow label="Nombre" value={contificoData.nombre} />
                    <InfoRow label="Tipo" value={contificoData.tipo} />
                    <InfoRow
                      label="Stock Actual"
                      value={
                        <span
                          className={`font-bold ${
                            parseFloat(contificoData.cantidad_stock) > 0
                              ? "text-success"
                              : "text-error"
                          }`}
                        >
                          {contificoData.cantidad_stock}
                        </span>
                      }
                    />
                    <InfoRow
                      label="Stock Mínimo"
                      value={contificoData.minimo}
                    />
                    <InfoRow
                      label="PVP1 (Principal)"
                      value={contificoData.pvp1}
                      isCurrency
                    />
                    <InfoRow
                      label="PVP2"
                      value={contificoData.pvp2}
                      isCurrency
                    />
                    <InfoRow
                      label="PVP3"
                      value={contificoData.pvp3}
                      isCurrency
                    />
                    <InfoRow
                      label="PVP4"
                      value={contificoData.pvp4}
                      isCurrency
                    />
                    <InfoRow
                      label="IVA"
                      value={`${contificoData.porcentaje_iva}%`}
                    />
                    <InfoRow
                      label="Fecha Creación"
                      value={contificoData.fecha_creacion}
                    />
                    <InfoRow
                      label="Estado"
                      value={
                        <span
                          className={`badge badge-sm ${
                            contificoData.estado === "A"
                              ? "badge-info text-white"
                              : "badge-ghost"
                          }`}
                        >
                          {contificoData.estado === "A" ? "Activo" : "Inactivo"}
                        </span>
                      }
                    />
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
