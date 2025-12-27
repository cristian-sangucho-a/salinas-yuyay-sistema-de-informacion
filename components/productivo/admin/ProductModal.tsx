"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaUpload,
  FaTrash,
  FaImage,
} from "react-icons/fa";
import type {
  Producto,
  CategoriaProducto,
  SubcategoriaProducto,
} from "@/lib/types/productivo";
import {
  createProducto,
  updateProducto,
  deleteProductoImage,
} from "@/lib/admin-data-productivo";
import { ClientResponseError } from "pocketbase";
import { getSubcategoriasByCategoria } from "@/lib/data/tienda/subcategorias";
import { getFileUrl } from "@/lib/data";
import Image from "next/image";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";
import ContificoFieldsModal, {
  type ContificoAdditionalFields,
} from "./ContificoFieldsModal";

interface ProductModalProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean) => void;
  producto: Producto | null;
  categorias: CategoriaProducto[];
}

export default function ProductModal({
  isOpen,
  onClose,
  producto,
  categorias,
}: ProductModalProps) {
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [pvp1, setPvp1] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [estado, setEstado] = useState<"A" | "I">("A");
  const [destacado, setDestacado] = useState(false);
  const [crearEnContifico, setCrearEnContifico] = useState(false);
  const [ingredientes, setIngredientes] = useState("");
  const [condicionesAlmacenamiento, setCondicionesAlmacenamiento] = useState<
    "Refrigeracion" | "Seco" | "Congelación"
  >("Seco");

  const [subcategorias, setSubcategorias] = useState<SubcategoriaProducto[]>(
    []
  );

  const [imagenesExistentes, setImagenesExistentes] = useState<string[]>([]);
  const [imagenesNuevas, setImagenesNuevas] = useState<File[]>([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showContificoModal, setShowContificoModal] = useState(false);
  const [, setPendingContificoCreation] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSubcategorias = async (catId: string) => {
    try {
      const subs = await getSubcategoriasByCategoria(catId);
      setSubcategorias(subs);
    } catch (err) {
      console.error("Error loading subcategories:", err);
    }
  };

  const resetForm = () => {
    setNombre("");
    setSlug("");
    setIsSlugEdited(false);
    setDescripcion("");
    setPvp1("");
    setCategoriaId(categorias[0]?.id || "");
    setSubcategoriaId("");
    setEstado("A");
    setDestacado(false);
    setCrearEnContifico(false);
    setIngredientes("");
    setCondicionesAlmacenamiento("Seco");
    setImagenesExistentes([]);
    setImagenesNuevas([]);
    setImagenesAEliminar([]);
    setShowContificoModal(false);
    setPendingContificoCreation(false);

    if (categorias.length > 0) {
      loadSubcategorias(categorias[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
      if (producto) {
        setNombre(producto.nombre || "");
        setSlug(producto.slug || "");
        setIsSlugEdited(true); // Si editamos, asumimos que el slug ya está definido y no queremos autogenerarlo al cambiar nombre accidentalmente
        setDescripcion(producto.descripcion || "");
        setPvp1(producto.pvp1?.toString() || "");
        setCategoriaId(producto.categoria || "");
        setSubcategoriaId(producto.subcategoria || "");
        setEstado(producto.estado || "A");
        setDestacado(producto.destacado || false);
        setIngredientes(producto.ingredientes || "");
        setCondicionesAlmacenamiento(
          producto.condicionesAlmacenamiento || "Seco"
        );
        setImagenesExistentes(producto.imagenes || []);
        setImagenesNuevas([]);
        setImagenesAEliminar([]);

        // Cargar subcategorías si hay categoría seleccionada
        if (producto.categoria) {
          loadSubcategorias(producto.categoria);
        }
      } else {
        resetForm();
      }
      setError("");
      setSubmitSuccess(false);
    } else {
      setIsVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, producto, categorias]);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setNombre(newName);
    if (!isSlugEdited) {
      const newSlug = newName
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(newSlug);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugEdited(true);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value;
    setCategoriaId(newCatId);
    setSubcategoriaId(""); // Reset subcategoria
    loadSubcategorias(newCatId);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImagenesNuevas((prev) => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index: number) => {
    setImagenesNuevas((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingFile = (imagen: string) => {
    setImagenesAEliminar((prev) => [...prev, imagen]);
  };

  const handleUndoRemoveExistingFile = (imagen: string) => {
    setImagenesAEliminar((prev) => prev.filter((i) => i !== imagen));
  };

  const createProductInContifico = async (
    contificoData: Record<string, unknown>
  ): Promise<string | null> => {
    try {
      const contificoResponse = await fetch("/api/contifico/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contificoData),
      });

      if (!contificoResponse.ok) {
        const errorData = await contificoResponse.json();
        const errorMessage =
          errorData.mensaje || errorData.error || "Error al crear en Contífico";

        // Si el error es sobre campos faltantes, mostrar modal
        if (errorData.cod_error === 1086 || errorMessage.includes("codigo")) {
          setShowContificoModal(true);
          setPendingContificoCreation(true);
          setError("");
          return null;
        }

        throw new Error(errorMessage);
      }

      const contificoResult = await contificoResponse.json();

      // Buscar el producto creado para obtener su ID
      if (contificoResult.id) {
        return contificoResult.id;
      } else if (contificoResult.producto?.id) {
        return contificoResult.producto.id;
      } else if (
        Array.isArray(contificoResult.productos) &&
        contificoResult.productos.length > 0
      ) {
        const createdProduct = contificoResult.productos.find(
          (p: Record<string, unknown>) => p.nombre === nombre
        );
        if (createdProduct && typeof createdProduct.id === "string") {
          return createdProduct.id;
        }
      }

      throw new Error("No se pudo obtener el ID del producto de Contífico");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      throw new Error(errorMsg);
    }
  };

  const handleContificoFieldsSubmit = async (
    fields: ContificoAdditionalFields
  ) => {
    setShowContificoModal(false);
    setIsSubmitting(true);

    try {
      const contificoData = {
        nombre,
        descripcion,
        pvp1: parseFloat(pvp1),
        estado,
        tipo: "PRO",
        porcentaje_iva: "12",
        minimo: "1.0",
        pvp_manual: false,
        para_supereasy: false,
        para_comisariato: fields.para_comisariato || false,
        ...fields,
      };

      const contificoId = await createProductInContifico(contificoData);

      if (!contificoId) {
        setIsSubmitting(false);
        return;
      }

      // Crear en PocketBase
      const productData = {
        nombre,
        slug,
        descripcion,
        pvp1: parseFloat(pvp1),
        categoria: categoriaId,
        subcategoria: subcategoriaId || undefined,
        estado,
        destacado,
        ingredientes,
        condicionesAlmacenamiento,
        imagenes: imagenesNuevas,
        contifico_id: contificoId,
      };

      await createProducto(productData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose(true);
      }, 1500);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      console.error("Error creating product in Contífico:", err);
    } finally {
      setIsSubmitting(false);
      setPendingContificoCreation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!pvp1 || isNaN(parseFloat(pvp1))) {
      setError("El precio debe ser un número válido");
      return;
    }

    if (!categoriaId) {
      setError("La categoría es requerida");
      return;
    }

    setIsSubmitting(true);

    try {
      let contificoId: string | undefined = undefined;

      // Si el usuario desea crear en Contífico, primero creamos allá
      if (crearEnContifico && !producto) {
        const contificoData = {
          nombre,
          descripcion,
          pvp1: parseFloat(pvp1),
          estado,
          tipo: "PRO",
          porcentaje_iva: "12",
          minimo: "1.0",
          pvp_manual: false,
          para_supereasy: false,
          para_comisariato: false,
        };

        try {
          const result = await createProductInContifico(contificoData);
          contificoId = result || undefined;

          // Si retorna null, el modal se mostró, esperar respuesta
          if (contificoId === null) {
            setIsSubmitting(false);
            return;
          }
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : "Error desconocido";
          setError(
            `Error al crear en Contífico: ${errorMsg}. Intenta crear solo en el sistema local.`
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Crear en PocketBase
      const productData = {
        nombre,
        slug,
        descripcion,
        pvp1: parseFloat(pvp1),
        categoria: categoriaId,
        subcategoria: subcategoriaId || undefined,
        estado,
        destacado,
        ingredientes,
        condicionesAlmacenamiento,
        imagenes: imagenesNuevas,
        ...(contificoId && { contifico_id: contificoId }),
      };

      if (producto) {
        // Update
        for (const img of imagenesAEliminar) {
          await deleteProductoImage(producto.id, img);
        }

        await updateProducto(producto.id, productData);
      } else {
        // Create
        await createProducto(productData);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose(true);
      }, 1500);
    } catch (err: unknown) {
      console.error("Error saving product:", err);
      if (err instanceof ClientResponseError && err.data) {
        console.error("Validation Errors:", err.data);
      }
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
        className={`bg-base-100 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white text-primary px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-base-300 sticky top-0 z-10">
          <Title variant="h3" className="font-bold">
            {producto ? "Editar Producto" : "Nuevo Producto"}
          </Title>
          <button
            onClick={() => onClose(false)}
            className="text-base-content/60 hover:text-error hover:bg-error/10 rounded-full p-2 transition-all duration-200 hover:rotate-90"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          {submitSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                <FaCheckCircle className="w-10 h-10" />
              </div>
              <Title variant="h4" className="text-primary mb-2 font-bold">
                ¡Operación Exitosa!
              </Title>
              <Text color="muted">
                El producto ha sido {producto ? "actualizado" : "creado"}{" "}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Columna Izquierda: Información Básica */}
                <div className="space-y-4">
                  <Title
                    variant="h4"
                    className="font-bold text-primary border-b border-base-300 pb-2"
                  >
                    Información Básica
                  </Title>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        Nombre del Producto *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={handleNombreChange}
                      className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                      placeholder="Ej: Mermelada de Frutilla"
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        Slug (URL) *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={handleSlugChange}
                      className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content font-mono text-sm"
                      placeholder="ej-mermelada-de-frutilla"
                      required
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
                      placeholder="Descripción detallada del producto..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium text-primary">
                          Precio ($) *
                        </span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={pvp1}
                        onChange={(e) => setPvp1(e.target.value)}
                        className="input input-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium text-primary">
                          Categoría *
                        </span>
                      </label>
                      <select
                        value={categoriaId}
                        onChange={handleCategoriaChange}
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
                          Subcategoría
                        </span>
                      </label>
                      <select
                        value={subcategoriaId}
                        onChange={(e) => setSubcategoriaId(e.target.value)}
                        className="select select-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                        disabled={!categoriaId || subcategorias.length === 0}
                      >
                        <option value="">Ninguna</option>
                        {subcategorias.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Detalles y Archivos */}
                <div className="space-y-4">
                  <Title
                    variant="h4"
                    className="font-bold text-primary border-b border-base-300 pb-2"
                  >
                    Detalles y Multimedia
                  </Title>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium text-primary">
                          Estado
                        </span>
                      </label>
                      <select
                        value={estado}
                        onChange={(e) => setEstado(e.target.value as "A" | "I")}
                        className="select select-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                      >
                        <option value="A">Activo</option>
                        <option value="I">Inactivo</option>
                      </select>
                    </div>
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium text-primary">
                          Almacenamiento
                        </span>
                      </label>
                      <select
                        value={condicionesAlmacenamiento}
                        onChange={(e) =>
                          setCondicionesAlmacenamiento(
                            e.target.value as
                              | "Refrigeracion"
                              | "Seco"
                              | "Congelación"
                          )
                        }
                        className="select select-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none text-base-content"
                      >
                        <option value="Seco">Seco</option>
                        <option value="Refrigeracion">Refrigeración</option>
                        <option value="Congelación">Congelación</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-4">
                      <input
                        type="checkbox"
                        checked={destacado}
                        onChange={(e) => setDestacado(e.target.checked)}
                        className="checkbox checkbox-primary"
                      />
                      <span className="label-text font-medium text-primary">
                        Producto Destacado
                      </span>
                    </label>
                  </div>

                  {!producto && (
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-4">
                        <input
                          type="checkbox"
                          checked={crearEnContifico}
                          onChange={(e) =>
                            setCrearEnContifico(e.target.checked)
                          }
                          className="checkbox checkbox-accent"
                        />
                        <span className="label-text font-medium text-accent">
                          Crear también en Contífico
                        </span>
                      </label>
                      <Text color="muted" className="text-xs ml-9 mt-1">
                        El producto se creará en el sistema Contífico y se
                        vinculará automáticamente.
                      </Text>
                    </div>
                  )}

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        Ingredientes
                      </span>
                    </label>
                    <textarea
                      value={ingredientes}
                      onChange={(e) => setIngredientes(e.target.value)}
                      className="textarea textarea-bordered w-full bg-white border-base-300 focus:border-accent focus:outline-none resize-none text-base-content h-20"
                      placeholder="Lista de ingredientes..."
                    ></textarea>
                  </div>

                  {/* Gestión de Imágenes */}
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium text-primary">
                        Imágenes del Producto
                      </span>
                    </label>

                    <div
                      className="border-2 border-dashed border-base-300 rounded-lg p-4 bg-base-100/50 hover:bg-base-100 transition-colors text-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaUpload className="mx-auto text-base-content/40 mb-2" />
                      <Text variant="small" color="muted">
                        Haz clic para subir imágenes
                      </Text>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        multiple
                        accept="image/*"
                      />
                    </div>

                    {/* Lista de imágenes */}
                    <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                      {/* Imágenes Existentes */}
                      {imagenesExistentes.map((img, index) => {
                        const isDeleted = imagenesAEliminar.includes(img);
                        const imgUrl = getFileUrl(producto, "imagenes", img);

                        return (
                          <div
                            key={`exist-${index}`}
                            className={`flex items-center justify-between p-2 rounded border ${
                              isDeleted
                                ? "bg-error/10 border-error/30"
                                : "bg-white border-base-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 relative rounded overflow-hidden bg-base-200">
                                {imgUrl ? (
                                  <Image
                                    src={imgUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <FaImage className="text-base-content/30 m-auto" />
                                )}
                              </div>
                              <span
                                className={`text-sm truncate max-w-[150px] ${
                                  isDeleted
                                    ? "line-through text-base-content/50"
                                    : "text-base-content"
                                }`}
                              >
                                {img}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                isDeleted
                                  ? handleUndoRemoveExistingFile(img)
                                  : handleRemoveExistingFile(img)
                              }
                              className={`btn btn-xs btn-circle ${
                                isDeleted
                                  ? "btn-ghost text-success"
                                  : "btn-ghost text-error"
                              }`}
                              title={isDeleted ? "Restaurar" : "Eliminar"}
                            >
                              {isDeleted ? <FaCheckCircle /> : <FaTrash />}
                            </button>
                          </div>
                        );
                      })}

                      {/* Imágenes Nuevas */}
                      {imagenesNuevas.map((file, index) => (
                        <div
                          key={`new-${index}`}
                          className="flex items-center justify-between p-2 bg-success/5 border border-success/20 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-success/10 rounded text-success">
                              <FaImage />
                            </div>
                            <span className="text-sm text-base-content truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <span className="badge badge-xs badge-success text-white">
                              Nuevo
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNewFile(index)}
                            className="btn btn-xs btn-circle btn-ghost text-error"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-base-300">
                <Button
                  type="button"
                  onClick={() => onClose(false)}
                  className="flex-1 bg-white border-2 border-base-300 text-primary hover:bg-base-100 hover:border-accent"
                  disabled={isSubmitting}
                  variant="ghost"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  disabled={isSubmitting}
                  variant="primary"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : producto ? (
                    "Actualizar Producto"
                  ) : (
                    "Crear Producto"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Contífico Fields Modal */}
      <ContificoFieldsModal
        isOpen={showContificoModal}
        onClose={() => {
          setShowContificoModal(false);
          setPendingContificoCreation(false);
          setIsSubmitting(false);
        }}
        onSubmit={handleContificoFieldsSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
