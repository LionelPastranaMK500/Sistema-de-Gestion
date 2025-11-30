import { Moneda, EstadoDocumento } from "./comunes";
import { ClienteSummary } from "./comunes";

/**
 * Modelo Maestro de Documento (Factura, Boleta, Nota)
 * Refleja DocumentoDetailDto.java
 */
export interface Documento {
  id: number;
  serie: string;
  correlativo: string;
  fechaEmision: string;
  fechaVencimiento: string;

  // Montos
  totalGravada: number;
  totalIgv: number;
  total: number;

  estado: EstadoDocumento;

  // Relaciones
  moneda: Moneda;
  cliente: ClienteSummary; // Usamos la versión ligera
  // detalles: DetalleDocumento[]; // Se define aquí o se importa
}

export interface DocumentoPayload
  extends Omit<Documento, "id" | "moneda" | "cliente" | "estado"> {
  clienteId: number;
  monedaId: number;
  tipoDocumentoId: number;
  items: any[]; // DetalleDocumentoPayload[]
}
