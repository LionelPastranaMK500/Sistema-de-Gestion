// =============================================================================
// DTOs DE TIPO DE ENVÍO (Para Guías de Remisión)
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.TipoEnvioCreateDto
 */
export interface TipoEnvioCreateDto {
  nombre: string; // Java: String
  descripcion: string; // Java: String
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.TipoEnvioDto
 * Hereda todo del Create y agrega el ID.
 */
export interface TipoEnvioDto extends TipoEnvioCreateDto {
  id: number; // Java: Integer id
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.TipoEnvioSummaryDto
 * Solo tiene ID y nombre.
 * Usamos Pick para tomar solo 'nombre' del base.
 */
export interface TipoEnvioSummaryDto
  extends Pick<TipoEnvioCreateDto, "nombre"> {
  id: number; // Java: Integer id
}
