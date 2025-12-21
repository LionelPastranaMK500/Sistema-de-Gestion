import { UsuarioSummaryDto } from "./comunes";

// Enums (Ajustar según los valores reales de tu backend Java)
export type FormatoImpresion = "A4" | "TICKET" | "A5" | string;
export type NumDecimalesMaximo = "DOS" | "CUATRO" | string;

/**
 * Espejo de: studios.tkoh.billing.dto.simple.ImpresionDto
 */
export interface ImpresionDto {
  id: number;
  formatoImpresionDefecto: FormatoImpresion;
  numDecimalesMaximo: NumDecimalesMaximo;
  infoCabecera: string;
  cuentaBancaria: string;
  infoPiePagina: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.detail.ImpresionDetailDto
 */
export interface ImpresionDetailDto extends ImpresionDto {
  usuarios: UsuarioSummaryDto[]; // Set<UsuarioSummaryDto> -> Array
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.ImpresionCreateDto
 */
export interface ImpresionCreateDto {
  formatoImpresionDefecto: FormatoImpresion;
  numDecimalesMaximo: NumDecimalesMaximo;
  infoCabecera?: string;
  cuentaBancaria?: string;
  infoPiePagina?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.update.ImpresionUpdateDto
 */
export interface ImpresionUpdateDto extends ImpresionCreateDto {
  id: number;
}
