"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaArrowLeft, FaSync } from "react-icons/fa";
import { getAuthUser, isAuthenticated } from "@/lib/auth";
import type { Producto, CategoriaProducto } from "@/lib/types/productivo";
import ProductivoNavTabs from "@components/productivo/admin/ProductivoNavTabs";
import ProductsTable from "@components/productivo/admin/ProductsTable";
import ProductModal from "@components/productivo/admin/ProductModal";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";
import { getProductosAdmin } from "@/lib/admin-data-productivo";
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";
import { ListResult } from "pocketbase";

export default function ProductosAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [productosData, setProductosData] =
    useState<ListResult<Producto> | null>(null);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    setUser(getAuthUser());
    loadData();
  }, [router]);

  const loadData = async (page = 1) => {
    try {
      setIsLoading(true);
      const [prodData, catData] = await Promise.all([
        getProductosAdmin(page),
        getCategoriasProductos(),
      ]);
      setProductosData(prodData);
      setCategorias(catData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProducto(null);
    setIsModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  const handleModalClose = (shouldRefresh: boolean) => {
    setIsModalOpen(false);
    setEditingProducto(null);
    if (shouldRefresh) {
      loadData(productosData?.page || 1);
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
              Gestión de Productos
            </Title>
            <Text variant="small" color="muted" className="mt-1">
              Administra el catálogo de productos de la tienda
            </Text>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              className="btn-outline gap-2"
              onClick={() => router.push("/admin/sincronizacion")}
            >
              <FaSync className="w-4 h-4" />
              Sincronizar
            </Button>
            <Button
              onClick={handleCreate}
              variant="primary"
              className="text-white gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          <ProductsTable
            productos={productosData?.items || []}
            onEdit={handleEdit}
            onDelete={() => loadData(productosData?.page || 1)}
          />
        )}
      </main>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        producto={editingProducto}
        categorias={categorias}
      />
    </div>
  );
}
