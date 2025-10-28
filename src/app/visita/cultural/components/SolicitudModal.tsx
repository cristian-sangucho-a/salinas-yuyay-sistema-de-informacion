'use client';

import React, { useState, useMemo } from 'react';
import { FaTimes, FaCheckCircle, FaFileAlt } from 'react-icons/fa';
import { createSolicitud } from '@/lib/data';

interface SolicitudModalProps {
  isOpen: boolean;
  onClose: () => void;
  activoId: string;
  activoTitulo: string;
}

export default function SolicitudModal({
  isOpen,
  onClose,
  activoId,
  activoTitulo,
}: SolicitudModalProps) {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correo: '',
    institucion: '',
    motivo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = useMemo(() => {
    const nombreParts = formData.nombreCompleto.trim().split(/\s+/);
    return (
      nombreParts.length >= 2 &&
      formData.correo.trim() !== '' &&
      formData.motivo.trim() !== ''
    );
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const nombreParts = formData.nombreCompleto.trim().split(/\s+/);
    
    if (nombreParts.length < 2) {
      setError('Por favor, ingresa tu nombre y apellido completo.');
      return;
    }

    setIsSubmitting(true);

    const nombre = nombreParts[0];
    const apellido = nombreParts.slice(1).join(' ');

    const success = await createSolicitud({
      nombre,
      apellido,
      correo: formData.correo,
      institucion: formData.institucion || undefined,
      motivo: formData.motivo,
      activo: activoId,
    });

    setIsSubmitting(false);

    if (success) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          nombreCompleto: '',
          correo: '',
          institucion: '',
          motivo: '',
        });
        onClose();
      }, 2000);
    } else {
      setError('Hubo un error al enviar la solicitud. Por favor, intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#F8F3ED] rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white text-[#5A1E02] px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-[#D9C3A3]">
          <h2 className="text-xl font-bold">Solicitar Archivo</h2>
          <button
            onClick={onClose}
            className="text-[#B63A1B] hover:bg-[#B63A1B]/10 rounded-full p-1 transition-colors"
            aria-label="Cerrar"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-10 text-center">
            <FaCheckCircle className="w-20 h-20 text-[#7C8B56] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#5A1E02] mb-3">
              ¡Solicitud Enviada!
            </h3>
            <p className="text-[#4A3B31]">
              Tu solicitud ha sido recibida. Te contactaremos pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <p className="text-sm text-[#4A3B31]/80">
              Completa el formulario para solicitar acceso a este archivo histórico. Los campos marcados con <span className="text-[#B63A1B] font-semibold">*</span> son obligatorios.
            </p>

            <div className="bg-[#7C8B56]/10 border-l-4 border-[#7C8B56] rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <FaFileAlt className="w-5 h-5 text-[#7C8B56] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#4A3B31]/60 uppercase tracking-wide mb-1">
                    Activo
                  </p>
                  <p className="text-sm font-medium text-[#5A1E02]">
                    {activoTitulo}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Nombre completo <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  name="nombreCompleto"
                  value={formData.nombreCompleto}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31]"
                  placeholder="Juan Pérez García"
                />
                <label className="label">
                  <span className="label-text-alt text-[#4A3B31]/60 text-xs">
                    Ingresa tu nombre y apellido(s)
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Correo electrónico <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31]"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Institución
                  </span>
                  <span className="label-text-alt text-[#4A3B31]/50 text-xs">(Opcional)</span>
                </label>
                <input
                  type="text"
                  name="institucion"
                  value={formData.institucion}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none text-[#4A3B31]"
                  placeholder="Universidad, organización, etc."
                />
              </div>

              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text text-[#4A3B31] text-sm font-semibold">
                    Propósito de la solicitud <span className="text-[#B63A1B]">*</span>
                  </span>
                </label>
                <textarea
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="textarea textarea-bordered w-full bg-white border-[#D9C3A3] focus:border-[#7C8B56] focus:outline-none resize-none text-[#4A3B31]"
                  placeholder="Describe brevemente para qué necesitas este archivo..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn flex-1 bg-white border-2 border-[#D9C3A3] text-[#4A3B31] hover:bg-[#F8F3ED] hover:border-[#7C8B56]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="btn flex-1 bg-[#7C8B56] hover:bg-[#7C8B56]/90 text-white border-none disabled:bg-[#7C8B56]/30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
