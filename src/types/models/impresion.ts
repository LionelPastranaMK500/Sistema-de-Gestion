import { UsuarioSummaryDto } from "./usuario";
import { FormatoImpresion, NumDecimalesMaximo } from "./comunes";

// =============================================================================
// 1. BASE (Campos comunes)
// =============================================================================

interface ImpresionBase {
  formatoImpresionDefecto: FormatoImpresion;
  numDecimalesMaximo: NumDecimalesMaximo;
  infoCabecera: string; // Java: String
  cuentaBancaria: string; // Java: String
  infoPiePagina: string; // Java: String
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.ImpresionCreateDto
 */
export interface ImpresionCreateDto extends ImpresionBase {
  // Hereda todo (formato, decimales, textos)
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.ImpresionUpdateDto
 */
export interface ImpresionUpdateDto extends ImpresionCreateDto {
  id: number; // Java: Integer id
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Detail / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ImpresionDto
 */
export interface ImpresionDto extends ImpresionBase {
  id: number; // Java: Integer id
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.ImpresionSummaryDto
 */
export interface ImpresionSummaryDto
  extends Pick<
    ImpresionBase,
    "formatoImpresionDefecto" | "numDecimalesMaximo"
  > {
  id: number; // Java: Integer id
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.ImpresionDetailDto
 */
export interface ImpresionDetailDto extends ImpresionDto {
  usuarios: UsuarioSummaryDto[]; // Java: Set<UsuarioSummaryDto>
}
