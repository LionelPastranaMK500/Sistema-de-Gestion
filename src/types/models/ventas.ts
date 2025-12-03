// src/types/models/ventas.ts

// Enum para asegurar que enviamos los códigos correctos a Java/SUNAT
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

// Detalle de cada ítem (alineado con DetalleVentaCreateDto en Java)
export interface VentaDetallePayload {
  productoId: number;
  cantidad: number;
  precioUnitario: number; // Precio con IGV o sin IGV (depende de tu lógica de backend, usualmente unitario final)
  descuento?: number;
  // Campos calculados que el backend suele esperar para validar
  subtotal: number;
  igv: number;
  total: number;
  observacion?: string;
}

// EL PAYLOAD PRINCIPAL (Esto es lo que Java espera en @RequestBody)
export interface VentaPayload {
  // 1. Contexto de la transacción (CRÍTICO: Faltaba esto)
  sucursalId: number;
  usuarioId: number;

  // 2. Datos del Cliente
  clienteId: number;

  // 3. Configuración del Documento
  tipoDocumentoId: string; // "01", "03" (Debe coincidir con tus IDs de maestras en DB)
  serie?: string; // Opcional si el backend la autoselecciona, obligatorio si el front la elige
  monedaId: string; // "PEN"
  fechaEmision: string; // ISO String (YYYY-MM-DDTHH:mm:ss)
  fechaVencimiento?: string;

  // 4. Totales (Calculados en ventas.calculations.ts)
  opGravada: number;
  opExonerada: number;
  opInafecta: number;
  igv: number;
  total: number;
  totalDescuentos?: number;

  // 5. Detalles
  detalles: VentaDetallePayload[];

  // 6. Extras
  observaciones?: string;
  condicionPagoId?: number; // Contado/Crédito
  ordenCompra?: string;
  placaVehiculo?: string; // Si aplica
}

// La respuesta que devuelve el backend (DocumentoEmissionResponse)
export interface VentaResponse {
  documentoId: number;
  serie: string;
  correlativo: string;
  ticket?: string;
  estadoSunat: string; // ACEPTADO, RECHAZADO, PENDIENTE
  linkPdf?: string; // Si tu backend generara el link
}
