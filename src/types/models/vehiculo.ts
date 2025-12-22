import { ClienteSummaryDto } from "./cliente";
import { GuiaRemisionSummaryDto } from "./guia";
import { TipoVehiculo } from "./comunes"; // Asegúrate de tener este Enum en comunes

// =============================================================================
// 1. BASE (Campos mínimos comunes)
// =============================================================================
interface VehiculoBase {
  placa: string; // Java: String
  tarjetaUnicaCirculacion: string; // Java: String
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.VehiculoCreateDto
 * Nota: Es curioso que al crear NO pidas marca ni tipo, solo dueño y papeles.
 * Pero así está en tu Java, así lo respetamos.
 */
export interface VehiculoCreateDto extends VehiculoBase {
  clienteSummaryDto: ClienteSummaryDto;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.VehiculoUpdateDto
 */
export interface VehiculoUpdateDto extends VehiculoBase {
  id: number; // Java: Long id
  marca: string;
  tipovehiculo: TipoVehiculo;
  kilometrajeAnterior: string;
  kilometrajeProximo: string;

  // Relaciones
  choferesId: number[]; // Java: Set<Long>
  guiaSummaryDto: GuiaRemisionSummaryDto;
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.VehiculoSummaryDto
 */
export interface VehiculoSummaryDto extends VehiculoBase {
  id: number; // Java: Long id
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.VehiculoDto
 */
export interface VehiculoDto extends VehiculoBase {
  id: number; // Java: Long id
  marca: string;
  tipovehiculo: TipoVehiculo;
  kilometrajeAnterior: string;
  kilometrajeProximo: string;
}
