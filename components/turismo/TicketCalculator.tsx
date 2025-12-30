"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { ReactNode } from "react";
import { FaMars, FaVenus } from "react-icons/fa6";
import Button from "@atoms/Button";

const PRICES = {
  nino: 2.0,
  adulto: 2.0,
  mayor: 2.0,
  discapacidad: 2.0,
};

export default function TicketCalculator() {
  // Cantidades separadas por género para cada categoría
  const [ninoH, setNinoH] = useState(0);
  const [ninoM, setNinoM] = useState(0);
  const [adultoH, setAdultoH] = useState(0);
  const [adultoM, setAdultoM] = useState(0);
  const [mayorH, setMayorH] = useState(0);
  const [mayorM, setMayorM] = useState(0);
  const [discapacidadH, setDiscapacidadH] = useState(0);
  const [discapacidadM, setDiscapacidadM] = useState(0);

  const total = (
    (ninoH + ninoM) * PRICES.nino +
    (adultoH + adultoM) * PRICES.adulto +
    (mayorH + mayorM) * PRICES.mayor +
    (discapacidadH + discapacidadM) * PRICES.discapacidad
  ).toFixed(2);

  // Totales por categoría (sumando géneros)
  const totalNinos = ninoH + ninoM;
  const totalAdultos = adultoH + adultoM;
  const totalMayores = mayorH + mayorM;
  const totalDiscapacitados = discapacidadH + discapacidadM;
  // numeric total para cálculos si se necesita
  const totalNumber = (
    (totalNinos) * PRICES.nino +
    (totalAdultos) * PRICES.adulto +
    (totalMayores) * PRICES.mayor +
    (totalDiscapacitados) * PRICES.discapacidad
  );

  // Fecha de visita y total de boletos (usar Date like admin event page, pero sin hora)
  const [visitDate, setVisitDate] = useState<Date | null>(new Date());
  const totalTickets = totalNinos + totalAdultos + totalMayores + totalDiscapacitados;

  const Counter = ({
    label,
    value,
    onInc,
    onDec,
    price,
    icon,
    colorClass,
  }: {
    label: string;
    value: number;
    onInc: () => void;
    onDec: () => void;
    price: number;
    icon?: ReactNode;
    colorClass?: string; // e.g., "text-sky-600 bg-sky-100"
  }) => (
    <div className="flex items-center justify-between gap-4 p-3 border border-base-300 rounded bg-base-100">
      <div className="flex items-center gap-3">
        <div className={`avatar placeholder ${colorClass?.split(" ").some((c) => c.includes("bg-")) ? "" : "bg-base-200"}`}>
          <div className={`w-10 rounded-full flex items-center justify-center ${colorClass ?? ""}`}>
            <span className="text-xl">{icon}</span>
          </div>
        </div>
        <div>
          <div className="font-semibold">{label}</div>
          <div className="text-xs text-base-content/70">Precio: ${price}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-circle btn-outline" onClick={onDec} aria-label={`disminuir ${label}`}>
          −
        </button>
        <div className="w-8 text-center text-lg tabular-nums">{value}</div>
        <button className="btn btn-circle btn-primary" onClick={onInc} aria-label={`aumentar ${label}`}>
          +
        </button>
      </div>
    </div>
  );

  return (
    <section id="boletos" className="py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-3">Asegura tu entrada al pasado</h2>
          <p className="text-lg text-base-content/70">Compra tus boletos hoy y vive la experiencia de nuestras culturas ancestrales.</p>
        </div>
        <h3 className="text-2xl font-bold mb-4">Visitanos. Reserva tus entradas al museo</h3>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="flex-1">
              <div className="text-sm font-medium">Fecha de visita</div>
              <DatePicker
                selected={visitDate}
                onChange={(d: Date | null) => setVisitDate(d)}
                dateFormat="yyyy-MM-dd"
                className="input input-bordered w-full bg-base-200"
                placeholderText="Selecciona una fecha"
              />
            </label>
            <div className="mt-2 sm:mt-0">
              <div className="text-sm font-medium">Número total de boletos</div>
              <div className="text-lg font-semibold">{totalTickets}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-base font-semibold">Niño</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Counter
                label="Hombre"
                value={ninoH}
                price={PRICES.nino}
                onInc={() => setNinoH((v) => v + 1)}
                onDec={() => setNinoH((v) => Math.max(0, v - 1))}
                icon={<FaMars />}
                colorClass="text-sky-600 bg-sky-100"
              />
              <Counter
                label="Mujer"
                value={ninoM}
                price={PRICES.nino}
                onInc={() => setNinoM((v) => v + 1)}
                onDec={() => setNinoM((v) => Math.max(0, v - 1))}
                icon={<FaVenus />}
                colorClass="text-pink-600 bg-pink-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-base font-semibold">Adulto</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Counter
                label="Hombre"
                value={adultoH}
                price={PRICES.adulto}
                onInc={() => setAdultoH((v) => v + 1)}
                onDec={() => setAdultoH((v) => Math.max(0, v - 1))}
                icon={<FaMars />}
                colorClass="text-sky-600 bg-sky-100"
              />
              <Counter
                label="Mujer"
                value={adultoM}
                price={PRICES.adulto}
                onInc={() => setAdultoM((v) => v + 1)}
                onDec={() => setAdultoM((v) => Math.max(0, v - 1))}
                icon={<FaVenus />}
                colorClass="text-pink-600 bg-pink-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-base font-semibold">Adulto Mayor</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Counter
                label="Hombre"
                value={mayorH}
                price={PRICES.mayor}
                onInc={() => setMayorH((v) => v + 1)}
                onDec={() => setMayorH((v) => Math.max(0, v - 1))}
                icon={<FaMars />}
                colorClass="text-sky-600 bg-sky-100"
              />
              <Counter
                label="Mujer"
                value={mayorM}
                price={PRICES.mayor}
                onInc={() => setMayorM((v) => v + 1)}
                onDec={() => setMayorM((v) => Math.max(0, v - 1))}
                icon={<FaVenus />}
                colorClass="text-pink-600 bg-pink-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-base font-semibold">Discapacidad</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Counter
                label="Hombre"
                value={discapacidadH}
                price={PRICES.discapacidad}
                onInc={() => setDiscapacidadH((v) => v + 1)}
                onDec={() => setDiscapacidadH((v) => Math.max(0, v - 1))}
                icon={<FaMars />}
                colorClass="text-sky-600 bg-sky-100"
              />
              <Counter
                label="Mujer"
                value={discapacidadM}
                price={PRICES.discapacidad}
                onInc={() => setDiscapacidadM((v) => v + 1)}
                onDec={() => setDiscapacidadM((v) => Math.max(0, v - 1))}
                icon={<FaVenus />}
                colorClass="text-pink-600 bg-pink-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">Total: ${total}</div>
            <Button
              variant="primary"
              onClick={() => {
                const fechaStr = visitDate ? visitDate.toISOString().slice(0, 10) : "";
                const message = `Quiero reservar boletos para el museo:\nFecha de visita: ${fechaStr}\nNiños: ${totalNinos}\nAdultos: ${totalAdultos}\nAdultos mayores: ${totalMayores}\nDiscapacitados: ${totalDiscapacitados}\nNúmero total de boletos: ${totalTickets}\nTotal a pagar: $${totalNumber.toFixed(2)}`;
                const url = `https://api.whatsapp.com/send/?phone=593999999999&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
                window.open(url, "_blank");
              }}
            >
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
