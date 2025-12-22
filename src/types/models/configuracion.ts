import { MonedaDto } from "./moneda";
import { AfectacionIGVDto } from "./afectacionIgv";
import { UsuarioSummaryDto } from "./usuario";

// =============================================================================
// 1. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.ConfiguracionEmpresaCreateDto
 * Usa IDs para las referencias.
 */
export interface ConfiguracionEmpresaCreateDto {
  usuarioId: number; // Java: Long usuarioId
  defaultAfectacionIgvId: number; // Java: Long defaultAfectacionIgvId
  defaultMonedaId: number; // Java: Long defaultMonedaId
  allowSalesWithoutStock: boolean; // Java: Boolean
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.ConfiguracionEmpresaUpdateDto
 * Hereda todos los campos de Create y agrega el ID.
 */
export interface ConfiguracionEmpresaUpdateDto
  extends ConfiguracionEmpresaCreateDto {
  id: number; // Java: Long id
}

// =============================================================================
// 2. DTOs DE LECTURA (Simple)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ConfiguracionEmpresaDto
 * OJO: Aquí NO heredamos de Create, porque este devuelve OBJETOS (MonedaDto),
 * mientras que Create usa IDs (defaultMonedaId).
 */
export interface ConfiguracionEmpresaDto {
  id: number;
  usuarioId: number;
  usuario: UsuarioSummaryDto; // Relación expandida (Summary)
  defaultAfectacionIgv: AfectacionIGVDto; // Relación expandida (Dto Completo)
  defaultMoneda: MonedaDto; // Relación expandida (Dto Completo)
  allowSalesWithoutStock: boolean;
}
