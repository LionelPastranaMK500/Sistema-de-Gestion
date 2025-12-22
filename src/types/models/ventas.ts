// =============================================================================
// 1. DTOs DE DETALLE (Ítems individuales)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.DetalleVentaCreateDto
 * Usado dentro de DocumentoCreateDto y VentaCreateDto
 */
export interface DetalleVentaCreateDto {
  nombreProducto: string; // @NotBlank
  cantidad: number; // BigDecimal -> number
  precioUnitario: number; // BigDecimal -> number
  descuento: number; // BigDecimal -> number
  productoID?: number; // Java: Long (Puede ser null si es producto libre)
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.DetalleVentaDto
 * Este es el que reemplaza a "DetalleDocumento" cuando sale hacia el frontend.
 */
export interface DetalleVentaDto {
  detalleDocumentoID: number; // Java: Long
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  productoID: number;
  documentoID: number;
}

// =============================================================================
// 2. DTOs DE VENTA (Gestión Interna / Cabeceras)
// =============================================================================

interface VentaBase {
  fechaVenta: string; // Date/LocalDateTime -> ISO string
  montoTotal: number; // BigDecimal/double -> number
  estado: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.VentaDto
 */
export interface VentaDto extends VentaBase {
  ventaID: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.VentaSummaryDto
 */
export interface VentaSummaryDto extends VentaBase {
  ventaID: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.VentaCreateDto
 */
export interface VentaCreateDto extends VentaBase {
  // Java: private Cliente doc_cliente;
  // Al ser la Entidad completa y no un DTO, definimos any para evitar bloqueos.
  doc_cliente: any;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.VentaUpdateDto
 */
export interface VentaUpdateDto extends VentaBase {
  // Java: private Set<DetalleDocumento> listadetalles;
  // Mapeamos la entidad DetalleDocumento a su representación DTO más cercana.
  listadetalles: DetalleVentaDto[];
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.VentaDetailDto
 */
export interface VentaDetailDto extends VentaBase {
  listadetalles: DetalleVentaDto[]; // Java: Set<DetalleDocumento>
  doc_cliente: any; // Java: Cliente
}

// =============================================================================
// 3. HELPERS DE UI (Para formularios y lógica de frontend)
// =============================================================================

export enum TipoDocumentoCodigo {
  FACTURA = "01",
  BOLETA = "03",
  NOTA_CREDITO = "07",
  NOTA_DEBITO = "08",
}

export enum MonedaCodigo {
  SOLES = "PEN",
  DOLARES = "USD",
}

// Payload interno para el manejo del formulario en React
export interface VentaDetallePayload {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  descuento?: number;
  subtotal: number;
  igv: number;
  total: number;
  observacion?: string;
}

export interface VentaPayload {
  sucursalId: number;
  usuarioId: number;
  clienteId: number;
  tipoDocumentoId: string;
  serie?: string;
  monedaId: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  opGravada: number;
  opExonerada: number;
  opInafecta: number;
  igv: number;
  total: number;
  totalDescuentos?: number;
  detalles: VentaDetallePayload[];
  observaciones?: string;
  condicionPagoId?: number;
  ordenCompra?: string;
  placaVehiculo?: string;
}

export interface VentaResponse {
  documentoId: number;
  serie: string;
  correlativo: string;
  ticket?: string;
  estadoSunat: string;
  linkPdf?: string;
}
