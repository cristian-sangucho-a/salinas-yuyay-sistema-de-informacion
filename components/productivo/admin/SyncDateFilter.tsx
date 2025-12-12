import React from "react";
import { FaSync } from "react-icons/fa";

interface SyncDateFilterProps {
  fechaInicial: string;
  fechaFinal: string;
  onFechaInicialChange: (date: string) => void;
  onFechaFinalChange: (date: string) => void;
  onFilter: () => void;
  isLoading: boolean;
}

/**
 * Date range filter component for sync operations
 * Allows users to select start and end dates for product synchronization
 */
export default function SyncDateFilter({
  fechaInicial,
  fechaFinal,
  onFechaInicialChange,
  onFechaFinalChange,
  onFilter,
  isLoading,
}: SyncDateFilterProps) {
  return (
    <div className="bg-white rounded-xl border border-base-300 shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="label">
            <span className="label-text font-medium">Fecha Inicial</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={fechaInicial}
            onChange={(e) => onFechaInicialChange(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="label">
            <span className="label-text font-medium">Fecha Final</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={fechaFinal}
            onChange={(e) => onFechaFinalChange(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={onFilter}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Cargando...
            </>
          ) : (
            <>
              <FaSync className="w-4 h-4" />
              Filtrar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
