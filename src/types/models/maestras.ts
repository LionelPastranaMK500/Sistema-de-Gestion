// src/types/models/maestras.ts

/**
 * Espejo de: studios.tkoh.billing.dto.simple.TipoDocumentoDto
 */
export interface TipoDocumentoDto {
  tipoDocumentoID: number; // Long -> number
  codigoSUNAT: string;
  tipoDocumento: string;
  descripcion: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.summary.TipoDocumentoSummaryDto
 */
export interface TipoDocumentoSummaryDto {
  tipoDocumentoID: number;
  tipoDocumento: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.simple.SerieDto
 */
export interface SerieDto {
  id: number;
  serie: string;
  inicialSerie: string;
  serieNumActual: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.summary.SerieSummaryDto
 */
export interface SerieSummaryDto {
  id: number;
  serie: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.TipoClienteDto
 *
 */
export interface TipoClienteDto {
  tipoClienteID: number; // Long -> number
  codigoSUNAT: string;
  tipoCliente: string;
  descripcion: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.TipoClienteCreateDto
 *
 */
export interface TipoClienteCreateDto {
  codigoSUNAT: string;
  tipoCliente: string;
  descripcion: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.TipoClienteSummaryDto
 *
 */
export interface TipoClienteSummaryDto {
  tipoClienteID: number;
  tipoCliente: string;
}

export interface TipoEnvioDto {
  id: number;
  codigo: string;
  descripcion: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.simple.SerieDto
 */
export interface SerieDto {
  id: number;
  serie: string;
  inicialSerie: string;
  serieNumActual: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.SerieCreateDto
 */
export interface SerieCreateDto {
  serie: string;
  inicialSerie: string;
  serieNumActual: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.summary.SerieSummaryDto
 */
export interface SerieSummaryDto {
  id: number;
  serie: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.TipoDocNotaDto
 *
 */
export interface TipoDocNotaDto {
  id: number; // Integer -> number
  codigoSUNAT: string;
  tipoDocumento: string;
  descripcion: string;
  tipoDocId: number; // Long -> number
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.TipoDocNotaCreateDto
 *
 */
export interface TipoDocNotaCreateDto {
  codigoSUNAT: string;
  tipoDocumento: string;
  descripcion?: string;
  tipoDocId: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.TipoDocNotaUpdateDto
 *
 */
export interface TipoDocNotaUpdateDto {
  id: number;
  codigoSUNAT?: string;
  tipoDocumento?: string;
  descripcion?: string;
  tipoDocId?: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.TipoDocNotaSummary
 *
 */
export interface TipoDocNotaSummary {
  id: number;
  codigoSUNAT: string;
  tipoDocumento: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.TipoDocNotaDetailDto
 *
 */
export interface TipoDocNotaDetailDto {
  id: number;
  codigoSUNAT: string;
  tipoDocumento: string;
  descripcion: string;
  tipDocSummary: TipoDocumentoSummaryDto; // Objeto anidado
}
