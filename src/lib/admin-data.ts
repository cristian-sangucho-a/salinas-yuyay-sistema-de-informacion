import { pb } from './pocketbase';
import type { Categoria } from './types';

export async function createCategoria(data: {
  nombre: string;
  descripcion: string;
  imagen?: File;
}): Promise<Categoria> {
  const formData = new FormData();
  formData.append('nombre', data.nombre);
  formData.append('descripcion', data.descripcion);
  
  if (data.imagen) {
    formData.append('imagen', data.imagen);
  }

  return await pb.collection('categoria').create(formData);
}

export async function updateCategoria(
  id: string,
  data: {
    nombre?: string;
    descripcion?: string;
    imagen?: File | null;
  }
): Promise<Categoria> {
  const formData = new FormData();
  
  if (data.nombre !== undefined) {
    formData.append('nombre', data.nombre);
  }
  
  if (data.descripcion !== undefined) {
    formData.append('descripcion', data.descripcion);
  }
  
  if (data.imagen) {
    formData.append('imagen', data.imagen);
  } else if (data.imagen === null) {
    formData.append('imagen', '');
  }

  return await pb.collection('categoria').update(id, formData);
}

export async function deleteCategoria(id: string): Promise<boolean> {
  return await pb.collection('categoria').delete(id);
}

export async function getCategoriasAdmin(): Promise<Categoria[]> {
  try {
    const categorias = await pb.collection('categoria').getFullList<Categoria>({
      sort: '-created',
    });
    return categorias;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
