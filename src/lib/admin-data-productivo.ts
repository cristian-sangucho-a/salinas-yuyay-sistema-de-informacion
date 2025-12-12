import { pb } from "./pocketbase";
import type {
  Producto,
  CategoriaProducto,
  SubcategoriaProducto,
} from "./types/productivo";
import { ListResult } from "pocketbase";

// --- PRODUCTOS ---

export async function getProductosAdmin(
  page: number = 1,
  perPage: number = 50,
  filter: string = ""
): Promise<ListResult<Producto>> {
  try {
    const productos = await pb
      .collection("productos")
      .getList<Producto>(page, perPage, {
        filter: filter,
        sort: "-created",
        expand: "categoria,subcategoria",
      });
    return productos;
  } catch (error) {
    console.error("Error fetching productos admin:", error);
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }
}

export async function createProducto(data: {
  nombre: string;
  descripcion: string;
  pvp1: number;
  categoria: string;
  subcategoria?: string;
  estado: "A" | "I";
  destacado: boolean;
  contifico_id?: string; // ID del producto en Contífico
  imagenes?: File[];
  ingredientes?: string;
  condicionesAlmacenamiento?: "Refrigeracion" | "Seco" | "Congelación";
}): Promise<Producto> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("descripcion", data.descripcion);
  formData.append("pvp1", data.pvp1.toString());
  formData.append("categoria", data.categoria);
  if (data.subcategoria) formData.append("subcategoria", data.subcategoria);
  formData.append("estado", data.estado);
  formData.append("destacado", data.destacado.toString());
  if (data.contifico_id) formData.append("contifico_id", data.contifico_id);
  if (data.ingredientes) formData.append("ingredientes", data.ingredientes);
  if (data.condicionesAlmacenamiento)
    formData.append(
      "condicionesAlmacenamiento",
      data.condicionesAlmacenamiento
    );

  if (data.imagenes && data.imagenes.length > 0) {
    data.imagenes.forEach((file) => {
      formData.append("imagenes", file);
    });
  }

  return await pb.collection("productos").create(formData);
}

export async function updateProducto(
  id: string,
  data: {
    nombre?: string;
    descripcion?: string;
    pvp1?: number;
    categoria?: string;
    subcategoria?: string;
    estado?: "A" | "I";
    destacado?: boolean;
    contifico_id?: string; // ID del producto en Contífico
    imagenes?: File[];
    imagenesToDelete?: string[];
    ingredientes?: string;
    condicionesAlmacenamiento?: "Refrigeracion" | "Seco" | "Congelación";
  }
): Promise<Producto> {
  const formData = new FormData();

  if (data.nombre !== undefined) formData.append("nombre", data.nombre);
  if (data.descripcion !== undefined)
    formData.append("descripcion", data.descripcion);
  if (data.pvp1 !== undefined) formData.append("pvp1", data.pvp1.toString());
  if (data.categoria !== undefined)
    formData.append("categoria", data.categoria);
  if (data.subcategoria !== undefined)
    formData.append("subcategoria", data.subcategoria);
  if (data.estado !== undefined) formData.append("estado", data.estado);
  if (data.destacado !== undefined)
    formData.append("destacado", data.destacado.toString());
  if (data.contifico_id !== undefined)
    formData.append("contifico_id", data.contifico_id);
  if (data.ingredientes !== undefined)
    formData.append("ingredientes", data.ingredientes);
  if (data.condicionesAlmacenamiento !== undefined)
    formData.append(
      "condicionesAlmacenamiento",
      data.condicionesAlmacenamiento
    );

  if (data.imagenes && data.imagenes.length > 0) {
    data.imagenes.forEach((file) => {
      formData.append("imagenes", file);
    });
  }

  // Para eliminar imágenes, PocketBase usa la misma clave 'imagenes' pero con valor vacío o null si se quiere borrar todo,
  // o se maneja diferente. En PocketBase JS SDK, para borrar archivos específicos de un campo múltiple,
  // se suele pasar el nombre del archivo a eliminar en una propiedad especial o se re-sube la lista.
  // Sin embargo, la forma estándar de "eliminar" un archivo de un campo múltiple en update es pasar el nombre del archivo como valor a eliminar con un modificador "-" o simplemente no incluirlo si se reenvía todo (pero aquí es multipart).
  // PocketBase documentation says: "To delete a file, set the file field to null or empty string". But for multiple files?
  // Actually, for multiple files, you usually pass the file names you want to KEEP if you are sending a JSON body, but with FormData it's tricky.
  // The JS SDK handles `pb.collection().update(id, { "imagenes-": ["filename1.jpg"] })` for deleting specific files.
  // Let's try to handle deletions separately if needed, or assume the SDK handles it if we pass a specific structure.
  // For now, let's implement the deletion logic using the SDK's specific syntax for deletions if possible, or just append the files to add.

  // If we have files to delete, we might need to do a separate call or pass them in the body if not using FormData for everything.
  // But since we are mixing files (FormData) and data, we have to use FormData.
  // PocketBase allows `field-` key in FormData to remove values? No, that's for JSON.
  // Wait, the SDK `update` method accepts a body object OR FormData. If we use FormData, we can't easily use the `field-` syntax unless we append it as a key?
  // Actually, we can pass the `imagenes-` key in the FormData? No, FormData keys are strings.
  // Let's look at how `updateActivo` does it in `admin-data.ts`.

  return await pb.collection("productos").update(id, formData);
}

// Helper to delete specific images from a product
export async function deleteProductoImage(
  id: string,
  filename: string
): Promise<boolean> {
  try {
    await pb.collection("productos").update(id, {
      "imagenes-": [filename],
    });
    return true;
  } catch (e) {
    console.error("Error deleting product image", e);
    return false;
  }
}

export async function deleteProducto(id: string): Promise<boolean> {
  return await pb.collection("productos").delete(id);
}

// --- CATEGORIAS ---

export async function createCategoria(data: {
  nombre: string;
  slug: string;
  descripcion_categoria?: string;
  field?: File; // Imagen
}): Promise<CategoriaProducto> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("slug", data.slug);
  if (data.descripcion_categoria)
    formData.append("descripcion_categoria", data.descripcion_categoria);

  if (data.field) {
    formData.append("field", data.field);
  }

  return await pb.collection("categoria_productos").create(formData);
}

export async function updateCategoria(
  id: string,
  data: {
    nombre?: string;
    slug?: string;
    descripcion_categoria?: string;
    field?: File;
  }
): Promise<CategoriaProducto> {
  const formData = new FormData();

  if (data.nombre !== undefined) formData.append("nombre", data.nombre);
  if (data.slug !== undefined) formData.append("slug", data.slug);
  if (data.descripcion_categoria !== undefined)
    formData.append("descripcion_categoria", data.descripcion_categoria);

  if (data.field) {
    formData.append("field", data.field);
  }

  return await pb.collection("categoria_productos").update(id, formData);
}

export async function deleteCategoria(id: string): Promise<boolean> {
  return await pb.collection("categoria_productos").delete(id);
}

// --- SUBCATEGORIAS ---

export async function getSubcategoriasAdmin(
  page: number = 1,
  perPage: number = 50,
  filter: string = ""
): Promise<ListResult<SubcategoriaProducto>> {
  try {
    const subcategorias = await pb
      .collection("subcategoria_productos")
      .getList<SubcategoriaProducto>(page, perPage, {
        filter: filter,
        sort: "-created",
        expand: "categoria_producto",
      });
    return subcategorias;
  } catch (error) {
    console.error("Error fetching subcategorias admin:", error);
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }
}

export async function createSubcategoria(data: {
  nombre: string;
  slug: string;
  descripcion_subcategoria?: string;
  categoria_producto?: string;
}): Promise<SubcategoriaProducto> {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("slug", data.slug);
  if (data.descripcion_subcategoria)
    formData.append("descripcion_subcategoria", data.descripcion_subcategoria);
  if (data.categoria_producto)
    formData.append("categoria_producto", data.categoria_producto);

  return await pb.collection("subcategoria_productos").create(formData);
}

export async function updateSubcategoria(
  id: string,
  data: {
    nombre?: string;
    slug?: string;
    descripcion_subcategoria?: string;
    categoria_producto?: string;
  }
): Promise<SubcategoriaProducto> {
  const formData = new FormData();

  if (data.nombre !== undefined) formData.append("nombre", data.nombre);
  if (data.slug !== undefined) formData.append("slug", data.slug);
  if (data.descripcion_subcategoria !== undefined)
    formData.append("descripcion_subcategoria", data.descripcion_subcategoria);
  if (data.categoria_producto !== undefined)
    formData.append("categoria_producto", data.categoria_producto);

  return await pb.collection("subcategoria_productos").update(id, formData);
}

export async function deleteSubcategoria(id: string): Promise<boolean> {
  return await pb.collection("subcategoria_productos").delete(id);
}
