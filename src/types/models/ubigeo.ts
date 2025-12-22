// =============================================================================
// DTOs DE UBIGEO (Departamento / Provincia / Distrito)
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.UbigeoCreateDto (Record)
 */
export interface UbigeoCreateDto {
  departamento: string; // Java: String
  provincia: string; // Java: String
  distrito: string; // Java: String
  codigoUbigeo: string; // Java: String
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.UbigeoDto
 * Hereda todo del Create y agrega el ID.
 */
export interface UbigeoDto extends UbigeoCreateDto {
  ubigeoId: number; // Java: Long ubigeoId
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.UbigeoSummaryDto
 * Solo tiene ID y el código (Java decidió no incluir los nombres aquí).
 */
export interface UbigeoSummaryDto {
  ubigeoId: number; // Java: Long ubigeoId
  codigoUbigeo: string; // Java: String
}
