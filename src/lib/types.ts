// --- TIPOS DE DATOS ---

// Tipo para la colección 'categoria' 
export interface Categoria {
    id: string;
    collectionId: string;
    collectionName: 'categoria'; 
    created: string;
    updated: string;
    nombre: string;
    descripcion: string;
    imagen?: string; 
}

// Tipo para la colección 'activo' 
export interface Activo {
    id: string;
    collectionId: string;
    collectionName: 'activo'; 
    created: string;
    updated: string;
    titulo: string;
    descripcion: string;
    anio?: number; 
    autor?: string;
    archivos: string[];
    publico: boolean;
    categoria: string; // ID de la relación (Single)
    fileCount?: number;
    expand?: { // Para cuando expandimos la relación con 'categoria'
        categoria?: Categoria;
    };
}

// Tipo para la colección 'solicitud' 
export interface Solicitud {
    id: string;
    collectionId: string;
    collectionName: 'solicitud';
    created: string;
    updated: string;
    nombre: string;
    apellido: string;
    correo: string;
    institucion?: string;
    motivo: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    activo_solicitado: string; // ID del activo relacionado
}
