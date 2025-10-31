import { pb } from './pocketbase';
import type { Categoria, Activo, Solicitud } from './types';
import { ListResult } from 'pocketbase';

// Funciones de Categorías
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

// Funciones de Activos
export async function createActivo(data: {
  titulo: string;
  descripcion: string;
  anio?: number;
  autor?: string;
  archivos?: File[];
  publico: boolean;
  categoria: string;
}): Promise<Activo> {
  const formData = new FormData();
  formData.append('titulo', data.titulo);
  formData.append('descripcion', data.descripcion);
  formData.append('publico', data.publico.toString());
  formData.append('categoria', data.categoria);
  
  if (data.anio) {
    formData.append('anio', data.anio.toString());
  }
  
  if (data.autor) {
    formData.append('autor', data.autor);
  }
  
  if (data.archivos && data.archivos.length > 0) {
    data.archivos.forEach((file) => {
      formData.append('archivos', file);
    });
  }

  return await pb.collection('activo').create(formData);
}

export async function updateActivo(
  id: string,
  data: {
    titulo?: string;
    descripcion?: string;
    anio?: number | null;
    autor?: string;
    publico?: boolean;
    categoria?: string;
    nuevosArchivos?: File[];
    archivosAEliminar?: string[];
  }
): Promise<Activo> {
  const formData = new FormData();
  
  if (data.titulo !== undefined) {
    formData.append('titulo', data.titulo);
  }
  
  if (data.descripcion !== undefined) {
    formData.append('descripcion', data.descripcion);
  }
  
  if (data.anio !== undefined) {
    formData.append('anio', data.anio ? data.anio.toString() : '');
  }
  
  if (data.autor !== undefined) {
    formData.append('autor', data.autor);
  }
  
  if (data.publico !== undefined) {
    formData.append('publico', data.publico.toString());
  }
  
  if (data.categoria !== undefined) {
    formData.append('categoria', data.categoria);
  }
  
  // Agregar nuevos archivos
  if (data.nuevosArchivos && data.nuevosArchivos.length > 0) {
    data.nuevosArchivos.forEach((file) => {
      formData.append('archivos', file);
    });
  }
  
  // Para eliminar archivos, enviar los nombres de archivos a mantener
  if (data.archivosAEliminar && data.archivosAEliminar.length > 0) {
    // Obtener el activo actual
    const activoActual = await pb.collection('activo').getOne(id);
    const archivosActuales: string[] = activoActual.archivos || [];
    
    // Filtrar archivos a mantener
    const archivosAMantener = archivosActuales.filter(
      archivo => !data.archivosAEliminar!.includes(archivo)
    );
    
    // Si no hay archivos a mantener, enviar array vacío
    if (archivosAMantener.length === 0) {
      formData.append('archivos', '');
    }
  }

  return await pb.collection('activo').update(id, formData);
}

export async function deleteActivo(id: string): Promise<boolean> {
  return await pb.collection('activo').delete(id);
}

export async function getActivosAdmin(
  categoriaId?: string,
  page: number = 1,
  perPage: number = 50
): Promise<{ items: Activo[]; totalItems: number; totalPages: number }> {
  try {
    let filter = '';
    if (categoriaId && categoriaId !== 'Todas') {
      filter = `categoria = "${categoriaId}"`;
    }

    const result = await pb.collection('activo').getList<Activo>(
      page,
      perPage,
      {
        filter: filter || undefined,
        expand: 'categoria',
        sort: '-created',
      }
    );

    return {
      items: result.items,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    };
  } catch (error) {
    console.error("Error fetching activos:", error);
    return { items: [], totalItems: 0, totalPages: 0 };
  }
}

export async function getActivoById(id: string): Promise<Activo | null> {
  try {
    const activo = await pb.collection('activo').getOne<Activo>(id, {
      expand: 'categoria',
    });
    return activo;
  } catch (error) {
    console.error("Error fetching activo:", error);
    return null;
  }
}

export async function getSolicitudesAdmin(
  page: number = 1,
  perPage: number = 30
): Promise<ListResult<Solicitud>> {
  try {
    const result = await pb.collection('solicitud').getList<Solicitud>(
      page,
      perPage,
      {
        expand: 'activo', // Para poder ver el nombre del activo solicitado
        sort: '-created', // Mostrar las más nuevas primero
      }
    );
    return result;
  } catch (error) {
    console.error("Error fetching solicitudes:", error);
    return { page: 1, perPage, totalItems: 0, totalPages: 1, items: [] };
  }
}
export async function updateSolicitudEstado(
  id: string,
  estado: 'aprobado' | 'rechazado'
): Promise<Solicitud> {
  try {
    // FIX: Añadir <Solicitud>
    const updatedSolicitud = await pb.collection('solicitud').update<Solicitud>(id, {
      estado,
    });
    return updatedSolicitud;
  } catch (error) {
    console.error(`Error updating solicitud ${id} to ${estado}:`, error);
    throw error;
  }
}