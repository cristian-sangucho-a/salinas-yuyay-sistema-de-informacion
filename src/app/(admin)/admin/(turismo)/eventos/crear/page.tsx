"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "quill/dist/quill.snow.css";
import { FaImage, FaSave, FaPlus, FaCalendar, FaUsers } from "react-icons/fa";
import AdminHeader from "@components/molecules/AdminHeader";
import Alert from "@components/molecules/Alert";
import { createEvento } from "@/lib/data/turismo/eventos";
import type QuillType from "quill";

export default function CrearEventoInlinePage() {
  const router = useRouter();
  const ejemploContenido = `
  <h2>Encabezado H2 de ejemplo</h2>
  <p><strong>Negrita</strong>, <em>itálica</em>, <u>subrayado</u>, <s>tachado</s> y <a href="https://example.com" target="_blank">enlace</a>.</p>
  <p style="color:#1d4ed8;">Texto con color azul</p>
  <blockquote>Esta es una cita breve para ilustrar el bloque de cita.</blockquote>
  <ol>
    <li>Elemento numerado uno</li>
    <li>Elemento numerado dos</li>
  </ol>
  <ul>
    <li>Viñeta uno</li>
    <li>Viñeta dos</li>
  </ul>
  <p><span style="background-color: #fef08a;">Texto con resaltado</span> y cierre del ejemplo.</p>
  `;
  const [titulo, setTitulo] = useState("");
  const [eslogan, setEslogan] = useState("");
  const [contenido, setContenido] = useState(ejemploContenido);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [organizadores, setOrganizadores] = useState("");
  const [portada, setPortada] = useState<File | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [publico, setPublico] = useState<boolean>(true);
  // create-only: we don't preload existing images here
  const [status, setStatus] = useState<string | null>(null);

  const portadaInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillType | null>(null);

  useEffect(() => {
    let handler: (() => void) | null = null;
    const removeToolbar = () => {
      const container = editorContainerRef.current;
      const maybeToolbar = container?.previousElementSibling;
      if (maybeToolbar && maybeToolbar.classList.contains("ql-toolbar")) {
        maybeToolbar.remove();
      }
    };
    const initEditor = async () => {
      if (!editorContainerRef.current || quillRef.current) return;
      removeToolbar();
      const Quill = (await import("quill")).default;
      const quill = new Quill(editorContainerRef.current, {
        theme: "snow",
        placeholder: "Escribe el contenido del evento aquí...",
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

  const portadaUrl = useMemo(
    () => (portada ? URL.createObjectURL(portada) : null),
    [portada]
  );
  const galeriaUrls = useMemo(
    () => galeria.map((f) => URL.createObjectURL(f)),
    [galeria]
  );
  // This page is create-only; editing is handled in the edit page.

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
    if (
      !titulo ||
      !contenido ||
      !eslogan ||
      !fechaInicio ||
      !fechaFin ||
      !organizadores
    ) {
      setStatus("Error: Todos los campos son obligatorios.");
      return;
    }
    setStatus("Enviando...");

    try {
      const created = await createEvento({
        titulo,
        eslogan: eslogan,
        contenido,
        fecha_de_inicio: fechaInicio ?? new Date(),
        fecha_de_finalizacion: fechaFin ?? undefined,
        organizadores,
        portada: portada ?? undefined,
        galeria,
        publico,
      });

      setStatus(`Evento creado con éxito: ${created.id}`);
      // Reset form
      setTitulo("");
      setEslogan("");
      setContenido("");
      setFechaInicio(null);
      setFechaFin(null);
      setOrganizadores("");
      setPortada(null);
      setGaleria([]);

      // Ir a la página principal de eventos del admin
      router.push("/admin/eventos");
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <main className="flex-1">
      <AdminHeader
        title="Panel Administrativo"
        subtitle="Eventos"
        backHref="/admin/eventos"
        backLabel="Eventos"
      />
      <form onSubmit={handleSubmit}>
        <article className="max-w-4xl mx-auto my-8 relative">
          {/* Botón de Guardar Fijo */}
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
            {status && (
              <Alert
                type={
                  status.includes("Error")
                    ? "error"
                    : status.includes("éxito") || status.includes("creado")
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
              aria-label="Guardar Evento"
            >
              <FaSave size={24} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3 mb-4">
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

          {/* Portada Editable */}
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
            {portadaUrl ? (
              <Image
                src={portadaUrl}
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
            {/* Título Editable */}
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Escribe el título del evento aquí..."
              className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-4 transition-colors"
            />

            {/* Eslogan Editable */}
            <textarea
              value={eslogan}
              onChange={(e) => setEslogan(e.target.value)}
              placeholder="Escribe un eslogan corto del evento (máx 120 caracteres)..."
              className="text-lg text-base-content/70 bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-6 transition-colors"
              rows={2}
              maxLength={120}
            />

            {/* Fechas y Organizadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-8">
              <div className="flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaCalendar /> Fecha de Inicio
                  </span>
                </label>
                <DatePicker
                  selected={fechaInicio}
                  onChange={(date: Date | null) => setFechaInicio(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="input input-bordered w-full bg-base-200"
                  placeholderText="Selecciona fecha y hora"
                />
              </div>
              <div className="flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaCalendar /> Fecha de Fin
                  </span>
                </label>
                <DatePicker
                  selected={fechaFin}
                  onChange={(date: Date | null) => setFechaFin(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  className="input input-bordered w-full bg-base-200"
                  placeholderText="Selecciona fecha y hora"
                />
              </div>
              <div className="md:col-span-2 flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaUsers /> Organizadores
                  </span>
                </label>
                <input
                  type="text"
                  value={organizadores}
                  onChange={(e) => setOrganizadores(e.target.value)}
                  placeholder="Ej: GAD Sal de Salinas, Comunidad..."
                  className="input input-bordered w-full bg-base-200"
                />
              </div>
            </div>

            {/* Contenido Editable */}
            <h2 className="text-2xl font-semibold mb-4">Contenido Principal</h2>
            <div className="bg-base-200 border border-base-300 rounded-lg">
              <div
                ref={editorContainerRef}
                className="prose max-w-none text-base-content/90 min-h-[320px]"
              />
            </div>

            {/* Galería Editable */}
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
                {/* Botón para añadir más imágenes */}
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
    </main>
  );
}
