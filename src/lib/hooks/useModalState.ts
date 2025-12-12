import { useState, useCallback } from "react";

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
}

export interface ConfirmModalState extends ModalState {
  confirmText: string;
  cancelText: string;
  onConfirm: () => Promise<void>;
}

/**
 * Hook personalizado para manejar estados de modales simples (éxito/error)
 */
export function useSimpleModal(initialState: Partial<ModalState> = {}) {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    ...initialState,
  });

  const open = useCallback((title: string, message: string) => {
    setModal({ isOpen: true, title, message });
  }, []);

  const close = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const reset = useCallback(() => {
    setModal({ isOpen: false, title: "", message: "" });
  }, []);

  return { modal, open, close, reset, setModal };
}

/**
 * Hook personalizado para manejar estados de modales de confirmación
 */
export function useConfirmModal(initialState: Partial<ConfirmModalState> = {}) {
  const [modal, setModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    onConfirm: async () => {},
    ...initialState,
  });

  const open = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => Promise<void>,
      confirmText = "Confirmar",
      cancelText = "Cancelar"
    ) => {
      setModal({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
      });
    },
    []
  );

  const close = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const reset = useCallback(() => {
    setModal({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirmar",
      cancelText: "Cancelar",
      onConfirm: async () => {},
    });
  }, []);

  return { modal, open, close, reset, setModal };
}
