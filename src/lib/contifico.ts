import { Producto } from "./types/productivo";

export interface ContificoProducto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string | null;
  descripcion: string | null;
  pvp1: string; // Viene como string "200.0"
  pvp2: string | null;
  cantidad_stock: string; // Viene como string "-5.0"
  estado: "A" | "I";
  tipo: "PRO" | "SER";
  categoria_id: string | null;
  porcentaje_iva: number | null;
  fecha_creacion: string;
}

export interface ContificoProductosResponse {
  productos: ContificoProducto[];
  total: number;
}

export async function getContificoProductosPorSemana(
  fechaInicial: string,
  fechaFinal: string,
  filter: string = ""
): Promise<ContificoProductosResponse> {
  try {
    // Llamada a nuestra API interna (Route Handler)
    const url = new URL("/api/contifico/productos", window.location.origin);
    url.searchParams.append("fecha_inicial", fechaInicial);
    url.searchParams.append("fecha_final", fechaFinal);
    if (filter) {
      url.searchParams.append("filtro", filter);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Error fetching internal API: ${response.statusText}`);
    }

    const data = await response.json();
    return data as ContificoProductosResponse;
  } catch (error) {
    console.error("Error fetching Contifico products by week:", error);
    return {
      productos: [],
      total: 0,
    };
  }
}

// Función auxiliar para normalizar datos de Contífico a nuestro formato
export function mapContificoToProducto(
  cProd: ContificoProducto
): Partial<Producto> {
  return {
    nombre: cProd.nombre,
    descripcion: cProd.descripcion || "",
    precioBase: parseFloat(cProd.pvp1),
    pvp1: parseFloat(cProd.pvp1),
    estado: cProd.estado,
    contifico_id: cProd.id,
    // Nota: Categoría y Subcategoría requieren mapeo manual o lógica adicional
  };
}
