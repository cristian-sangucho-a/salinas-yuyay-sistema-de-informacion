"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { isAuthenticated } from "@/lib/auth";
import { deleteRecord } from "@/lib/admin-data";
import ConfirmDialog from "@cultural/admin/ConfirmDialog";
import {
  obtenerEventos,
  generarUrlImagen
} from "@/lib/data/turismo/eventos";

import {
  obtenerSalasMuseo
  
} from "@/lib/data/turismo/salas-museo";
import type { Evento } from "@/lib/types/turismo";
import AdminHeader from "@components/molecules/AdminHeader";
import TurismoNavTabs from "@cultural/admin/TurismoNavTabs";

export default function AdminTurismoPage() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<null | { id: string; title?: string }>(null);
  const [events, setEvents] = useState<
    Array<{ id: string; title: string; date?: string; image?: string }>
  >([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const handleCreate = () => {
    redirect("/admin/eventos/crear");
  };

  useEffect(() => {
    // Auth guard (client-side)
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Fetch counts in parallel using data helpers
    (async () => {
      try {
        await Promise.all([
          obtenerEventos(),
          obtenerSalasMuseo(),
        ]);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    })();
  }, [router]);

  // Fetch events for admin preview (compact list)
  useEffect(() => {
    (async () => {
      try {
  const items = await obtenerEventos();
        const mapped = items.map((it: Evento) => ({
          id: it.id,
          title: it.titulo ?? it.titulo ?? "Evento",
          date: it.fecha_de_inicio ?? it["fecha_de_inicio"] ?? undefined,
          image: generarUrlImagen(it.collectionId,it.id, it.portada) ?? undefined,
        }));
        setEvents(mapped);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      <AdminHeader
        title="Panel Administrativo"
        subtitle="Archivo Histórico de Salinas"
      />
      <TurismoNavTabs />

      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#5A1E02]">Gestión de Eventos</h2>
            <p className="text-sm text-[#4A3B31]/70 mt-1">Administra los eventos turísticos</p>
          </div>

          <button
            onClick={handleCreate}
            className="btn bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Nuevo Evento
          </button>
        </div>
        <div className="mt-6">
          {loadingEvents ? (
            <p className="text-base-content/70">Cargando eventos...</p>
          ) : events.length > 0 ? (
            <ul className="space-y-3">
              {events.map((ev) => (
                <li
                  key={ev.id}
                  className="flex items-center gap-4 p-2 bg-white border border-[#E9E1D6] rounded-lg"
                >
                  <Link
                    href={`/turismo/evento/${ev.id}`}
                    className="flex items-center gap-4 w-full"
                  >
                    <div className="w-20 h-20 relative shrink-0">
                      <Image
                        src={ev.image ?? "/placeholder.png"}
                        alt={ev.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#5A1E02]">
                        {ev.title}
                      </h3>
                      {ev.date && (
                        <div className="text-sm text-[#4A3B31]/70">
                          {String(ev.date)}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/eventos/editar/${ev.id}`}
                      className="btn btn-sm btn-outline border-[#D9C3A3] text-[#5A1E02] hover:bg-[#F8F3ED] hover:border-[#7C8B56] gap-1"
                    >
                      <FaEdit className="w-3 h-3" />
                      <span className="ml-1">Editar</span>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline border-[#D9C3A3] text-[#B63A1B] hover:bg-red-50 hover:border-[#B63A1B] gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmDelete({ id: ev.id, title: ev.title });
                      }}
                      disabled={deletingId === ev.id}
                    >
                      {deletingId === ev.id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <FaTrash className="w-3 h-3" />
                      )}
                      <span className="ml-1">Eliminar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-base-content/60">
              No hay eventos disponibles por el momento.
            </p>
          )}
        </div>
        {/* Confirm dialog for deleting events */}
        <ConfirmDialog
          isOpen={!!confirmDelete}
          title={confirmDelete ? `Eliminar evento "${confirmDelete.title ?? ''}"` : 'Eliminar evento'}
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este evento?"
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            if (!confirmDelete) return;
            const id = confirmDelete.id;
            try {
              setDeletingId(id);
              const ok = await deleteRecord("evento", id);
              if (!ok) throw new Error("No se pudo eliminar el evento");
              setEvents((prev) => prev.filter((x) => x.id !== id));
              setConfirmDelete(null);
            } catch (err) {
              console.error("Error deleting evento:", err);
              alert("No se pudo eliminar el evento. Revisa la consola para más detalles.");
            } finally {
              setDeletingId(null);
            }
          }}
        />
      </main>
    </div>
  );
}
