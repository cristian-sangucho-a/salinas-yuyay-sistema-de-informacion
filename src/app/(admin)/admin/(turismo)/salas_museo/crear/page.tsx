"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { FaImage, FaPlus, FaSave } from "react-icons/fa";
import "quill/dist/quill.snow.css";
import AdminHeader from "@components/molecules/AdminHeader";
import Alert from "@components/molecules/Alert";
import { createSalaMuseo } from "@/lib/data/turismo/salas-museo";
import type QuillType from "quill";

export default function CrearSalaInlinePage() {
  const ejemploContenido = `
  <h2>Encabezado H2 de ejemplo</h2>
  <p><strong>Negrita</strong>, <em>itálica</em>, <u>subrayado</u>, <s>tachado</s> y <a href="https://example.com" target="_blank">enlace</a>.</p>
  <p style="color:#1d4ed8;">Texto con color azul</p>
  <blockquote>Esta es una cita breve para ilustrar el bloque de cita.</blockquote>
  <ol>
    <li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Elemento numerado uno</li>
    <li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>Elemento numerado dos</li>
  </ol>
  <ul>
    <li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Viñeta uno</li>
    <li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>Viñeta dos</li>
  </ul>
  <p><span style="background-color: #fef08a;">Texto con resaltado</span> y cierre del ejemplo.</p>
  `;
  const [titulo, setTitulo] = useState("");
  const [eslogan, setEslogan] = useState("");
  const [contenido, setContenido] = useState(ejemploContenido);
  const [portada, setPortada] = useState<File | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [publico, setPublico] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [existingPortadaUrl] = useState<string | null>(null);
  const [existingGaleriaUrls] = useState<string[]>([]);

  const portadaInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillType | null>(null);

  const portadaUrl = useMemo(
    () => (portada ? URL.createObjectURL(portada) : null),
    [portada]
  );
  const galeriaUrls = useMemo(
    () => galeria.map((f) => URL.createObjectURL(f)),
    [galeria]
  );

  useEffect(() => {
    let handler: (() => void) | null = null;
    const removeToolbar = () => {
      const container = editorContainerRef.current;
      const parent = container?.parentElement;
      parent?.querySelectorAll(".ql-toolbar").forEach((node) => node.remove());
    };
    const initEditor = async () => {
      if (!editorContainerRef.current || quillRef.current) return;
      removeToolbar();
      editorContainerRef.current.innerHTML = "";
      const Quill = (await import("quill")).default;
      const quill = new Quill(editorContainerRef.current, {
        theme: "snow",
        placeholder: "Describe la sala...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            ["link", "blockquote"],
            ["clean"],
          ],
        },
      });
      quillRef.current = quill;
      if (contenido) {
        quill.root.innerHTML = contenido;
      }
      handler = () => {
        if (!quillRef.current) return;
        setContenido(quillRef.current.root.innerHTML);
      };
      quill.on("text-change", handler);
    };
    void initEditor();
    return () => {
      if (quillRef.current && handler) {
        quillRef.current.off("text-change", handler);
      }
      quillRef.current = null;
      removeToolbar();
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== contenido) {
      quillRef.current.root.innerHTML = contenido;
    }
  }, [contenido]);

  // This page is create-only. Edición se maneja en la página de editar.

  const handlePortadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPortada(f);
  };

  const handleGaleriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setGaleria((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !eslogan || !contenido) {
      setStatus("Error: Título, Eslogan y Contenido son obligatorios.");
      return;
    }
    setStatus("Enviando...");

    try {
      const created = await createSalaMuseo({
        titulo,
        eslogan: eslogan,
        contenido,
        portada: portada ?? undefined,
        galeria: galeria.length > 0 ? galeria : undefined,
        publico,
      });

      setStatus(`Sala creada con éxito: ${created?.id}`);

      // Limpiar formulario
      setTitulo("");
      setEslogan("");
      setContenido("");
      setPortada(null);
      setGaleria([]);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <main className="flex-1">
      <AdminHeader
        title="Panel Administrativo"
        subtitle="Salas del Museo"
        backHref="/admin/salas_museo"
        backLabel="Salas"
      />
      <form onSubmit={handleSubmit}>
        <article className="max-w-4xl mx-auto my-8 relative">
          {/* Botón Guardar flotante */}
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
            {status && (
              <Alert
                type={
                  status.includes("Error")
                    ? "error"
                    : status.includes("éxito") || status.includes("creada")
                    ? "success"
                    : "info"
                }
                className="shadow-lg max-w-md"
              >
                {status}
              </Alert>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-circle shadow-lg"
              aria-label="Guardar Sala"
            >
              <FaSave size={24} />
            </button>
          </div>

          {/* Portada */}
          <input
            type="file"
            accept="image/*"
            ref={portadaInputRef}
            onChange={handlePortadaChange}
            className="hidden"
          />
          <div
            className="w-full h-72 md:h-96 overflow-hidden rounded-b-md relative bg-base-200 flex items-center justify-center cursor-pointer group"
            onClick={() => portadaInputRef.current?.click()}
          >
            {portadaUrl || existingPortadaUrl ? (
              <Image
                src={portadaUrl ?? existingPortadaUrl ?? "/placeholder.png"}
                alt="Portada"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center text-base-content/50">
                <FaImage size={48} className="mx-auto" />
                <p className="mt-2 font-semibold">Añadir Portada</p>
                <p className="text-sm">Haz clic para seleccionar una imagen</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white font-bold text-lg">Cambiar Portada</p>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-4 flex items-center gap-3">
              <input
                id="publico"
                type="checkbox"
                checked={publico}
                onChange={(e) => setPublico(e.target.checked)}
                className="checkbox checkbox-primary"
              />
              <label htmlFor="publico" className="text-sm">
                Marcar como público
              </label>
            </div>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la sala..."
              className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-4 transition-colors"
            />

            <textarea
              value={eslogan}
              onChange={(e) => setEslogan(e.target.value)}
              placeholder="Eslogan corto de la sala (máx 200 caracteres)"
              className="text-lg text-base-content/70 bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-6 transition-colors"
              rows={2}
              maxLength={200}
            />

            <h2 className="text-2xl font-semibold mb-4">Contenido</h2>
            <div className="bg-base-200 border border-base-300 rounded-lg">
              <div
                ref={editorContainerRef}
                className="prose max-w-none text-base-content/90 min-h-[320px]"
              />
            </div>

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {existingGaleriaUrls.map((url, i) => (
                  <div
                    key={`existing-${i}`}
                    className="h-44 overflow-hidden rounded shadow-sm relative"
                  >
                    <Image
                      src={url}
                      alt={`Imagen de galería existente ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {galeriaUrls.map((url, i) => (
                  <div
                    key={`new-${i}`}
                    className="h-44 overflow-hidden rounded shadow-sm relative"
                  >
                    <Image
                      src={url}
                      alt={`Imagen de galería ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={galeriaInputRef}
                  onChange={handleGaleriaChange}
                  className="hidden"
                />
                <div
                  className="h-44 rounded shadow-sm border-2 border-dashed border-base-300 flex flex-col items-center justify-center text-base-content/50 hover:bg-base-200 hover:border-primary cursor-pointer transition-colors"
                  onClick={() => galeriaInputRef.current?.click()}
                >
                  <FaPlus size={24} />
                  <p className="mt-2 text-sm font-semibold">Añadir Imágenes</p>
                </div>
              </div>
            </section>
          </div>
        </article>
      </form>

      <footer className="mt-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <p className="text-sm text-center text-[#4A3B31]/60">
            Creado por Hakan Team
          </p>
        </div>
      </footer>
    </main>
  );
}
