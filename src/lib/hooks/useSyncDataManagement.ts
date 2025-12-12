import { useState, useCallback } from "react";
import {
  ContificoProducto,
  getContificoProductosPorSemana,
} from "@/lib/contifico";
import { Producto } from "@/lib/types/productivo";
import { getProductosAdmin } from "@/lib/admin-data-productivo";

export interface SyncComparison {
  unlinked: { contifico: ContificoProducto; match?: Producto }[];
  diff: { contifico: ContificoProducto; local: Producto }[];
  synced: { contifico: ContificoProducto; local: Producto }[];
}

interface UseSyncDataManagementProps {
  onError?: (message: string) => void;
}

/**
 * Custom hook to manage product synchronization data loading and comparison
 * Handles: loading from APIs, deduplication, comparison logic, state management
 */
export const useSyncDataManagement = ({
  onError,
}: UseSyncDataManagementProps = {}) => {
  const [allContificoProducts, setAllContificoProducts] = useState<
    ContificoProducto[]
  >([]);
  const [localProducts, setLocalProducts] = useState<Producto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreWeeks, setHasMoreWeeks] = useState(true);
  const [unlinkedItems, setUnlinkedItems] = useState<
    SyncComparison["unlinked"]
  >([]);
  const [diffItems, setDiffItems] = useState<SyncComparison["diff"]>([]);
  const [syncedItems, setSyncedItems] = useState<SyncComparison["synced"]>([]);

  /**
   * Compare Contífico products with local products
   * Identifies: linked products with differences, unlinked products, fully synced
   */
  const processComparison = useCallback(
    (cProds: ContificoProducto[], lProds: Producto[]) => {
      const unlinked: SyncComparison["unlinked"] = [];
      const diff: SyncComparison["diff"] = [];
      const synced: SyncComparison["synced"] = [];

      cProds.forEach((cProd) => {
        // 1. Check if already linked by Contífico ID
        const linkedLocal = lProds.find((p) => p.contifico_id === cProd.id);

        if (linkedLocal) {
          // Linked product - check if synced or has differences
          const contificoPrice = parseFloat(cProd.pvp1);
          const localPrice = linkedLocal.pvp1 || 0;
          const priceDiff = Math.abs(contificoPrice - localPrice);

          const hasDiff =
            priceDiff > 0.01 ||
            (linkedLocal.nombre || "").toLowerCase().trim() !==
              cProd.nombre.toLowerCase().trim();

          if (hasDiff) {
            diff.push({ contifico: cProd, local: linkedLocal });
          } else {
            synced.push({ contifico: cProd, local: linkedLocal });
          }
        } else {
          // Unlinked product - try to find potential match by name
          const possibleMatch = lProds.find(
            (p) =>
              !p.contifico_id &&
              (p.nombre || "").toLowerCase().trim() ===
                cProd.nombre.toLowerCase().trim()
          );
          unlinked.push({ contifico: cProd, match: possibleMatch });
        }
      });

      setUnlinkedItems(unlinked);
      setDiffItems(diff);
      setSyncedItems(synced);
    },
    []
  );

  /**
   * Load products for a specific date range
   */
  const loadProductsForDateRange = useCallback(
    async (startDate: string, endDate: string, lProds: Producto[]) => {
      setIsLoadingMore(true);
      try {
        const contificoResponse = await getContificoProductosPorSemana(
          startDate,
          endDate
        );

        setAllContificoProducts(contificoResponse.productos);
        processComparison(contificoResponse.productos, lProds);
        setHasMoreWeeks(true);
      } catch (error) {
        console.error("Error loading products for date range:", error);
        onError?.("Error cargando productos del rango de fechas");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [processComparison, onError]
  );

  /**
   * Initialize data - load local products and categories
   */
  const initializeData = useCallback(
    async (fechaInicial: string, fechaFinal: string) => {
      setIsLoading(true);
      try {
        const lProdsResult = await getProductosAdmin(1, 500);
        setLocalProducts(lProdsResult.items);
        await loadProductsForDateRange(
          fechaInicial,
          fechaFinal,
          lProdsResult.items
        );
      } catch (error) {
        console.error("Error initializing sync data:", error);
        onError?.("Error inicializando datos de sincronización");
      } finally {
        setIsLoading(false);
      }
    },
    [loadProductsForDateRange, onError]
  );

  /**
   * Load more weeks of data (pagination backwards)
   */
  const loadMoreWeeks = useCallback(
    async (newStartDate: string, oldStartDate: string) => {
      setIsLoadingMore(true);
      try {
        const contificoResponse = await getContificoProductosPorSemana(
          newStartDate,
          oldStartDate
        );

        if (contificoResponse.productos.length === 0) {
          setHasMoreWeeks(false);
          return;
        }

        // Deduplicate products
        const existingIds = new Set(allContificoProducts.map((p) => p.id));
        const newProducts = contificoResponse.productos.filter(
          (p) => !existingIds.has(p.id)
        );

        const updated = [...newProducts, ...allContificoProducts];
        setAllContificoProducts(updated);
        processComparison(updated, localProducts);
      } catch (error) {
        console.error("Error loading more weeks:", error);
        onError?.("Error cargando más semanas");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [allContificoProducts, localProducts, processComparison, onError]
  );

  /**
   * Utility to refresh product list after operations
   */
  const refreshData = useCallback(async () => {
    try {
      const updatedProds = await getProductosAdmin(1, 500);
      setLocalProducts(updatedProds.items);
      processComparison(allContificoProducts, updatedProds.items);
    } catch (error) {
      console.error("Error refreshing data:", error);
      onError?.("Error refrescando datos");
    }
  }, [allContificoProducts, processComparison, onError]);

  return {
    // State
    allContificoProducts,
    localProducts,
    isLoading,
    isLoadingMore,
    hasMoreWeeks,
    unlinkedItems,
    diffItems,
    syncedItems,

    // Setters
    setAllContificoProducts,
    setLocalProducts,
    setUnlinkedItems,
    setDiffItems,
    setSyncedItems,

    // Methods
    processComparison,
    loadProductsForDateRange,
    initializeData,
    loadMoreWeeks,
    refreshData,
  };
};
