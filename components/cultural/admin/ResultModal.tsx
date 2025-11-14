'use client';

import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface ResultModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export default function ResultModal({
  isOpen,
  type,
  title,
  message,
  onClose,
}: ResultModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <div className="mb-4 animate-in zoom-in duration-500 delay-100">
            {type === 'success' ? (
              <FaCheckCircle className="w-20 h-20 text-[#7C8B56]" />
            ) : (
              <FaTimesCircle className="w-20 h-20 text-[#B63A1B]" />
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-[#5A1E02] text-center mb-3">
            {title}
          </h3>
          
          <p className="text-[#4A3B31] text-center leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Botón */}
        <div className="p-6 bg-[#F8F3ED] rounded-b-xl">
          <button
            onClick={onClose}
            className={`w-full px-4 py-3 rounded-lg font-medium text-white ${
              type === 'success'
                ? 'bg-[#7C8B56] hover:bg-[#7C8B56]/90'
                : 'bg-[#B63A1B] hover:bg-[#B63A1B]/90'
            } transition-all`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
