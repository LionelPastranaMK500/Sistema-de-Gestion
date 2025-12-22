// =============================================================================
// DTOs DE UNIDAD DE MEDIDA
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.UnidadMedidaCreateDto (Record)
 */
export interface UnidadMedidaCreateDto {
  nombreUnidadMedida: string; // Java: String
  abreviatura: string; // Java: String
  codigoSUNAT: string; // Java: String
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.UnidadMedidaDto
 * Hereda todos los campos del Create y agrega el ID.
 */
export interface UnidadMedidaDto extends UnidadMedidaCreateDto {
  unidadMedidaID: number; // Java: Long unidadMedidaID
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.UnidadMedidaSummaryDto
 * Solo tiene ID, nombre y abreviatura (NO tiene codigoSUNAT).
 * Usamos Pick para asegurar coherencia.
 */
export interface UnidadMedidaSummaryDto
  extends Pick<UnidadMedidaCreateDto, "nombreUnidadMedida" | "abreviatura"> {
  unidadMedidaID: number; // Java: Long unidadMedidaID
}
