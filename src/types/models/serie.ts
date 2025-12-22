// =============================================================================
// DTOs DE SERIE (Facturación / Guías)
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.SerieCreateDto
 */
export interface SerieCreateDto {
  serie: string; // Java: String serie (ej: "F001")
  inicialSerie: string; // Java: String inicialSerie (ej: "F")
  serieNumActual: number; // Java: Integer serieNumActual
}

/**
 * SIMPLE
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.SerieDto
 * Hereda los campos del Create y agrega el ID.
 */
export interface SerieDto extends SerieCreateDto {
  id: number; // Java: Integer id
}

/**
 * SUMMARY
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.SerieSummaryDto
 * Solo tiene ID y la serie.
 * Usamos Pick para tomar solo 'serie' del base y asegurarnos que coincida.
 */
export interface SerieSummaryDto extends Pick<SerieCreateDto, "serie"> {
  id: number; // Java: Integer id
}
