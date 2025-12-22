// =============================================================================
// 1. DTOs DE DIRECCIÓN (Basados en tu Java)
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.DireccionCreateDto
 */
export interface DireccionCreateDto {
  direccionAdicional: string; // Java: String direccionAdicional
  descripcion: string; // Java: String descripcion
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.DireccionDto
 * Hereda los campos del Create y agrega el ID.
 */
export interface DireccionDto extends DireccionCreateDto {
  id: number; // Java: Long id
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.DireccionSummaryDto
 * Solo tiene ID y la dirección (sin descripción).
 * Usamos Pick para tomar solo 'direccionAdicional' del base.
 */
export interface DireccionSummaryDto
  extends Pick<DireccionCreateDto, "direccionAdicional"> {
  id: number; // Java: Long id
}
