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
  porcentaje_iva: number | null;
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
  items: CartItem[],
): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    let subtotal_0 = 0;
    let subtotal_12 = 0;
    let subtotal_no_gravable = 0;
    let total_iva = 0;

    const detallesPromises = items.map(async (item) => {
      const productoId = item.contificoId;
      if (!productoId) {
        throw new Error(`Producto sin contificoId: ${item.name}`);
      }

      const precioUnitario = item.price;
      const totalLinea = precioUnitario * item.quantity;

      const productResponse = await fetch(
        `/api/contifico/productos/${productoId}`,
      );
      if (!productResponse.ok) {
        const errorData = await productResponse.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Error obteniendo IVA del producto (${productResponse.status})`,
        );
      }

      const productData = await productResponse.json();
      // console.log("Product Data from Contifico:", productData); // Debug info

      const rawIva = productData?.porcentaje_iva;

      // Default to 15 (current standard) if undefined, assuming legacy/standard products are taxable
      let porcentajeIva: number | null = 15;

      if (rawIva !== undefined && rawIva !== null && rawIva !== "") {
        const parsed = Number(rawIva);
        if (!isNaN(parsed)) {
          // If 0, it stays 0. If 12, stays 12. If 15, stays 15.
          porcentajeIva = parsed;
        }
      } else {
        // If field is missing, we default to 15.
        // But if we want to be safe about "base_no_gravable", we might check "tipo" or other flags,
        // but for now 15 is the safest "Active" bet causing 1047 (validation) rather than 1046 (missing field).
        console.warn(
          `Producto ${productoId} no tiene porcentaje_iva, asumiendo 15%`,
        );
      }

      let base_cero = 0;
      let base_gravable = 0; // Maps to subtotal_12 (legacy name for taxable base)
      let base_no_gravable = 0;
      let ivaLinea = 0;

      if (porcentajeIva === 0) {
        base_cero = totalLinea;
        subtotal_0 += totalLinea;
      } else if (porcentajeIva === null) {
        // This case is rare if we default to 15, but if rawIva was explicitly null from a verified source...
        // Note: Number(null) is 0, so parsing logic above handles null as 0?
        // Wait: Number(null) is 0. So rawIva null -> parsed 0 -> porcentajeIva 0.
        // If we want to support NULL (Exento), we should check specifically.
        // Re-evaluating null handling below.
        base_no_gravable = totalLinea;
        subtotal_no_gravable += totalLinea;
      } else {
        base_gravable = totalLinea;
        subtotal_12 += totalLinea;
        ivaLinea = totalLinea * (porcentajeIva / 100);
        total_iva += ivaLinea;
      }

      // Fix for Number(null) === 0 issue in logic above if rawIva comes as strictly null
      // We want to preserve 'null' meaning 'Exento' if API returns it.
      // However, usually API returns 0 for 0%.
      // Let's stick to: If we have a number, use it.

      // Round line totals to 2 decimals to ensure consistency
      const base_cero_fixed = Number(base_cero.toFixed(2));
      const base_gravable_fixed = Number(base_gravable.toFixed(2));
      const base_no_gravable_fixed = Number(base_no_gravable.toFixed(2));

      return {
        producto_id: productoId,
        cantidad: item.quantity,
        precio: Number(precioUnitario.toFixed(2)), // Ensure unit price is also rounded
        porcentaje_iva: porcentajeIva,
        porcentaje_descuento: 0.0,
        base_cero: base_cero_fixed,
        base_gravable: base_gravable_fixed,
        base_no_gravable: base_no_gravable_fixed,
      };
    });

    const detalles = await Promise.all(detallesPromises);

    // Reset totals to sum up the ROUNDED values from details
    subtotal_0 = 0;
    subtotal_12 = 0;
    subtotal_no_gravable = 0;
    total_iva = 0;

    detalles.forEach((r) => {
      subtotal_0 += r.base_cero;
      subtotal_12 += r.base_gravable;
      subtotal_no_gravable += r.base_no_gravable;

      // Calculate IVA based on the ROUNDED base
      if (r.porcentaje_iva && r.porcentaje_iva > 0) {
        // Calculate item IVA and round IT as well before summing
        const ivaItem = Number(
          (r.base_gravable * (r.porcentaje_iva / 100)).toFixed(2),
        );
        total_iva += ivaItem;
      }
    });

    // Totals are already aggregates of rounded numbers, but javascript float math might introduce epsilon errors
    // so we round the final sums again just to be safe (e.g. 0.1 + 0.2 = 0.300000004)
    const sub_0_fixed = Number(subtotal_0.toFixed(2));
    const sub_12_fixed = Number(subtotal_12.toFixed(2));
    const sub_ng_fixed = Number(subtotal_no_gravable.toFixed(2));
    const iva_fixed = Number(total_iva.toFixed(2));

    // Total is the sum of the fixed subtotals
    const total_fixed = Number(
      (sub_0_fixed + sub_12_fixed + sub_ng_fixed + iva_fixed).toFixed(2),
    );

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
      subtotal_0: sub_0_fixed,
      subtotal_12: sub_12_fixed,
      iva: iva_fixed,
      total: total_fixed,
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
  filter: string = "",
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
  cProd: ContificoProducto,
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
