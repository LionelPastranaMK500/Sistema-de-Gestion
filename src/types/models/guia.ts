import {
  EstadoDocumento,
  ModalidadTransporte,
  PesoUnidad,
  TrasladoEstado,
} from "./comunes";

import { ClienteSummaryDto } from "./cliente";
import { UsuarioSummaryDto } from "./usuario";
import { TipoDocumentoSummaryDto } from "./tipoDocumento";
import { ProductoSummaryDto } from "./producto";
import { VehiculoCreateDto } from "./vehiculo";
import { SerieSummaryDto } from "./serie";
import { SucursalSummaryDto } from "./sucursal";

// =============================================================================
// 1. BASE (Campos comunes para Create, Update y Detail)
// =============================================================================
interface GuiaRemisionBase {
  fechaEmision: string; // LocalDateTime -> ISO string
  fechaEnvio: string; // LocalDateTime -> ISO string
  cantidad?: string;
  peso?: string;
  observaciones?: string;
  direccionOrigen: string;
  direccionDestino: string;
  datosTransportista: string;
  traEstado?: TrasladoEstado;
  estadoDoc?: EstadoDocumento;
  pesoUni: PesoUnidad;
  mod: ModalidadTransporte;
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.GuiaRemisionCreateDto
 */
export interface GuiaRemisionCreateDto extends GuiaRemisionBase {
  // IDs Relacionales
  usuarioID?: number;
  destinatarioID?: number;
  documentoID?: number;
  sucComprobanteConfigID?: number;
  tipoEnvioID?: number;

  // Listas de IDs (Sets en Java -> Arrays en TS)
  productoIds: number[];
  vehiculoIds: number[];
  choferIds: number[];

  // Objetos anidados para creación al vuelo
  vehiculos?: VehiculoCreateDto[];
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.GuiaRemisionUpdateDto
 * Hereda todo del Create y agrega el ID.
 */
export interface GuiaRemisionUpdateDto extends GuiaRemisionCreateDto {
  id: number; // Java: Long id
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Detail / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.GuiaRemisionDto
 * OJO: Este DTO en Java es diferente al Base (tiene menos campos),
 * así que lo definimos explícitamente.
 */
export interface GuiaRemisionDto {
  id: number;
  tipDocSummaryDto: TipoDocumentoSummaryDto;
  serSummaryDto: SerieSummaryDto;
  cliSummaryDto: ClienteSummaryDto;
  direccionOrigen: string;
  direccionDestino: string;
  usuarioID: number;
  fechaEmision: string;
  estado: EstadoDocumento;

  // Campos opcionales de UI (alias o calculados)
  pdfUrl?: string;
  xmlUrl?: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.GuiaRemisionDetailDto
 * Hereda los campos Base y agrega las relaciones completas (Summaries).
 */
export interface GuiaRemisionDetailDto extends GuiaRemisionBase {
  id: number;
  estado: EstadoDocumento; // Java tiene 'estado' Y 'estadoDoc'.

  // Relaciones (Summaries)
  usSummaryDto: UsuarioSummaryDto;
  sucSummaryDto: SucursalSummaryDto;
  tipDocSummaryDto: TipoDocumentoSummaryDto;
  serSummaryDto: SerieSummaryDto;
  cliSummaryDto: ClienteSummaryDto;

  productosDto: ProductoSummaryDto[]; // Java: Set<ProductoSummaryDto>
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.GuiaRemisionSummaryDto
 */
export interface GuiaRemisionSummaryDto {
  id: number;
  serieSummaryDto: SerieSummaryDto;
  tipSummaryDto: TipoDocumentoSummaryDto;
}
