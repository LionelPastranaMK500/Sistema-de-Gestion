// Importamos el Summary del padre (TipoDocumento) para el Detail
import { TipoDocumentoSummaryDto } from "./tipoDocumento";

// =============================================================================
// DTOs DE NOTAS (Crédito / Débito) RELACIONADAS A TIPO DE DOC
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.TipoDocNotaCreateDto
 */
export interface TipoDocNotaCreateDto {
  codigoSUNAT: string; // Java: String (ej: "07")
  tipoDocumento: string; // Java: String (ej: "Nota de Crédito")
  descripcion: string; // Java: String
  tipoDocId: number; // Java: Long tipoDocId (ID del padre)
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.TipoDocNotaDto
 * Hereda todo del Create y agrega el ID propio de la nota.
 */
export interface TipoDocNotaDto extends TipoDocNotaCreateDto {
  id: number; // Java: Integer id
}

/**
 * UPDATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.TipoDocNotaUpdateDto
 * Estructuralmente es idéntico al Simple/Dto.
 */
export interface TipoDocNotaUpdateDto extends TipoDocNotaCreateDto {
  id: number; // Java: Integer id
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.TipoDocNotaSummary (Record)
 * Solo tiene ID, código y tipo.
 * Usamos Pick para asegurar coherencia con el Create.
 */
export interface TipoDocNotaSummary
  extends Pick<TipoDocNotaCreateDto, "codigoSUNAT" | "tipoDocumento"> {
  id: number; // Java: Integer id
}

/**
 * DETAIL
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.TipoDocNotaDetailDto
 * OJO:
 * 1. Heredamos de Simple (Dto) para tener id, codigo, tipo, descripcion.
 * 2. EXCLUIMOS (Omit) 'tipoDocId' porque el Detail devuelve el objeto completo, no el ID.
 * 3. Agregamos 'tipDocSummary'.
 */
export interface TipoDocNotaDetailDto
  extends Omit<TipoDocNotaDto, "tipoDocId"> {
  tipDocSummary: TipoDocumentoSummaryDto; // Java: TipoDocumentoSummaryDto
}
