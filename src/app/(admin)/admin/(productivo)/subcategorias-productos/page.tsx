"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { getAuthUser, isAuthenticated } from "@/lib/auth";
import type {
  SubcategoriaProducto,
  CategoriaProducto,
} from "@/lib/types/productivo";
import ProductivoNavTabs from "@components/productivo/admin/ProductivoNavTabs";
import SubcategoriasTable from "@components/productivo/admin/SubcategoriasTable";
import SubcategoriaModal from "@components/productivo/admin/SubcategoriaModal";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";
import { getSubcategoriasAdmin } from "@/lib/admin-data-productivo";
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";

export default function SubcategoriasProductosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [subcategorias, setSubcategorias] = useState<SubcategoriaProducto[]>(
    []
  );
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubcategoria, setEditingSubcategoria] =
    useState<SubcategoriaProducto | null>(null);

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
      const [subsData, catsData] = await Promise.all([
        getSubcategoriasAdmin(),
        getCategoriasProductos(),
      ]);
      setSubcategorias(subsData.items);
      setCategorias(catsData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSubcategoria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subcategoria: SubcategoriaProducto) => {
    setEditingSubcategoria(subcategoria);
    setIsModalOpen(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setEditingSubcategoria(null);
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
              Gestión de Subcategorías
            </Title>
            <Text variant="small" color="muted" className="mt-1">
              Administra las subcategorías de productos de la tienda
            </Text>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreate}
              variant="primary"
              className="text-white gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Nueva Subcategoría
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <SubcategoriasTable
            subcategorias={subcategorias}
            onEdit={handleEdit}
            onDelete={() => loadData()}
          />
        )}
      </main>

      <SubcategoriaModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        subcategoria={editingSubcategoria}
        categorias={categorias}
      />
    </div>
  );
}
