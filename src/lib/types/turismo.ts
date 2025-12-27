// Tipo para la colección 'evento' (según JSON proporcionado)
export interface Evento {
    id: string;
    collectionId: string;
    portada: string; // filename
    titulo: string;
    fecha_de_inicio: string; // ISO datetime
    fecha_de_finalizacion: string; // ISO datetime
    resumen: string;
    contenido: string;
    publico: boolean;
    organizadores: string;
    galeria: string[];
}

// Tipo para la colección 'sala_museo' (según JSON proporcionado)
export interface SalaMuseo {
    id: string;
    collectionId: string; 
    titulo: string;
    resumen: string;
    contenido: string;
    portada: string; // filename
    galeria: string[];
    publico: boolean;
}
