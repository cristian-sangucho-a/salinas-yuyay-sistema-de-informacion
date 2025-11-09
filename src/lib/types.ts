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
    nombre: string;
    apellido: string;
    correo: string;
    institucion?: string;
    motivo: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    activo: string; // ID del activo relacionado
    expand?: { // Para cuando expandimos la relación con 'activo'
        activo?: Activo;
    };
}

// Tipo para la colección 'evento' (según JSON proporcionado)
export interface Evento {
    id: string;
    collectionId: string; // p.ej. "pbc_2080149951"
    collectionName: 'evento';
    portada?: string; // filename
    titulo: string;
    fecha_de_inicio?: string; // ISO datetime
    fecha_de_finalizacion?: string; // ISO datetime
    resumen?: string;
    contenido?: string;
    publico?: boolean;
    numero_de_evento?: number;
    organizadores?: string;
    created?: string;
    updated?: string;
    galeria?: string[];
}

// Tipo para la colección 'sala_museo' (según JSON proporcionado)
export interface SalaMuseo {
    id: string;
    collectionId: string; // p.ej. "pbc_3937320277"
    collectionName: 'sala_museo';
    titulo: string;
    resumen?: string;
    contenido?: string;
    portada?: string; // filename
    galeria?: string[];
    ocultar?: boolean;
    created?: string;
    updated?: string;
}
