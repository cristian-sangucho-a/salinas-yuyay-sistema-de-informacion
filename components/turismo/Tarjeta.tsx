import type { TarjetaItem } from "@/lib/types";
import Image from "next/image";

// Definimos que las props del componente incluyen un objeto llamado 'datos'
interface Props {
  item: TarjetaItem;
  reverse?: boolean;
}

export default function Tarjeta({ item, reverse = false }: Props) {
  return (
    <div
      className={`card bg-base-100 shadow-md my-6 h-[315px] group transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg transform-gpu`}
    >
      <div
        className={`flex flex-col md:flex-row h-full ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
          {item?.portada ? (
            // fallback to regular img when image is an external url or missing loader
            <Image
              src={item.portada}
              alt={item.titulo}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center text-base-content/50">
              Imagen de sala
            </div>
          )}
          {/* overlay hover */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-3 right-3 opacity-100 translate-y-0 transition-all duration-300 group-hover:bottom-4 group-hover:right-4"
          >
            <span className="badge badge-primary shadow">Conoce más</span>
          </div>
        </div>
        <div className="md:w-1/2 p-6 flex items-center h-1/2 md:h-full bg-white/70 md:bg-base-100">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-base-content">
              {item.titulo}
            </h3>
            <p className="hidden md:block text-sm md:text-base text-base-content/70 mt-2">
              {item.eslogan ?? "Descripción breve de la sala del museo."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
