// app/flows/expediente/expediente.types.ts

/**
 * Estructura de la consulta legal. 
 * Crucial para el Matchmaker: 'categoria' y 'ubicacion'.
 */
export interface SeleccionCaso {
  categoria: string;
  ubicacion: string;
  tieneDocumentos: string;
  descripcion: string;
  audioUrl: string;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
}

/**
 * Respuesta desde el panel del abogado.
 */
export interface NotificacionCaso {
  activa: boolean;
  respuesta: string | null;
  monto: string | null;
  codigoExpediente: string | null;
}

/**
 * Estado global del Wizard.
 */
export interface EstadoExpediente {
  paso: number;
  cargando: boolean;
  grabando: boolean;
  isClient: boolean;
  casoIdGenerado: string | null;
  notificacion: NotificacionCaso;
  seleccion: SeleccionCaso;
}

/**
 * CONTRATO ÚNICO PARA LOS COMPONENTES DE PASOS
 * Esto es lo que evita los errores de TypeScript en tus archivos Paso1..Paso8
 */
export type PasoProps = {
  paso: number;
  seleccion: SeleccionCaso;
  setSeleccion: (x: SeleccionCaso) => void;
  navegarPaso: (p: number) => void;
  notificacion: NotificacionCaso;
  cargando: boolean;
  grabando: boolean;
  casoIdGenerado: string | null;
  // Acciones de negocio
  iniciarProcesoLegal?: () => void;
  finalizarRegistroOficial?: () => void;
  // Acciones de audio
  iniciarGrabacion?: () => void;
  detenerGrabacion?: () => void;
};