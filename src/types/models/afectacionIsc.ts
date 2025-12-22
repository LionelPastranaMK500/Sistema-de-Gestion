/**
 * BASE / CREATE
 * Espejo de: studios.tkoh.billing.dto.create.AfectacionISCCreateDto
 */
export interface AfectacionISCCreateDto {
  descripcion: string;
  codigoSUNAT: string;
}

/**
 * SIMPLE DTO
 * Espejo de: studios.tkoh.billing.dto.simple.AfectacionISCDto
 * Hereda descripción y código, agrega el ID.
 */
export interface AfectacionISCDto extends AfectacionISCCreateDto {
  tipoAfectacionISCID: number; // Java: Long
}
