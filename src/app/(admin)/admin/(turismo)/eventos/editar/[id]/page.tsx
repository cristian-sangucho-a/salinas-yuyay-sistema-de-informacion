"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaImage, FaSave, FaPlus, FaCalendar, FaUsers } from "react-icons/fa";
import AdminHeader from "@components/molecules/AdminHeader";
import Alert from "@components/molecules/Alert";
import { obtenerEventoById, generarUrlImagen,  } from "@/lib/data/turismo/eventos";
import { updateEvento } from "@/lib/data/turismo/eventos";

export default function EditarEventoPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [titulo, setTitulo] = useState("");
  const [resumen, setResumen] = useState("");
  const [contenido, setContenido] = useState("");
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [organizadores, setOrganizadores] = useState("");
  const [portada, setPortada] = useState<File | null>(null);
  const [galeria, setGaleria] = useState<File[]>([]);
  const [publico, setPublico] = useState<boolean | undefined>(undefined);
  const [existingPortadaUrl, setExistingPortadaUrl] = useState<string | null>(null);
  const [existingGaleriaUrls, setExistingGaleriaUrls] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const portadaInputRef = useRef<HTMLInputElement>(null);
  const galeriaInputRef = useRef<HTMLInputElement>(null);

  const portadaUrl = useMemo(() => (portada ? URL.createObjectURL(portada) : null), [portada]);
  const galeriaUrls = useMemo(() => galeria.map((f) => URL.createObjectURL(f)), [galeria]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setStatus("Cargando evento...");
      try {
        const ev = await obtenerEventoById(id);
        if (!ev) {
          setStatus("Evento no encontrado");
          return;
        }

        setTitulo(String(ev.titulo ?? ""));
        setResumen(String(ev.resumen ?? ""));
        setContenido(String(ev.contenido ?? ""));
        setFechaInicio(ev.fecha_de_inicio ? new Date(String(ev.fecha_de_inicio)) : null);
        setFechaFin(ev.fecha_de_finalizacion ? new Date(String(ev.fecha_de_finalizacion)) : null);
        setOrganizadores(String(ev.organizadores ?? ""));
  setPublico(ev.publico === undefined ? undefined : Boolean(ev.publico));

        const portadaUrl = generarUrlImagen(ev.collectionId, ev.id, ev.portada);
        if (portadaUrl) setExistingPortadaUrl(portadaUrl);

        const rawGaleria = ev.galeria ?? [];
        if (Array.isArray(rawGaleria)) {
          const urls = (rawGaleria as unknown[]).map((filename) => {
            const tempRecord = { ...ev, galeria: filename };
            return generarUrlImagen(tempRecord.collectionId, tempRecord.id, tempRecord.galeria as string);
          }).filter((url): url is string => url !== null);
          setExistingGaleriaUrls(urls);
        }

        setStatus(null);
      } catch (err) {
        console.error(err);
        setStatus("Error cargando evento");
      }
    })();
  }, [id]);

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
    if (!id) return setStatus("ID de evento no especificado");
    if (!titulo || !contenido || !resumen || !fechaInicio || !fechaFin || !organizadores) {
      setStatus("Error: Todos los campos son obligatorios.");
      return;
    }
    setStatus("Enviando...");

    try {
      // Use centralized admin helper to update the evento
      const updated = await updateEvento(id, {
        titulo,
        resumen,
        contenido,
        fecha_de_inicio: fechaInicio,
        fecha_de_finalizacion: fechaFin,
        organizadores,
        portada: portada ?? undefined,
        nuevosGaleria: galeria.length > 0 ? galeria : undefined,
        publico: publico === undefined ? undefined : Boolean(publico),
      });

      setStatus(`Evento actualizado: ${updated?.id ?? id}`);
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <main className="flex-1">
      <AdminHeader title="Editar Evento" subtitle="Eventos" backHref="/admin/eventos" backLabel="Eventos" />
      <form onSubmit={handleSubmit}>
        <article className="max-w-4xl mx-auto my-8 relative">
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4">
            {status && (
              <Alert 
                type={status.includes("Error") || status.includes("no encontrado") ? "error" : status.includes("actualizado") ? "success" : "info"}
                className="shadow-lg max-w-md"
              >
                {status}
              </Alert>
            )}
            <button type="submit" className="btn btn-primary btn-lg btn-circle shadow-lg" aria-label="Guardar Evento">
              <FaSave size={24} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-3 mb-4">
                  <input
                    id="publico"
                    type="checkbox"
                    checked={!!publico}
                    onChange={(e) => setPublico(e.target.checked)}
                    className="checkbox checkbox-primary"
                  />
                  <label htmlFor="publico" className="text-sm">Evento público</label>
                </div>

          <input type="file" accept="image/*" ref={portadaInputRef} onChange={handlePortadaChange} className="hidden" />
          <div
            className="w-full h-72 md:h-96 overflow-hidden rounded-b-md relative bg-base-200 flex items-center justify-center cursor-pointer group"
            onClick={() => portadaInputRef.current?.click()}
          >
            {portadaUrl || existingPortadaUrl ? (
              <img src={portadaUrl ?? existingPortadaUrl ?? "/placeholder.png"} alt="Portada" className="w-full h-full object-cover" />
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
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Escribe el título del evento aquí..."
              className="text-3xl md:text-4xl font-bold bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-4 transition-colors"
            />

            <textarea
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Escribe un resumen corto del evento (máx 120 caracteres)..."
              className="text-lg text-base-content/70 bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full mb-6 transition-colors"
              rows={2}
              maxLength={120}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-8">
              <div className="flex flex-col">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2"><FaCalendar/> Fecha de Inicio</span>
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
                  <span className="label-text font-semibold flex items-center gap-2"><FaCalendar/> Fecha de Fin</span>
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
                  <span className="label-text font-semibold flex items-center gap-2"><FaUsers/> Organizadores</span>
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

            <h2 className="text-2xl font-semibold mb-4">Contenido Principal</h2>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe el contenido del evento aquí. Puedes usar saltos de línea."
              className="prose max-w-none text-base-content/90 mt-4 bg-transparent border-b-2 border-transparent focus:border-primary outline-none w-full transition-colors"
              rows={10}
            />

            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-6">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {existingGaleriaUrls.map((url, i) => (
                  <div key={`existing-${i}`} className="h-44 overflow-hidden rounded shadow-sm">
                    <img src={url} alt={`Imagen de galería existente ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {galeriaUrls.map((url, i) => (
                  <div key={`new-${i}`} className="h-44 overflow-hidden rounded shadow-sm">
                    <img src={url} alt={`Imagen de galería ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <input type="file" accept="image/*" multiple ref={galeriaInputRef} onChange={handleGaleriaChange} className="hidden" />
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
          <p className="text-sm text-center text-[#4A3B31]/60">Creado por Hakan Team</p>
        </div>
      </footer>
    </main>
  );
}
