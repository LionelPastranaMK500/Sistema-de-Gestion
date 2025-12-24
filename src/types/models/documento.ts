import { EstadoDocumento, EstadoEnvioSunat } from "./comunes";
import { UsuarioDto } from "./usuario";
import { DetalleVentaDto, DetalleVentaCreateDto } from "./ventas";
import {
  GuiaRemisionDto,
  GuiaRemisionCreateDto,
  GuiaRemisionUpdateDto,
} from "./guia";
import { ClienteSummaryDto } from "./cliente";
import { MonedaSummaryDto } from "./moneda";
import { SerieSummaryDto } from "./serie";
import { TipoDocumentoSummaryDto } from "./tipoDocumento";

// =============================================================================
// 1. BASE (Campos comunes mínimos)
// =============================================================================
interface DocumentoBase {
  fechaEmision: string; // LocalDate/LocalDateTime -> string ISO
  total: number; // BigDecimal -> number
  estado: EstadoDocumento;
  observaciones?: string;
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.DocumentoCreateDto
 */
export interface DocumentoCreateDto extends DocumentoBase {
  fechaVencimiento?: string;

  // IDs para relaciones
  clienteID: number;
  monedaID?: number;
  usuarioID?: number;
  reporteID?: number;
  ubigeoID?: number;
  tipoDocumentoID?: number;
  documentoNotasID?: number;

  // Objetos anidados
  guiaRemision?: GuiaRemisionCreateDto;
  listaDetallesVenta: DetalleVentaCreateDto[];
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.DocumentoUpdateDto
 */
export interface DocumentoUpdateDto {
  id: number; // Java: Long id
  fechaVencimiento?: string;
  observaciones?: string;
  estado?: EstadoDocumento;

  listaDetallesVenta?: DetalleVentaCreateDto[];
  guiaRemision?: GuiaRemisionUpdateDto;
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Detail)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.DocumentoDto
 * Usado en listados (Page<DocumentoDto>)
 */
export interface DocumentoDto {
  documentoID: number;
  fechaEmision: string; // LocalDateTime
  total: number;
  estado: EstadoDocumento;
  hash?: string;
  firma?: string;
  uuid?: string;
  sunatEstado?: EstadoEnvioSunat;
  sunatId?: string;

  // Relaciones (Summaries)
  cliente: ClienteSummaryDto;
  tipDocumento: TipoDocumentoSummaryDto;
  serSummaryDto: SerieSummaryDto;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.DocumentoDetailDto
 * Usado en vista individual (GET /id)
 */
export interface DocumentoDetailDto extends DocumentoBase {
  documentoID: number;
  fechaVencimiento?: string;

  // Campos de seguridad y SUNAT
  hash?: string;
  firma?: string;
  uuid?: string;
  urlArchivo?: string;
  sunatEstado?: EstadoEnvioSunat;
  sunatId?: string;
  sunatUltimoEnvio?: string;
  sunatIntentos?: number;
  sunatMensajeError?: string;
  cdrBase64?: string;

  // Relaciones (Complejos y Summaries)
  gremisionDto?: GuiaRemisionDto;
  monedaDto: MonedaSummaryDto;
  detallesDto: DetalleVentaDto[];

  tipDocumentoSummaryDto: TipoDocumentoSummaryDto;
  clienteSummaryDto: ClienteSummaryDto;
  usuarioDto: UsuarioDto;
  serieSummaryDto: SerieSummaryDto;
}

// =============================================================================
// 4. RESPUESTAS AUXILIARES (Response DTOs)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.response.DocumentoEmissionResponse
 */
export interface DocumentoEmissionResponse {
  documentoId: number;
  estadoDocumento: EstadoDocumento;
  estadoSunat: EstadoEnvioSunat;
  sunatId?: string;
  ticket?: string;
  creadoEn: string; // Instant -> string ISO
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.response.DocumentoCdrResponse
 */
export interface DocumentoCdrResponse {
  documentoId: number;
  nombreArchivo: string;
  cdrBase64: string;
  rutaArchivo: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.response.DocumentoEstadoResponse
 */
export interface DocumentoEstadoResponse {
  documentoId: number;
  estadoDocumento: EstadoDocumento;
  estadoSunat: EstadoEnvioSunat;
  sunatId?: string;
  ticket?: string;
  mensajeError?: string;
  intentos?: number;
  ultimoEnvio?: string; // LocalDateTime -> string ISO
  siguienteIntento?: string; // LocalDateTime -> string ISO
}
