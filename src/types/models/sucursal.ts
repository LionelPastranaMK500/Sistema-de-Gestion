import { UsuarioSummaryDto } from "./usuario";
import { AlmacenSummaryDto } from "./almacen";
import { SerieDto, SerieSummaryDto } from "./serie";
import {
  TipoDocumentoSummaryDto,
  TipoDocumentoDetailDto,
} from "./tipoDocumento";

// =============================================================================
// 1. DTOs AUXILIARES
// =============================================================================

/**
 * Espejo de: studios.tkoh.billing.dto.command.SucursalComprobanteConfigCommandDto
 */
export interface SucursalComprobanteConfigCommandDto {
  tipoDocumentoId: number;
  serieId: number;
  usarComoDefecto?: boolean;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.Sucursal_ComprobanteDto
 * (Confirmado: usa SerieDto completo, no summary)
 */
export interface Sucursal_ComprobanteDto {
  id: number;
  tipoDocumento: TipoDocumentoSummaryDto;
  serie: SerieDto;
}

/**
 * Espejo de la clase estática: SucursalDetailDto.ConfigOptionsDto
 */
export interface ConfigOptionsDto {
  availableDocumentTypes: TipoDocumentoDetailDto[];
  availableSeries: SerieSummaryDto[];
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

interface SucursalBase {
  nombre: string;
  direccion: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.SucursalCreateUpdateDto
 * (El que te habías olvidado: Versión simplificada SIN comprobantes)
 */
export interface SucursalCreateUpdateDto extends SucursalBase {
  usuariosIds: number[]; // Java: Set<Long>
  almacenesIds: number[]; // Java: Set<Long>
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.SucursalCreateDto
 * (Versión completa CON comprobantes)
 */
export interface SucursalCreateDto extends SucursalCreateUpdateDto {
  // Hereda nombre, direccion, usuariosIds, almacenesIds
  comprobantes: SucursalComprobanteConfigCommandDto[];
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.SucursalUpdateDto
 * (Versión completa CON comprobantes + ID)
 */
export interface SucursalUpdateDto extends SucursalCreateDto {
  id: number;
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Detail / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.SucursalSummaryDto
 */
export interface SucursalSummaryDto extends SucursalBase {
  id: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.SucursalDto
 */
export interface SucursalDto extends SucursalBase {
  id: number;

  vendedores: UsuarioSummaryDto[];
  almacenes: AlmacenSummaryDto[];
  comprobantes: Sucursal_ComprobanteDto[];
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.SucursalDetailDto
 */
export interface SucursalDetailDto extends SucursalDto {
  configOptions: ConfigOptionsDto;
}
