"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { isAuthenticated } from "@/lib/auth";
import { deleteRecord } from "@/lib/admin-data";
import ConfirmDialog from "@cultural/admin/ConfirmDialog";
import { getSalasMuseo, getFileUrl } from "@/lib/data";
import type { SalaMuseo, Evento } from "@/lib/types";
import AdminHeader from "@components/molecules/AdminHeader";
import TurismoNavTabs from "@cultural/admin/TurismoNavTabs";

export default function AdminTurismoPage() {
  const router = useRouter();
  const [salasCount, setSalasCount] = useState<number | null>(null);
  const [salas, setSalas] = useState<
    Array<{ id: string; title: string; description?: string; image?: string }>
  >([]);
  const [loadingSalas, setLoadingSalas] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<null | { id: string; title?: string }>(null);

  const handleCreate = () => {
    redirect("/admin/salas_museo/crear");
  };

  useEffect(() => {
    // Auth guard (client-side)
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Fetch counts using data helper
    (async () => {
      try {
        const salasList = await getSalasMuseo();
        setSalasCount(Array.isArray(salasList) ? salasList.length : 0);
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    })();
  }, [router]);

  // Fetch salas del museo to show preview similar to the public visita page
  useEffect(() => {
    (async () => {
      try {
        const items = await getSalasMuseo();
        const mapped = items.map((it: SalaMuseo) => ({
          id: it.id,
          title: it.titulo,
          description: it.resumen,
          image: getFileUrl(it as any, "portada") ?? undefined,
        }));
        setSalas(mapped);
      } catch (err) {
        console.error("Error fetching salas:", err);
      } finally {
        setLoadingSalas(false);
      }
    })();
  }, []);

  // no events list in this page — only salas

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
            <h2 className="text-2xl font-bold text-[#5A1E02]">Gestión de Salas del Museo</h2>
            <p className="text-sm text-[#4A3B31]/70 mt-1">Administra las salas del museo</p>
          </div>

          <button
            onClick={handleCreate}
            className="btn bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Nueva Sala
          </button>
        </div>

        <div className="mt-6">
          {loadingSalas ? (
            <p className="text-base-content/70">Cargando salas...</p>
          ) : salas.length > 0 ? (
            <ul className="space-y-3">
              {salas.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-4 p-2 bg-white border border-[#E9E1D6] rounded-lg"
                >
                  <Link
                    href={`/turismo/museo/${s.id}`}
                    className="flex items-center gap-4 w-full"
                  >
                    <img
                      src={s.image ?? "/placeholder.png"}
                      alt={s.title}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#5A1E02]">
                        {s.title}
                      </h3>
                      {s.description && (
                        <div className="text-sm text-[#4A3B31]/70">
                          {String(s.description)}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/salas_museo/editar/${s.id}`}
                      className="btn btn-sm btn-outline border-[#D9C3A3] text-[#5A1E02] hover:bg-[#F8F3ED] hover:border-[#7C8B56] gap-1"
                    >
                      <FaEdit className="w-3 h-3" />
                      <span className="ml-1">Editar</span>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline border-[#D9C3A3] text-[#B63A1B] hover:bg-red-50 hover:border-[#B63A1B] gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmDelete({ id: s.id, title: s.title });
                      }}
                      disabled={deletingId === s.id}
                    >
                      {deletingId === s.id ? (
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
              No hay salas disponibles por el momento.
            </p>
          )}
        </div>
        {/* Confirm dialog for deleting salas */}
        <ConfirmDialog
          isOpen={!!confirmDelete}
          title={confirmDelete ? `Eliminar sala "${confirmDelete.title ?? ''}"` : 'Eliminar sala'}
          message="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta sala del museo?"
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
          onCancel={() => setConfirmDelete(null)}
          onConfirm={async () => {
            if (!confirmDelete) return;
            const id = confirmDelete.id;
            try {
              setDeletingId(id);
              const ok = await deleteRecord("sala_museo", id);
              if (!ok) throw new Error("No se pudo eliminar la sala");
              setSalas((prev) => prev.filter((x) => x.id !== id));
              setSalasCount((c) => (typeof c === "number" ? Math.max(0, c - 1) : c));
              setConfirmDelete(null);
            } catch (err) {
              console.error("Error deleting sala:", err);
              alert("No se pudo eliminar la sala. Revisa la consola para más detalles.");
            } finally {
              setDeletingId(null);
            }
          }}
        />
      </main>
    </div>
  );
}
