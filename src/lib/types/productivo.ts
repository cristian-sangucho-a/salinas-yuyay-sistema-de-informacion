import type React from "react";

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "accent" | "neutral";
}

export interface Categoria {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  badgeVariant?: "primary" | "secondary" | "accent" | "neutral";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  contificoId?: string;
  image?: string;
  slug?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CategoriaProducto {
  id: string;
  collectionId: string;
  collectionName: "categoria_productos";
  created: string;
  updated: string;
  nombre: string;
  slug: string;
  descripcion_categoria?: string;
  contifico_id?: string;
  field?: string; // Imagen de la categoría
  productos?: string[]; // IDs de productos relacionados
  subcategorias?: string[]; // IDs de subcategorías relacionadas
  expand?: {
    productos?: Producto[];
    subcategorias?: SubcategoriaProducto[];
  };
}

export interface SubcategoriaProducto {
  id: string;
  collectionId: string;
  collectionName: "subcategoria_productos";
  created: string;
  updated: string;
  nombre: string;
  slug: string;
  descripcion_subcategoria?: string;
  categoria_producto?: string; // ID de la categoría padre
  productos?: string[]; // IDs de productos relacionados
  expand?: {
    categoria_producto?: CategoriaProducto;
    productos?: Producto[];
  };
}

export interface Producto {
  id: string;
  collectionId: string;
  collectionName: "productos";
  created: string;
  updated: string;
  contifico_id: string;
  estado?: "A" | "I"; // A = Activo, I = Inactivo
  pvp1?: number; // Precio de venta al público desde Contifico
  fecha_creacion?: string;
  nombre?: string;
  slug?: string;
  descripcion?: string;
  precioBase?: number;
  ingredientes?: string;
  condicionesAlmacenamiento?: "Refrigeracion" | "Seco" | "Congelación";
  imagenes?: string[]; // Archivos de imagen
  categoria?: string; // ID de la categoría
  subcategoria?: string; // ID de la subcategoría
  destacado?: boolean;
  expand?: {
    categoria?: CategoriaProducto;
    subcategoria?: SubcategoriaProducto;
  };
}

export interface ClientData {
  id?: string;
  cedula: string;
  razon_social: string;
  email: string;
  telefonos: string;
  tipo: "N" | "J";
  es_cliente: boolean;
  es_proveedor: boolean;
}

export interface AddressData {
  provincia: string;
  ciudad: string;
  callePrincipal: string;
  calleSecundaria: string;
  referencia: string;
  codigoPostal?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  category?: string;
  contificoId?: string;
}
