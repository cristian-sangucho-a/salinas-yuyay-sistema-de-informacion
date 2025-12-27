"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaTimes, FaCheckCircle, FaImage, FaUpload } from "react-icons/fa";
import type { Categoria } from "@/lib/types";
import { createCategoria, updateCategoria } from "@/lib/admin-data";
import { getFileUrl } from "@/lib/data";

interface CategoriaModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  categoria: Categoria | null;
}

export default function CategoriaModal({
  isOpen,
  onClose,
  categoria,
}: CategoriaModalProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string>("");
  const [removeImage, setRemoveImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      if (categoria) {
        setNombre(categoria.nombre);
        setDescripcion(categoria.descripcion);
        const existingImage = getFileUrl(categoria, "imagen");
        setImagenPreview(existingImage || "");
        setImagen(null);
        setRemoveImage(false);
      } else {
        setNombre("");
        setDescripcion("");
        setImagen(null);
        setImagenPreview("");
        setRemoveImage(false);
      }
      setError("");
      setSubmitSuccess(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, categoria]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe superar los 5MB");
        return;
      }

      setImagen(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagen(null);
    setImagenPreview("");
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción es requerida");
      return;
    }

    try {
      setIsSubmitting(true);

      if (categoria) {
        await updateCategoria(categoria.id, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          imagen: removeImage ? null : imagen || undefined,
        });
      } else {
        await createCategoria({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          imagen: imagen || undefined,
        });
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose(true);
      }, 2000);
    } catch (err: unknown) {
      console.error("Error al guardar categoría:", err);
      const message =
        err instanceof Error ? err.message : "Error al guardar la categoría";
      setError(message);
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
      onClick={() => !isSubmitting && onClose(false)}
    >
      <div
        className={`bg-[#F8F3ED] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white text-[#5A1E02] px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-[#D9C3A3]">
          <h2 className="text-xl font-bold">
            {categoria ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={() => onClose(false)}
            disabled={isSubmitting}
            className="text-[#B63A1B] hover:bg-[#B63A1B]/10 rounded-full p-1 transition-all duration-200 hover:rotate-90 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-10 text-center animate-in fade-in zoom-in duration-500">
            <FaCheckCircle className="w-20 h-20 text-[#7C8B56] mx-auto mb-4 animate-in zoom-in duration-700" />
            <h3 className="text-2xl font-bold text-[#5A1E02] mb-3">
              {categoria ? "¡Categoría Actualizada!" : "¡Categoría Creada!"}
            </h3>
            <p className="text-[#4A3B31]">
              La categoría ha sido guardada exitosamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <p className="text-sm text-[#4A3B31]/80">
              {categoria
                ? "Modifica los datos de la categoría."
                : "Completa el formulario para crear una nueva categoría."}{" "}
              Los campos marcados con{" "}
              <span className="text-[#B63A1B] font-semibold">*</span> son
              obligatorios.
            </p>

            <div className="space-y-4">
              <div
                className="form-control animate-in slide-in-from-bottom duration-300"
                style={{ animationDelay: "100ms" }}
              >
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Nombre de la categoría{" "}
                    <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31] transition-all disabled:opacity-50"
                  placeholder="Ej: Documentos Históricos"
                />
                <label className="label">
                  <span className="label-text-alt text-[#4A3B31]/60 text-xs">
                    Nombre descriptivo para la categoría
                  </span>
                </label>
              </div>

              <div
                className="form-control animate-in slide-in-from-bottom duration-300"
                style={{ animationDelay: "200ms" }}
              >
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Descripción <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="textarea textarea-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none resize-none text-[#4A3B31] transition-all disabled:opacity-50"
                  placeholder="Describe el contenido de esta categoría..."
                />
              </div>

              <div
                className="form-control animate-in slide-in-from-bottom duration-300"
                style={{ animationDelay: "300ms" }}
              >
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Imagen
                  </span>
                  <span className="label-text-alt text-[#4A3B31]/50 text-xs">
                    (Opcional)
                  </span>
                </label>

                {imagenPreview && !removeImage ? (
                  <div className="relative w-full h-56 bg-[#D9C3A3] rounded-lg overflow-hidden mb-3 group">
                    <Image
                      src={imagenPreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isSubmitting}
                        className="btn btn-sm bg-[#B63A1B] hover:bg-[#B63A1B]/80 text-white border-none disabled:opacity-50"
                      >
                        <FaTimes className="w-3 h-3 mr-1" />
                        Quitar imagen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-white border-2 border-dashed border-[#D9C3A3] rounded-lg flex flex-col items-center justify-center mb-3 hover:border-[#7C8B56] transition-colors">
                    <FaImage className="w-12 h-12 text-[#5A1E02]/30 mb-2" />
                    <p className="text-sm text-[#4A3B31]/60 mb-1">
                      No hay imagen seleccionada
                    </p>
                    <p className="text-xs text-[#4A3B31]/40">
                      JPG, PNG o GIF (máx. 5MB)
                    </p>
                  </div>
                )}

                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="btn btn-outline border-[#D9C3A3] text-[#5A1E02] hover:bg-[#7C8B56]/10 hover:border-[#7C8B56] w-full disabled:opacity-50"
                  >
                    <FaUpload className="w-4 h-4 mr-2" />
                    {imagenPreview && !removeImage
                      ? "Cambiar imagen"
                      : "Seleccionar imagen"}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm animate-in shake">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onClose(false)}
                disabled={isSubmitting}
                className="btn flex-1 bg-white border-2 border-[#D9C3A3] text-[#4A3B31] hover:bg-[#F8F3ED] hover:border-[#7C8B56] transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn flex-1 bg-[#7C8B56] hover:bg-[#7C8B56]/90 text-white border-none disabled:bg-[#7C8B56]/30 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </span>
                ) : categoria ? (
                  "Guardar cambios"
                ) : (
                  "Crear categoría"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
