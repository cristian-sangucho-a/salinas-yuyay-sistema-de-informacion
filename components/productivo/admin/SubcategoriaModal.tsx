"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaCheckCircle } from "react-icons/fa";
import type {
  SubcategoriaProducto,
  CategoriaProducto,
} from "@/lib/types/productivo";
import {
  createSubcategoria,
  updateSubcategoria,
} from "@/lib/admin-data-productivo";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";

interface SubcategoriaModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  subcategoria: SubcategoriaProducto | null;
  categorias: CategoriaProducto[];
}

export default function SubcategoriaModal({
  isOpen,
  onClose,
  subcategoria,
  categorias,
}: SubcategoriaModalProps) {
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (subcategoria) {
        setNombre(subcategoria.nombre);
        setSlug(subcategoria.slug);
        setDescripcion(subcategoria.descripcion_subcategoria || "");
        setCategoriaId(subcategoria.categoria_producto || "");
      } else {
        resetForm();
      }
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setSubmitSuccess(false);
        setError("");
      }, 300);
    }
  }, [isOpen, subcategoria]);

  const resetForm = () => {
    setNombre("");
    setSlug("");
    setDescripcion("");
    setCategoriaId("");
    setError("");
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNombre(val);
    if (!subcategoria) {
      // Auto-generate slug only on create
      setSlug(
        val
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !slug || !categoriaId) {
      setError("Nombre, Slug y Categoría son obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        nombre,
        slug,
        descripcion_subcategoria: descripcion,
        categoria_producto: categoriaId,
      };

      if (subcategoria) {
        await updateSubcategoria(subcategoria.id, data);
      } else {
        await createSubcategoria(data);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose(true);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={() => onClose(false)}
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
            {subcategoria ? "Editar Subcategoría" : "Nueva Subcategoría"}
          </Title>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onClose(false)}
            className="text-base-content/60 hover:text-error hover:bg-error/10 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <FaTimes className="w-6 h-6" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="w-10 h-10" />
              </div>
              <Title variant="h4" className="text-primary mb-2">
                ¡Operación Exitosa!
              </Title>
              <Text color="muted">
                La subcategoría ha sido{" "}
                {subcategoria ? "actualizada" : "creada"} correctamente.
              </Text>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert alert-error text-white shadow-lg animate-in slide-in-from-top-2">
                  <FaTimes />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-primary">
                      Nombre *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={handleNombreChange}
                    className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                    placeholder="Ej: Mermeladas"
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-primary">
                      Slug *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                    placeholder="Ej: mermeladas"
                    required
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="Solo letras minúsculas, números y guiones"
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-primary">
                      Categoría Padre *
                    </span>
                  </label>
                  <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    className="select select-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                    required
                  >
                    <option value="" disabled>
                      Seleccionar...
                    </option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-primary">
                      Descripción
                    </span>
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="textarea textarea-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none resize-none text-base-content h-24"
                    placeholder="Descripción de la subcategoría..."
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-base-300">
                <Button
                  type="button"
                  onClick={() => onClose(false)}
                  variant="ghost"
                  className="flex-1 bg-white border-2 border-base-300 text-primary hover:bg-base-100 hover:border-accent"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : subcategoria ? (
                    "Actualizar Subcategoría"
                  ) : (
                    "Crear Subcategoría"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
