// =============================================================================
// DTOs DE TIPO DE CLIENTE (ej: "Natural", "Jurídico", "Transportista")
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.TipoClienteCreateDto (Record)
 */
export interface TipoClienteCreateDto {
  codigoSUNAT: string; // Java: String
  tipoCliente: string; // Java: String
  descripcion: string; // Java: String
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.TipoClienteDto
 * Hereda todo del Create y agrega el ID.
 */
export interface TipoClienteDto extends TipoClienteCreateDto {
  tipoClienteID: number; // Java: Long tipoClienteID
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.TipoClienteSummaryDto
 * Solo tiene ID y el nombre del tipo.
 */
export interface TipoClienteSummaryDto
  extends Pick<TipoClienteCreateDto, "tipoCliente"> {
  tipoClienteID: number; // Java: Long tipoClienteID
}
