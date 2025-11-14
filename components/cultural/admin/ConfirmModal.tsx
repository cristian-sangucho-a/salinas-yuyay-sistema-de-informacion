'use client';

import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  onConfirm,
  onCancel,
  isProcessing = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-16 h-16 text-[#7C8B56]" />;
      case 'danger':
        return <FaExclamationTriangle className="w-16 h-16 text-[#B63A1B]" />;
      default:
        return <FaExclamationTriangle className="w-16 h-16 text-[#D6A77A]" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'success':
        return 'bg-[#7C8B56] hover:bg-[#7C8B56]/90';
      case 'danger':
        return 'bg-[#B63A1B] hover:bg-[#B63A1B]/90';
      default:
        return 'bg-[#5A1E02] hover:bg-[#8B3C10]';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={!isProcessing ? onCancel : undefined}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="mb-4 animate-in zoom-in duration-500 delay-100">
            {getIcon()}
          </div>
          
          <h3 className="text-2xl font-bold text-[#5A1E02] text-center mb-2">
            {title}
          </h3>
          
          <p className="text-[#4A3B31] text-center leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Botones */}
        <div className="flex gap-3 p-6 bg-[#F8F3ED] rounded-b-xl">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 px-4 py-3 rounded-lg font-medium text-[#4A3B31] bg-white border-2 border-[#D9C3A3] hover:bg-[#F8F3ED] hover:border-[#5A1E02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-white ${getConfirmButtonClass()} transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
          >
            {isProcessing ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
