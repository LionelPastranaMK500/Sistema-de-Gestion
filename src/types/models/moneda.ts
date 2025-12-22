// =============================================================================
// DTOs DE MONEDA
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.MonedaCreateDto (Java Record)
 */
export interface MonedaCreateDto {
  nombreMoneda: string; // Java: String
  simbolo: string; // Java: String
  codigoISO: string; // Java: String
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.MonedaDto
 * Hereda nombre, símbolo e ISO, agrega el ID.
 */
export interface MonedaDto extends MonedaCreateDto {
  monedaID: number; // Java: Long monedaID
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.MonedaSummaryDto
 * Solo tiene ID, nombre y símbolo. (NO tiene codigoISO).
 * Usamos Pick para asegurar coherencia con el Create.
 */
export interface MonedaSummaryDto
  extends Pick<MonedaCreateDto, "nombreMoneda" | "simbolo"> {
  monedaID: number; // Java: Long monedaID
}
