"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaUpload,
  FaFile,
  FaTrash,
} from "react-icons/fa";
import type { Activo, Categoria } from "@/lib/types";
import { createActivo, updateActivo } from "@/lib/admin-data";

interface ActivoModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  activo: Activo | null;
  categorias: Categoria[];
}

export default function ActivoModal({
  isOpen,
  onClose,
  activo,
  categorias,
}: ActivoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [anio, setAnio] = useState("");
  const [autor, setAutor] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [publico, setPublico] = useState(true);
  const [archivosExistentes, setArchivosExistentes] = useState<string[]>([]);
  const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);
  const [archivosAEliminar, setArchivosAEliminar] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      if (activo) {
        setTitulo(activo.titulo);
        setDescripcion(activo.descripcion);
        setAnio(activo.anio?.toString() || "");
        setAutor(activo.autor || "");
        setCategoriaId(activo.categoria);
        setPublico(activo.publico);
        setArchivosExistentes(activo.archivos || []);
        setArchivosNuevos([]);
        setArchivosAEliminar([]);
      } else {
        setTitulo("");
        setDescripcion("");
        setAnio("");
        setAutor("");
        setCategoriaId(categorias[0]?.id || "");
        setPublico(true);
        setArchivosExistentes([]);
        setArchivosNuevos([]);
        setArchivosAEliminar([]);
      }
      setError("");
      setSubmitSuccess(false);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, activo, categorias]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArchivosNuevos((prev) => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index: number) => {
    setArchivosNuevos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (archivo: string) => {
    setArchivosAEliminar((prev) => [...prev, archivo]);
  };

  const handleUndoRemoveExistingFile = (archivo: string) => {
    setArchivosAEliminar((prev) => prev.filter((a) => a !== archivo));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!titulo.trim()) {
      setError("El título es requerido");
      return;
    }

    if (!descripcion.trim()) {
      setError("La descripción es requerida");
      return;
    }

    if (!categoriaId) {
      setError("Debe seleccionar una categoría");
      return;
    }

    try {
      setIsSubmitting(true);

      const anioNum = anio.trim() ? parseInt(anio) : undefined;

      if (activo) {
        await updateActivo(activo.id, {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          anio: anioNum || null,
          autor: autor.trim() || undefined,
          publico,
          categoria: categoriaId,
          nuevosArchivos:
            archivosNuevos.length > 0 ? archivosNuevos : undefined,
          archivosAEliminar:
            archivosAEliminar.length > 0 ? archivosAEliminar : undefined,
        });
      } else {
        await createActivo({
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          anio: anioNum,
          autor: autor.trim() || undefined,
          archivos: archivosNuevos.length > 0 ? archivosNuevos : undefined,
          publico,
          categoria: categoriaId,
        });
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onClose(true);
      }, 2000);
    } catch (err: unknown) {
      console.error("Error al guardar activo:", err);
      const message =
        err instanceof Error ? err.message : "Error al guardar el activo";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const archivosVisibles = archivosExistentes.filter(
    (a) => !archivosAEliminar.includes(a)
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={() => !isSubmitting && onClose(false)}
    >
      <div
        className={`bg-[#F8F3ED] rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white text-[#5A1E02] px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-[#D9C3A3]">
          <h2 className="text-xl font-bold">
            {activo ? "Editar Activo" : "Nuevo Activo"}
          </h2>
          <button
            onClick={() => onClose(false)}
            disabled={isSubmitting}
            className="text-[#B63A1B] hover:bg-[#B63A1B]/10 rounded-full p-1 transition-all duration-200 hover:rotate-90 disabled:opacity-50"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-10 text-center animate-in fade-in zoom-in duration-500">
            <FaCheckCircle className="w-20 h-20 text-[#7C8B56] mx-auto mb-4 animate-in zoom-in duration-700" />
            <h3 className="text-2xl font-bold text-[#5A1E02] mb-3">
              {activo ? "¡Activo Actualizado!" : "¡Activo Creado!"}
            </h3>
            <p className="text-[#4A3B31]">
              El activo ha sido guardado exitosamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <p className="text-sm text-[#4A3B31]/80">
              Completa la información del activo. Los campos marcados con{" "}
              <span className="text-[#B63A1B] font-semibold">*</span> son
              obligatorios.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Título <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31] transition-all"
                  placeholder="Título del activo"
                />
              </div>

              <div className="form-control md:col-span-2">
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
                  className="textarea textarea-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none resize-none text-[#4A3B31] transition-all"
                  placeholder="Descripción detallada del activo"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Año
                  </span>
                </label>
                <input
                  type="number"
                  value={anio}
                  onChange={(e) => setAnio(e.target.value)}
                  disabled={isSubmitting}
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31] transition-all"
                  placeholder="1990"
                  min="1000"
                  max="9999"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Autor
                  </span>
                </label>
                <input
                  type="text"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  disabled={isSubmitting}
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31] transition-all"
                  placeholder="Nombre del autor"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Categoría <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="select select-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31] transition-all"
                >
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Visibilidad
                  </span>
                </label>
                <div className="flex items-center gap-4 bg-white border border-[#D9C3A3] rounded-lg px-4 py-3 hover:bg-[#F8F3ED] transition-colors">
                  <span className="text-[#4A3B31] text-sm font-medium">
                    {publico ? "Hacer público" : "Mantener privado"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPublico(!publico)}
                    disabled={isSubmitting}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none border border-[#D9C3A3] ${
                      publico ? "bg-[#7C8B56]" : "bg-[#D9C3A3]/40"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transform transition-transform duration-300 ${
                        publico ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Archivos existentes */}
            {archivosVisibles.length > 0 && (
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Archivos actuales ({archivosVisibles.length})
                  </span>
                </label>
                <div className="space-y-2">
                  {archivosVisibles.map((archivo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-[#D9C3A3] rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FaFile className="w-4 h-4 text-[#8B3C10] shrink-0" />
                        <span className="text-sm text-[#4A3B31] truncate">
                          {archivo}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(archivo)}
                        disabled={isSubmitting}
                        className="btn btn-sm btn-ghost text-[#B63A1B] hover:bg-red-50"
                      >
                        <FaTrash className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Archivos marcados para eliminar */}
            {archivosAEliminar.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Archivos a eliminar ({archivosAEliminar.length}):
                </p>
                <div className="space-y-1">
                  {archivosAEliminar.map((archivo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-red-700">{archivo}</span>
                      <button
                        type="button"
                        onClick={() => handleUndoRemoveExistingFile(archivo)}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                      >
                        Deshacer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nuevos archivos */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-[#4A3B31] text-sm font-semibold">
                  {activo ? "Agregar archivos" : "Archivos"}
                </span>
              </label>

              {archivosNuevos.length > 0 && (
                <div className="space-y-2 mb-3">
                  {archivosNuevos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#7C8B56]/10 border border-[#7C8B56]/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FaFile className="w-4 h-4 text-[#7C8B56] shrink-0" />
                        <span className="text-sm text-[#4A3B31] truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-[#4A3B31]/60">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewFile(index)}
                        disabled={isSubmitting}
                        className="btn btn-sm btn-ghost text-[#B63A1B] hover:bg-red-50"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="btn btn-outline border-[#D9C3A3] text-[#5A1E02] hover:bg-[#7C8B56]/10 hover:border-[#7C8B56] w-full"
              >
                <FaUpload className="w-4 h-4 mr-2" />
                Seleccionar archivos
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onClose(false)}
                disabled={isSubmitting}
                className="btn flex-1 bg-white border-2 border-[#D9C3A3] text-[#4A3B31] hover:bg-[#F8F3ED] hover:border-[#7C8B56] transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn flex-1 bg-[#7C8B56] hover:bg-[#7C8B56]/90 text-white border-none transition-all"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Guardando...
                  </>
                ) : activo ? (
                  "Guardar cambios"
                ) : (
                  "Crear activo"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
