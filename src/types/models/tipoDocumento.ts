// =============================================================================
// DTOs DE TIPO DE DOCUMENTO (Factura, Boleta, Nota Crédito, etc.)
// =============================================================================

import { TipoDocNotaSummary } from "./tipoDocNota";
/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.TipoDocumentoCreateDto (Record)
 */
export interface TipoDocumentoCreateDto {
  codigoSUNAT: string; // Java: String (ej: "01", "03")
  tipoDocumento: string; // Java: String (ej: "FACTURA")
  descripcion: string; // Java: String
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.TipoDocumentoDto
 * Hereda todo del Create y agrega el ID.
 */
export interface TipoDocumentoDto extends TipoDocumentoCreateDto {
  tipoDocumentoID: number; // Java: Long tipoDocumentoID
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.TipoDocumentoSummaryDto
 * Solo tiene ID y el nombre del tipo.
 * Usamos Pick para tomar solo 'tipoDocumento' del base.
 */
export interface TipoDocumentoSummaryDto
  extends Pick<TipoDocumentoCreateDto, "tipoDocumento"> {
  tipoDocumentoID: number; // Java: Long tipoDocumentoID
}

/**
 * DETAIL
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.TipoDocumentoDetailDto
 * Hereda del Simple (tiene todos sus campos) y agrega la lista de notas.
 */
export interface TipoDocumentoDetailDto extends TipoDocumentoDto {
  notas: TipoDocNotaSummary[]; // Java: List<TipoDocNotaSummary>
}
