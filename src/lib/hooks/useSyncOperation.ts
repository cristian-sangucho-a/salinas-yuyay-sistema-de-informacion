import { useCallback } from "react";
import { ContificoProducto } from "@/lib/contifico";
import { Producto } from "@/lib/types/productivo";
import { getProductosAdmin } from "@/lib/admin-data-productivo";

interface UseSyncOperationProps {
  confirmModal: {
    open: (
      title: string,
      message: string,
      onConfirm: () => Promise<void>,
      buttonLabel?: string,
      cancelText?: string
    ) => void;
    close: () => void;
  };
  successModal: {
    open: (title: string, message: string) => void;
  };
  errorModal: {
    open: (title: string, message: string) => void;
  };
  setIsSyncing: (value: boolean) => void;
  onRefreshNeeded?: () => Promise<void>;
}

interface SyncOperationParams {
  title: string;
  message: string;
  buttonLabel: string;
  onExecute: () => Promise<void>;
  onSuccess: {
    title: string;
    message: string;
  };
  onRefresh?: () => void;
}

/**
 * Custom hook to handle synchronization operations with consistent modal flow
 * Reduces code duplication across handleLink, handleImport, handleSyncUpdate
 */
export const useSyncOperation = ({
  confirmModal,
  successModal,
  errorModal,
  setIsSyncing,
  onRefreshNeeded,
}: UseSyncOperationProps) => {
  return useCallback(
    async (params: SyncOperationParams) => {
      const { title, message, buttonLabel, onExecute, onSuccess, onRefresh } =
        params;

      confirmModal.open(
        title,
        message,
        async () => {
          confirmModal.close();
          setIsSyncing(true);
          try {
            // Execute the main operation
            await onExecute();

            // Show success modal
            successModal.open(onSuccess.title, onSuccess.message);

            // Custom refresh logic if provided
            if (onRefresh) {
              onRefresh();
            }

            // Call the general refresh function if provided
            if (onRefreshNeeded) {
              await onRefreshNeeded();
            }
          } catch (error) {
            console.error(`Error in ${title}:`, error);
            errorModal.open(
              `Error al ${title}`,
              error instanceof Error ? error.message : "Error desconocido"
            );
          } finally {
            setIsSyncing(false);
          }
        },
        buttonLabel
      );
    },
    [confirmModal, successModal, errorModal, setIsSyncing, onRefreshNeeded]
  );
};

/**
 * Utility function to refresh product list and reprocess comparison
 * Reduces duplication in list refresh logic
 */
export const refreshProductList = async (
  allContificoProducts: ContificoProducto[],
  setLocalProducts: (products: Producto[]) => void,
  processComparison: (contifico: ContificoProducto[], local: Producto[]) => void
) => {
  const updatedLocalProds = await getProductosAdmin(1, 500);
  setLocalProducts(updatedLocalProds.items);
  processComparison(allContificoProducts, updatedLocalProds.items);
};
