import { TipoLicencia } from "./comunes";
import { GuiaRemisionSummaryDto } from "./guia";
import { ClienteSummaryDto } from "./cliente";

// =============================================================================
// 1. BASE (Helper para evitar repetir campos comunes)
// =============================================================================
/**
 * Campos comunes encontrados en Create, Update y Simple DTOs.
 */
interface ChoferBase {
  nombre: string;
  dni: string;
  telefono: string;
  tipolicencia: TipoLicencia;
  licencia: string;
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN Y LECTURA
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.ChoferCreateDto
 */
export interface ChoferCreateDto extends ChoferBase {
  clienteSummaryDto: ClienteSummaryDto;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ChoferDto
 * Hereda campos base y agrega el ID.
 */
export interface ChoferDto extends ChoferBase {
  id: number; // Java: Long id
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.ChoferSummaryDto
 * Solo tiene ID, licencia y tipo. Usamos Pick para reutilizar definiciones.
 */
export interface ChoferSummaryDto
  extends Pick<ChoferBase, "tipolicencia" | "licencia"> {
  id: number; // Java: Long id
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.ChoferUpdateDto
 */
export interface ChoferUpdateDto extends ChoferBase {
  id: number;
  vehiculoIds: number[];
  guiaSummaryDto: GuiaRemisionSummaryDto;
}
