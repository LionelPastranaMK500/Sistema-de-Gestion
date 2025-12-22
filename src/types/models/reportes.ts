// =============================================================================
// DTOs PARA REPORTES (Excel / Pantalla de Reportes)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.filter.VentaReporteFilterDto
 * Filtros para buscar ventas en rangos de fecha o por entidad.
 */
export interface VentaReporteFilterDto {
  tipoDocumentoId?: number; // Java: Long
  sucursalId?: number; // Java: Long
  usuarioId?: number; // Java: Long
  monedaId?: number; // Java: Long
  clienteId?: number; // Java: Long
  fechaInicio: string; // Java: LocalDate -> ISO Date string (YYYY-MM-DD)
  fechaFin: string; // Java: LocalDate -> ISO Date string
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.report.VentaReporteDto
 * Objeto plano con TODOS los datos listos para mostrar o exportar.
 */
export interface VentaReporteDto {
  serie: string;
  numero: string;
  sucursal: string;
  clienteDoc: string;
  clienteNombre: string;
  fechaEmision: string; // LocalDateTime -> ISO string
  fechaVencimiento: string; // LocalDateTime -> ISO string
  fechaCreacion: string; // LocalDateTime -> ISO string
  usuario: string;
  placaVehiculo: string;
  ordenCompra: string;
  guiasRemision: string; // Concatenadas
  condicionPago: string;
  metodoPago: string;
  referencia: string;
  cuotas: string;
  observaciones: string;
  otros: string;
  moneda: string;

  // Montos (BigDecimal -> number)
  detraccion?: number;
  retencion?: number;
  percepcion?: number;
  rc?: number;
  descuento: number;
  gravado: number;
  exonerado: number;
  inafecto: number;
  exportacion: number;
  gratuito: number;
  igv: number;
  isc: number;
  icbper: number;
  total: number;

  anulado: string; // "SI" / "NO"
  estadoSunat: string; // "ACEPTADO", etc.
  mensajeSunat: string;
}
