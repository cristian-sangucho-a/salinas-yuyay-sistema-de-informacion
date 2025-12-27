import type { TarjetaItem } from "@/lib/types";

// Definimos que las props del componente incluyen un objeto llamado 'datos'
interface Props {
  item: TarjetaItem;
  reverse?: boolean;
}

export default function Tarjeta({ item, reverse = false }: Props) {

  return (
    <div className={`card bg-base-100 shadow-md my-6 h-[315px] group transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg transform-gpu`}>
      <div className={`flex flex-col md:flex-row h-full ${reverse ? "md:flex-row-reverse" : ""}`}>
        <div className="md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
          {item?.portada ? (
            // fallback to regular img when image is an external url or missing loader
            <img src={item.portada} alt={item.titulo} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="w-full h-full bg-base-200 flex items-center justify-center text-base-content/50">
              Imagen de sala
            </div>
          )}
          {/* overlay hover */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div aria-hidden className="pointer-events-none absolute bottom-3 right-3 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <span className="badge badge-primary shadow">Ver más</span>
          </div>
        </div>
        <div className="md:w-1/2 p-6 flex items-center h-1/2 md:h-full">
          <div>
            <h3 className="text-xl font-semibold text-base-content">{item.titulo}</h3>
            <p className="text-base-content/70 mt-2">
              {item.resumen ?? "Descripción breve de la sala del museo."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
