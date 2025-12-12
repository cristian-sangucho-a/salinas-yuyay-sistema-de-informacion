"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaCheckCircle, FaUpload } from "react-icons/fa";
import type { CategoriaProducto } from "@/lib/types/productivo";
import { createCategoria, updateCategoria } from "@/lib/admin-data-productivo";
import { getFileUrl } from "@/lib/data";
import Image from "next/image";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  categoria: CategoriaProducto | null;
}

export default function CategoriaModal({
  isOpen,
  onClose,
  categoria,
}: CategoriaModalProps) {
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [imagenExistente, setImagenExistente] = useState<string | null>(null);
  const [imagenNueva, setImagenNueva] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (categoria) {
        setNombre(categoria.nombre);
        setSlug(categoria.slug);
        setDescripcion(categoria.descripcion_categoria || "");
        setImagenExistente(categoria.field || null);
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
  }, [isOpen, categoria]);

  const resetForm = () => {
    setNombre("");
    setSlug("");
    setDescripcion("");
    setImagenExistente(null);
    setImagenNueva(null);
    setError("");
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNombre(val);
    if (!categoria) {
      // Auto-generate slug only on create
      setSlug(
        val
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, "")
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenNueva(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !slug) {
      setError("Nombre y Slug son obligatorios");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        nombre,
        slug,
        descripcion_categoria: descripcion,
      } as const;

      if (imagenNueva) {
        (data as Record<string, string | File>).field = imagenNueva;
      }

      if (categoria) {
        await updateCategoria(categoria.id, data);
      } else {
        await createCategoria(data);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose(true);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      console.error("Error saving category:", err);
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
            {categoria ? "Editar Categoría" : "Nueva Categoría"}
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
                La categoría ha sido {categoria ? "actualizada" : "creada"}{" "}
                correctamente.
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
                    placeholder="Ej: Alimentos"
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
                    placeholder="Ej: alimentos"
                    required
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="Solo letras minúsculas, números y guiones"
                  />
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
                    placeholder="Descripción de la categoría..."
                  ></textarea>
                </div>

                {/* Imagen */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium text-primary">
                      Imagen
                    </span>
                  </label>

                  <div className="flex items-start gap-4">
                    <div
                      className="flex-1 border-2 border-dashed border-base-300 rounded-lg p-4 bg-base-100/50 hover:bg-base-100 transition-colors text-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaUpload className="mx-auto text-base-content/40 mb-2" />
                      <Text variant="small" color="muted">
                        {imagenNueva
                          ? imagenNueva.name
                          : "Haz clic para subir imagen"}
                      </Text>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>

                    {(imagenNueva || imagenExistente) && (
                      <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-base-300 bg-base-200 shrink-0">
                        {imagenNueva ? (
                          <Image
                            src={URL.createObjectURL(imagenNueva)}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : imagenExistente &&
                          typeof imagenExistente === "string" ? (
                          <Image
                            src={
                              getFileUrl(
                                categoria!,
                                "field",
                                imagenExistente
                              ) || ""
                            }
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : null}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagenNueva(null);
                            // Note: We can't easily "remove" the existing image without a specific backend action or flag
                            // For now, we just allow replacing it.
                          }}
                          className="absolute top-1 right-1 btn btn-xs btn-circle btn-error text-white"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    )}
                  </div>
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
                  ) : categoria ? (
                    "Actualizar Categoría"
                  ) : (
                    "Crear Categoría"
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
