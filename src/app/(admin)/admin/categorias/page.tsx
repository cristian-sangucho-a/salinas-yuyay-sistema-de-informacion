"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaPlus,
  FaArrowLeft,
  FaFolder,
  FaFile,
  FaEnvelope,
} from "react-icons/fa";
import { logout, getAuthUser, isAuthenticated } from "@/lib/auth";
import { getCategorias } from "@/lib/data";
import type { Categoria } from "@/lib/types";
import CategoriasGrid from "@cultural/admin/CategoriasGrid";
import CategoriaModal from "@cultural/admin/CategoriaModal";
import CulturalNavTabs from "@cultural/admin/CulturalNavTabs";
import AdminHeader from "@components/molecules/AdminHeader";
export default function CategoriasAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setUser(getAuthUser());
    loadCategorias();
  }, [router]);

  const loadCategorias = async () => {
    try {
      setIsLoading(true);
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleCreate = () => {
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setEditingCategoria(null);
    if (shouldRefresh) {
      loadCategorias();
    }
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-[#F8F3ED] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#5A1E02]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Header simple con botón Dashboard */}
      <AdminHeader title="Panel Administrativo" subtitle="Archivo Histórico de Salinas" />
      <CulturalNavTabs />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#5A1E02]">
              Gestión de Categorías
            </h2>
            <p className="text-sm text-[#4A3B31]/70 mt-1">
              Administra las categorías del archivo histórico
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="btn bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2"
          >
            <FaPlus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-[#5A1E02]"></span>
          </div>
        ) : (
          <CategoriasGrid
            categorias={categorias}
            onEdit={handleEdit}
            onDelete={loadCategorias}
          />
        )}
      </main>

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        categoria={editingCategoria}
      />

      <footer className="fixed bottom-4 right-4">
        <p className="text-xs text-[#4A3B31]/50 italic">
          Desarrollado por Hakan Team
        </p>
      </footer>
    </div>
  );
}
