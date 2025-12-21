import {
  EstadoDocumento,
  ModalidadTransporte,
  PesoUnidad,
  TrasladoEstado,
  UsuarioSummaryDto,
  SucursalSummaryDto,
  ClienteSummaryDto,
} from "./comunes";

import { SerieSummaryDto, TipoDocumentoSummaryDto } from "./maestras";
import { ProductoSummaryDto } from "./producto";
import { VehiculoCreateDto } from "./transporte";

/**
 * Espejo de: studios.tkoh.billing.dto.simple.GuiaRemisionDto
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
  // Campos opcionales para UI
  pdfUrl?: string;
  xmlUrl?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.detail.GuiaRemisionDetailDto
 */
export interface GuiaRemisionDetailDto {
  id: number;
  fechaEmision: string;
  fechaEnvio: string;
  cantidad: string;
  peso: string;
  observaciones: string;
  direccionOrigen: string;
  direccionDestino: string;
  datosTransportista: string;

  traEstado: TrasladoEstado;
  estadoDoc: EstadoDocumento;
  pesoUni: PesoUnidad;
  mod: ModalidadTransporte;
  estado: EstadoDocumento;

  usSummaryDto: UsuarioSummaryDto;
  sucSummaryDto: SucursalSummaryDto;
  tipDocSummaryDto: TipoDocumentoSummaryDto;
  serSummaryDto: SerieSummaryDto;
  cliSummaryDto: ClienteSummaryDto;

  productosDto: ProductoSummaryDto[];
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.GuiaRemisionCreateDto
 */
export interface GuiaRemisionCreateDto {
  fechaEmision: string;
  fechaEnvio: string;
  cantidad?: string;
  peso?: string;
  observaciones?: string;

  direccionOrigen: string;
  direccionDestino: string;
  datosTransportista?: string;

  traEstado?: TrasladoEstado;
  estadoDoc?: EstadoDocumento;
  pesoUni: PesoUnidad;
  mod: ModalidadTransporte;

  usuarioID?: number;
  destinatarioID?: number;
  documentoID?: number;
  sucComprobanteConfigID?: number;
  tipoEnvioID?: number;

  productoIds: number[];
  vehiculoIds: number[];
  choferIds: number[];

  // Vehículos nuevos al vuelo
  vehiculos?: VehiculoCreateDto[];
}

/**
 * Espejo de: studios.tkoh.billing.dto.update.GuiaRemisionUpdateDto
 */
export interface GuiaRemisionUpdateDto extends GuiaRemisionCreateDto {
  id: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.summary.GuiaRemisionSummaryDto
 */
export interface GuiaRemisionSummaryDto {
  id: number;
  serieSummaryDto: SerieSummaryDto;
  tipSummaryDto: TipoDocumentoSummaryDto;
}
