import { UsuarioSummaryDto, MonedaDto } from "./comunes";
import { AfectacionIGVDto } from "./afectacionIgv";

/**
 * Espejo de: studios.tkoh.billing.dto.simple.ConfiguracionEmpresaDto
 */
export interface ConfiguracionEmpresaDto {
  id: number;
  usuarioId: number;
  usuario: UsuarioSummaryDto;
  defaultAfectacionIgv: AfectacionIGVDto;
  defaultMoneda: MonedaDto;
  allowSalesWithoutStock: boolean;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.ConfiguracionEmpresaCreateDto
 */
export interface ConfiguracionEmpresaCreateDto {
  usuarioId: number;
  defaultAfectacionIgvId: number;
  defaultMonedaId: number;
  allowSalesWithoutStock: boolean;
}

/**
 * Espejo de: studios.tkoh.billing.dto.update.ConfiguracionEmpresaUpdateDto
 */
export interface ConfiguracionEmpresaUpdateDto
  extends ConfiguracionEmpresaCreateDto {
  id: number;
}
