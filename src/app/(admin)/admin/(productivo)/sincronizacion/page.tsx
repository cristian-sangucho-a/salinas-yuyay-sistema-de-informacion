"use client";

import React, { useState, useEffect } from "react";
import {
  FaSync,
  FaChevronDown,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { ContificoProducto } from "@/lib/contifico";
import { updateProducto, createProducto } from "@/lib/admin-data-productivo";
import { Producto, CategoriaProducto } from "@/lib/types/productivo";
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";
import ConfirmationModal from "@components/molecules/ConfirmationModal";
import AdminHeader from "@components/molecules/AdminHeader";
import SyncStatsSection from "@components/productivo/admin/SyncStatsSection";
import SyncDateFilter from "@components/productivo/admin/SyncDateFilter";
import { useSimpleModal, useConfirmModal } from "@/lib/hooks/useModalState";
import {
  useSyncOperation,
  refreshProductList,
} from "@/lib/hooks/useSyncOperation";
import { useSyncDataManagement } from "@/lib/hooks/useSyncDataManagement";
import {
  initializeDateRange,
  validateDateRange,
  getPreviousWeekDateRange,
} from "@/lib/utils/dateUtils";

type SyncStatus = "unlinked" | "diff" | "synced";

export default function SincronizacionPage() {
  const [activeTab, setActiveTab] = useState<SyncStatus>("unlinked");
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize date range
  const { fechaInicial: initialFechaInicial, fechaFinal: initialFechaFinal } =
    initializeDateRange();
  const [fechaInicial, setFechaInicial] = useState(initialFechaInicial);
  const [fechaFinal, setFechaFinal] = useState(initialFechaFinal);

  // Use sync data management hook
  const syncData = useSyncDataManagement({
    onError: (message: string) => errorModal.open("Error", message),
  });

  // Modal states using custom hooks
  const confirmModal = useConfirmModal();
  const successModal = useSimpleModal();
  const errorModal = useSimpleModal();

  // Sync operation hook
  const executeSyncOperation = useSyncOperation({
    confirmModal,
    successModal,
    errorModal,
    setIsSyncing,
    onRefreshNeeded: () =>
      refreshProductList(
        syncData.allContificoProducts,
        syncData.setLocalProducts,
        syncData.processComparison
      ),
  });

  useEffect(() => {
    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeData = async () => {
    const [cats] = await Promise.all([getCategoriasProductos()]);
    setCategorias(cats);
    await syncData.initializeData(fechaInicial, fechaFinal);
  };

  const handleLink = async (cProd: ContificoProducto, localId: string) => {
    await executeSyncOperation({
      title: "Vincular Producto",
      message: `¿Vincular "${cProd.nombre}" con el producto local?`,
      buttonLabel: "Vincular",
      onExecute: async () => {
        await updateProducto(localId, {
          contifico_id: cProd.id,
        });
      },
      onSuccess: {
        title: "¡Vinculación Exitosa!",
        message: "Producto vinculado correctamente",
      },
      onRefresh: () => {
        syncData.setUnlinkedItems((prev) =>
          prev.filter((item) => item.contifico.id !== cProd.id)
        );
      },
    });
  };

  const handleImport = async (cProd: ContificoProducto) => {
    if (categorias.length === 0) {
      errorModal.open(
        "Error: Sin categorías",
        "No hay categorías disponibles. Crea una categoría primero."
      );
      return;
    }

    await executeSyncOperation({
      title: "Importar Producto",
      message: `¿Importar "${cProd.nombre}" como nuevo producto?`,
      buttonLabel: "Importar",
      onExecute: async () => {
        await createProducto({
          nombre: cProd.nombre,
          descripcion: cProd.descripcion || "",
          pvp1: parseFloat(cProd.pvp1),
          estado: cProd.estado,
          categoria: categorias[0]?.id,
          destacado: false,
          contifico_id: cProd.id,
        });
      },
      onSuccess: {
        title: "¡Importación Exitosa!",
        message: `Producto importado como: ${cProd.nombre}`,
      },
      onRefresh: () => {
        syncData.setUnlinkedItems((prev) =>
          prev.filter((item) => item.contifico.id !== cProd.id)
        );
      },
    });
  };

  const handleSyncUpdate = async (
    cProd: ContificoProducto,
    localProd: Producto
  ) => {
    await executeSyncOperation({
      title: "Actualizar Producto",
      message: `¿Actualizar "${
        localProd.nombre
      }" con los datos de Contífico?\n\nPrecio anterior: $${(
        localProd.pvp1 || 0
      ).toFixed(2)}\nPrecio nuevo: $${parseFloat(cProd.pvp1).toFixed(2)}`,
      buttonLabel: "Actualizar",
      onExecute: async () => {
        await updateProducto(localProd.id, {
          nombre: cProd.nombre,
          pvp1: parseFloat(cProd.pvp1),
          estado: cProd.estado,
        });
      },
      onSuccess: {
        title: "¡Actualización Exitosa!",
        message: "Producto actualizado correctamente",
      },
      onRefresh: () => {
        syncData.setDiffItems((prev) =>
          prev.filter((item) => item.contifico.id !== cProd.id)
        );
      },
    });
  };

  const handleLoadMoreWeeks = async () => {
    const { newStart, oldStart } = getPreviousWeekDateRange(fechaInicial);
    setFechaInicial(newStart);
    await syncData.loadMoreWeeks(newStart, oldStart);
  };

  const handleDateRangeChange = async () => {
    // Validate dates
    const errorMsg = validateDateRange(fechaInicial, fechaFinal);
    if (errorMsg) {
      errorModal.open("Fechas inválidas", errorMsg);
      return;
    }

    await syncData.loadProductsForDateRange(
      fechaInicial,
      fechaFinal,
      syncData.localProducts
    );
  };

  return (
    <div>
      <AdminHeader
        title="Sincronización con contífico"
        subtitle="Gestión de integración de productos"
        backHref="/admin/productos"
        backLabel="Productos"
      />
      <main className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-8">
        {/* Stats Cards */}
        <SyncStatsSection
          unlinkedCount={syncData.unlinkedItems.length}
          diffCount={syncData.diffItems.length}
          syncedCount={syncData.syncedItems.length}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Date Filter Section */}
        <SyncDateFilter
          fechaInicial={fechaInicial}
          fechaFinal={fechaFinal}
          onFechaInicialChange={setFechaInicial}
          onFechaFinalChange={setFechaFinal}
          onFilter={handleDateRangeChange}
          isLoading={syncData.isLoadingMore}
        />

        {/* Main Content Area */}
        <div className="bg-white rounded-xl border border-base-300 shadow-sm min-h-[500px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            <h2 className="font-bold text-lg text-primary">
              {activeTab === "unlinked" &&
                "Productos Pendientes de Vinculación"}
              {activeTab === "diff" && "Conflictos de Datos Detectados"}
              {activeTab === "synced" &&
                "Productos Sincronizados Correctamente"}
            </h2>
            <div className="join">
              <button
                className="btn btn-sm btn-ghost join-item"
                onClick={() => initializeData()}
                disabled={syncData.isLoading}
              >
                <FaSync className={syncData.isLoading ? "animate-spin" : ""} />{" "}
                Actualizar
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-0">
            {syncData.isLoading ? (
              <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead className="bg-base-100">
                    <tr>
                      <th className="w-1/2 pl-6">Contífico (Origen)</th>
                      <th className="w-10"></th>
                      <th className="w-1/2 pr-6">PocketBase (Destino)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTab === "unlinked" &&
                      syncData.unlinkedItems.map((item) => (
                        <tr
                          key={item.contifico.id}
                          className="hover:bg-base-50 border-b border-base-100"
                        >
                          <td className="pl-6 align-top py-4">
                            <div className="font-bold text-primary">
                              {item.contifico.nombre}
                            </div>
                            <div className="text-xs text-base-content/60 mt-1">
                              SKU: {item.contifico.codigo}
                            </div>
                            <div className="text-sm font-mono mt-1">
                              ${item.contifico.pvp1}
                            </div>
                          </td>
                          <td className="align-middle text-center">
                            <FaArrowRight className="text-base-300" />
                          </td>
                          <td className="pr-6 align-top py-4">
                            {item.match ? (
                              <div className="space-y-2">
                                <div className="bg-warning/5 p-3 rounded-lg border border-warning/20">
                                  <div className="text-xs font-bold text-warning mb-2">
                                    ✓ POSIBLE COINCIDENCIA
                                  </div>
                                  <div className="font-medium text-sm mb-3">
                                    {item.match.nombre}
                                  </div>
                                  <button
                                    className="btn btn-xs btn-warning w-full"
                                    onClick={() =>
                                      handleLink(item.contifico, item.match!.id)
                                    }
                                    disabled={isSyncing}
                                  >
                                    Vincular a Este
                                  </button>
                                </div>
                                <div className="divider my-2 text-xs text-base-content/40">
                                  O
                                </div>
                                <button
                                  className="btn btn-xs btn-outline btn-primary w-full"
                                  onClick={() => handleImport(item.contifico)}
                                  disabled={isSyncing}
                                >
                                  Importar como Nuevo
                                </button>
                              </div>
                            ) : (
                              <div className="text-center space-y-2">
                                <p className="text-xs text-base-content/60 mb-3">
                                  No se encontró coincidencia
                                </p>
                                <button
                                  className="btn btn-sm btn-primary w-full"
                                  onClick={() => handleImport(item.contifico)}
                                  disabled={isSyncing}
                                >
                                  Importar como Nuevo
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                    {activeTab === "diff" &&
                      syncData.diffItems.map((item) => {
                        const contificoPrice = parseFloat(item.contifico.pvp1);
                        const localPrice = item.local.pvp1 || 0;
                        const priceDiff = Math.abs(contificoPrice - localPrice);
                        const nameDiff =
                          (item.local.nombre || "").toLowerCase().trim() !==
                          item.contifico.nombre.toLowerCase().trim();

                        return (
                          <tr
                            key={item.contifico.id}
                            className="hover:bg-base-50 border-b border-base-100"
                          >
                            <td className="pl-6 align-top py-4">
                              <div className="font-bold text-primary">
                                {item.contifico.nombre}
                              </div>
                              {nameDiff && (
                                <div className="text-xs text-warning mt-1">
                                  (nombre diferente)
                                </div>
                              )}
                              <div className="text-sm font-mono mt-2 text-error font-bold">
                                ${contificoPrice.toFixed(2)}
                              </div>
                              {priceDiff > 0.01 && (
                                <div className="text-xs text-error mt-1">
                                  Diferencia: ${priceDiff.toFixed(2)}
                                </div>
                              )}
                            </td>
                            <td className="align-middle text-center">
                              <div className="flex flex-col gap-2">
                                <button
                                  className="btn btn-circle btn-sm btn-error text-white"
                                  title="Actualizar con datos de Contífico"
                                  onClick={() =>
                                    handleSyncUpdate(item.contifico, item.local)
                                  }
                                  disabled={isSyncing}
                                >
                                  <FaSync />
                                </button>
                              </div>
                            </td>
                            <td className="pr-6 align-top py-4">
                              <div className="font-bold text-base-content/70">
                                {item.local.nombre}
                              </div>
                              {nameDiff && (
                                <div className="text-xs text-warning mt-1">
                                  (diferente)
                                </div>
                              )}
                              <div className="text-sm font-mono mt-2 text-base-content/70 font-bold">
                                ${localPrice.toFixed(2)}
                              </div>
                              {priceDiff > 0.01 && (
                                <div className="text-xs text-base-content/50 mt-1">
                                  Actualizar: ${contificoPrice.toFixed(2)}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                    {activeTab === "synced" &&
                      syncData.syncedItems.map((item) => (
                        <tr
                          key={item.contifico.id}
                          className="hover:bg-base-50 border-b border-base-100 bg-success/5"
                        >
                          <td className="pl-6 align-top py-4">
                            <div className="font-medium text-base-content/70">
                              {item.contifico.nombre}
                            </div>
                            <div className="text-xs text-base-content/50">
                              ${item.contifico.pvp1}
                            </div>
                          </td>
                          <td className="align-middle text-center">
                            <div className="flex items-center justify-center">
                              <FaCheckCircle className="text-success text-lg" />
                            </div>
                          </td>
                          <td className="pr-6 align-top py-4">
                            <div className="font-medium text-base-content/70">
                              {item.local.nombre}
                            </div>
                            <div className="text-xs text-base-content/50">
                              ${(item.local.pvp1 || 0).toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}

                    {/* Empty States */}
                    {activeTab === "unlinked" &&
                      syncData.unlinkedItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-12 text-base-content/50"
                          >
                            ¡Todo vinculado! No hay productos pendientes.
                          </td>
                        </tr>
                      )}
                    {activeTab === "diff" &&
                      syncData.diffItems.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-12 text-base-content/50"
                          >
                            ¡Todo sincronizado! No hay diferencias detectadas.
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Load More Weeks */}
          <div className="p-4 border-t border-base-300 flex items-center justify-between">
            <div className="text-sm text-base-content/70">
              Mostrando {syncData.allContificoProducts.length} producto(s) desde{" "}
              {fechaInicial} hasta {fechaFinal}
            </div>
            {syncData.hasMoreWeeks && (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleLoadMoreWeeks}
                disabled={syncData.isLoadingMore}
              >
                {syncData.isLoadingMore ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Cargando...
                  </>
                ) : (
                  <>
                    <FaChevronDown className="w-4 h-4" />
                    Agregar una semana más
                  </>
                )}
              </button>
            )}
            {!syncData.hasMoreWeeks &&
              syncData.allContificoProducts.length > 0 && (
                <div className="text-xs text-base-content/50 italic">
                  Se cargaron todos los productos disponibles para este período
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.modal.isOpen}
        type="confirm"
        title={confirmModal.modal.title}
        message={confirmModal.modal.message}
        confirmText={confirmModal.modal.confirmText}
        cancelText={confirmModal.modal.cancelText}
        onConfirm={confirmModal.modal.onConfirm}
        onCancel={() => confirmModal.close()}
      />

      {/* Success Modal */}
      <ConfirmationModal
        isOpen={successModal.modal.isOpen}
        type="success"
        title={successModal.modal.title}
        message={successModal.modal.message}
        confirmText="Entendido"
        onConfirm={successModal.close}
        onCancel={successModal.close}
      />

      {/* Error Modal */}
      <ConfirmationModal
        isOpen={errorModal.modal.isOpen}
        type="error"
        title={errorModal.modal.title}
        message={errorModal.modal.message}
        confirmText="Entendido"
        onConfirm={errorModal.close}
        onCancel={errorModal.close}
      />
    </div>
  );
}
