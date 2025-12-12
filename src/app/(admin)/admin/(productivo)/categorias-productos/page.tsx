"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { getAuthUser, isAuthenticated } from "@/lib/auth";
import type { CategoriaProducto } from "@/lib/types/productivo";
import ProductivoNavTabs from "@components/productivo/admin/ProductivoNavTabs";
import CategoriasTable from "@components/productivo/admin/CategoriasTable";
import CategoriaModal from "@components/productivo/admin/CategoriaModal";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";

export default function CategoriasProductosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] =
    useState<CategoriaProducto | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setUser(getAuthUser());
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await getCategoriasProductos();
      setCategorias(data);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategoria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (categoria: CategoriaProducto) => {
    setEditingCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setEditingCategoria(null);
    if (shouldRefresh) {
      loadData();
    }
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-white border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <Text variant="body" className="font-medium" as="span">
                  Dashboard
                </Text>
              </Link>
              <div className="border-l border-base-300 h-6"></div>
              <div>
                <Text variant="button" className="text-primary">
                  Panel Administrativo
                </Text>
                <Text variant="caption" color="muted">
                  Gestión Productiva
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductivoNavTabs />

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <Title variant="h3" className="text-primary font-bold">
              Gestión de Categorías
            </Title>
            <Text variant="small" color="muted" className="mt-1">
              Administra las categorías de productos de la tienda
            </Text>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              variant="primary"
              className="text-white gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Nueva Categoría
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <CategoriasTable
            categorias={categorias}
            onEdit={handleEdit}
            onDelete={() => loadData()}
          />
        )}
      </main>

      <CategoriaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        categoria={editingCategoria}
      />
    </div>
  );
}
