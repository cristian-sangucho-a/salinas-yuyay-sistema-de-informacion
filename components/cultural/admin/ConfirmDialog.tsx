'use client';

import React, { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: 'text-[#B63A1B]',
      iconBg: 'bg-[#B63A1B]/10',
      button: 'bg-[#B63A1B] hover:bg-[#B63A1B]/90',
      border: 'border-[#B63A1B]/20'
    },
    warning: {
      icon: 'text-[#D6A77A]',
      iconBg: 'bg-[#D6A77A]/10',
      button: 'bg-[#D6A77A] hover:bg-[#D6A77A]/90',
      border: 'border-[#D6A77A]/20'
    },
    info: {
      icon: 'text-[#9DB8C0]',
      iconBg: 'bg-[#9DB8C0]/10',
      button: 'bg-[#9DB8C0] hover:bg-[#9DB8C0]/90',
      border: 'border-[#9DB8C0]/20'
    }
  };

  const colorScheme = colors[type];

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={onCancel}
    >
      <div 
        className={`bg-[#F8F3ED] rounded-xl shadow-2xl max-w-md w-full transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white text-[#5A1E02] px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-[#D9C3A3]">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onCancel}
            className="text-[#4A3B31]/60 hover:text-[#B63A1B] hover:bg-[#B63A1B]/10 rounded-full p-1 transition-all duration-200 hover:rotate-90"
            aria-label="Cerrar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 items-start">
            <div className={`${colorScheme.iconBg} ${colorScheme.icon} rounded-full p-3 shrink-0 animate-in zoom-in duration-500`}>
              <FaExclamationTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[#4A3B31] leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="btn flex-1 bg-white border-2 border-[#D9C3A3] text-[#4A3B31] hover:bg-[#F8F3ED] hover:border-[#7C8B56] transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`btn flex-1 ${colorScheme.button} text-white border-none transition-all`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
