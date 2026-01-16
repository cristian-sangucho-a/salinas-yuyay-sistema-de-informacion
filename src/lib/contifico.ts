import {
  Producto,
  ClientData,
  AddressData,
  CartItem,
} from "./types/productivo";

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

export interface ContificoDetalle {
  producto_id: string;
  cantidad: number;
  precio: number;
  porcentaje_iva: number;
  porcentaje_descuento: number;
  base_cero: number;
  base_gravable: number;
  base_no_gravable: number;
}

export interface ContificoPrefactura {
  fecha_emision: string;
  tipo_documento: string;
  estado: string;
  cliente: {
    cedula: string;
    razon_social: string;
    telefonos: string;
    direccion: string;
    tipo: string;
    email: string;
    es_extranjero: boolean;
  };
  descripcion: string;
  subtotal_0: number;
  subtotal_12: number;
  iva: number;
  total: number;
  detalles: ContificoDetalle[];
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export async function createContificoPrefactura(
  client: ClientData,
  address: AddressData,
  items: CartItem[]
): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    const subtotal_0 = 0;
    let subtotal_12 = 0;
    let total_iva = 0;

    const detalles: ContificoDetalle[] = items.map((item) => {
      const productoId = item.contificoId || "";
      const precioUnitario = item.price;
      const totalLinea = precioUnitario * item.quantity;

      // Cálculo con IVA 15% por defecto
      const ivaItem = totalLinea * 0.15;
      subtotal_12 += totalLinea;
      total_iva += ivaItem;

      return {
        producto_id: productoId,
        cantidad: item.quantity,
        precio: precioUnitario,
        porcentaje_iva: 0.0,
        porcentaje_descuento: 0.0,
        base_cero: 0.0,
        base_gravable: totalLinea,
        base_no_gravable: 0.0,
      };
    });

    const total = subtotal_0 + subtotal_12 + total_iva;

    const direccionCompleta = `${address.callePrincipal} ${
      address.calleSecundaria ? `y ${address.calleSecundaria}` : ""
    }, ${address.ciudad}, ${address.provincia}. Ref: ${address.referencia}`;

    const prefactura: ContificoPrefactura = {
      fecha_emision: formatDate(new Date()),
      tipo_documento: "PRE",
      estado: "P",
      cliente: {
        cedula: client.cedula,
        razon_social: client.razon_social,
        telefonos: client.telefonos,
        direccion: direccionCompleta,
        tipo: client.tipo,
        email: client.email,
        es_extranjero: false,
      },
      descripcion: "Pedido Web - Salinas Yuyay",
      subtotal_0: Number(subtotal_0.toFixed(2)),
      subtotal_12: Number(subtotal_12.toFixed(2)),
      iva: Number(total_iva.toFixed(2)),
      total: Number(total.toFixed(2)),
      detalles: detalles,
    };

    const response = await fetch("/api/contifico/documento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prefactura),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || `Error ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error creating Contifico prefactura:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
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
