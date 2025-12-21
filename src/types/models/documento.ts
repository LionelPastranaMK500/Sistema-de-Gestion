import { EstadoDocumento, MonedaDto, ClienteSummaryDto } from "./comunes";
import { TipoDocumentoDto } from "./maestras";

/**
 * Espejo de: studios.tkoh.billing.dto.simple.DocumentoDto
 */
export interface DocumentoDto {
  id: number;
  serie: string;
  correlativo: string;
  fechaEmision: string;
  tipoDocumento: string;
  clienteNombre: string;
  totalVenta: number;
  estado: EstadoDocumento;
  xmlUrl?: string;
  pdfUrl?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.simple.DetalleDocumentoDto
 */
export interface DetalleDocumentoDto {
  id: number;
  productoId: number;
  productoCodigo: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  igv: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.detail.DocumentoDetailDto
 */
export interface DocumentoDetailDto {
  id: number;
  serie: string;
  correlativo: string;
  fechaEmision: string;

  tipoDocumento: TipoDocumentoDto;
  cliente: ClienteSummaryDto;
  moneda: MonedaDto;

  detalles: DetalleDocumentoDto[];

  opGravada: number;
  opExonerada: number;
  opInafecta: number;
  igv: number;
  totalVenta: number;

  observaciones: string;
  estado: EstadoDocumento;

  // URLs para descarga
  xmlUrl?: string;
  cdrUrl?: string;
  pdfUrl?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.DetalleDocumentoCreateDto
 */
export interface DetalleDocumentoCreateDto {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.DocumentoCreateDto
 */
export interface DocumentoCreateDto {
  clienteId: number;
  tipoDocumentoId: number;
  monedaId: number;
  serieId: number;

  fechaEmision: string;
  tipoCambio: number;
  observaciones?: string;

  detalles: DetalleDocumentoCreateDto[];

  formaPago?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.response.DocumentoEmissionResponse
 */
export interface DocumentoEmissionResponse {
  success: boolean;
  message: string;
  sunatTicket?: string;
  cdrUrl?: string;
  xmlUrl?: string;
  estadoSunat?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.response.DocumentoCdrResponse
 */
export interface DocumentoCdrResponse {
  estadoCdr: string;
  mensajeCdr: string;
  cdrFile?: string;
}
