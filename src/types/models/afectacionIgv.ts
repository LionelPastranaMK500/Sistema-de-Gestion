/**
 * BASE / CREATE
 * Espejo de: studios.tkoh.billing.dto.create.AfectacionIGVCreateDto
 * Define los campos base.
 */
export interface AfectacionIGVCreateDto {
  descripcion: string;
  codigoSUNAT: string;
  porcentajeIGV: number;
}

/**
 * SIMPLE DTO
 * Espejo de: studios.tkoh.billing.dto.simple.AfectacionIGVDto
 * Hereda todo del Create y solo agrega el ID específico.
 */
export interface AfectacionIGVDto extends AfectacionIGVCreateDto {
  tipoAfectacionIGVID: number; // Java: Long
}

/**
 * SUMMARY DTO
 * Espejo de: studios.tkoh.billing.dto.summary.AfectacionIGVSummaryDto
 * Es idéntico al DTO completo pero EXCLUYENDO 'porcentajeIGV'.
 * Usamos Omit para quitar lo que sobra.
 */
export interface AfectacionIGVSummaryDto
  extends Omit<AfectacionIGVDto, "porcentajeIGV"> {}
