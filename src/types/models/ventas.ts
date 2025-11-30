import { Cliente } from "./cliente";
import { Documento } from "./documento";

export interface DetalleVenta {
  id?: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  productoId?: number;
}

/**
 * Modelo Maestro de Venta (Lectura)
 * Refleja VentaDetailDto.java
 */
export interface Venta {
  fechaVenta: string; // LocalDateTime -> String
  montoTotal: number; // BigDecimal -> number
  estado: string;

  // Relaciones
  listadetalles: DetalleVenta[];
  doc_cliente: Cliente;
  documentoAsociado?: Documento;
}

/**
 * Payload para Crear Venta
 * Refleja VentaCreateDto.java
 */
export interface VentaPayload {
  fechaVenta: string | Date;
  montoTotal: number;
  estado: string;

  // CORRECCIÓN CRÍTICA: Java espera un objeto 'doc_cliente', no un ID suelto.
  // Enviamos al menos el RUC para que el backend lo mapee.
  doc_cliente: Partial<Cliente> & { numeroRuc: string };

  // Opcional: Si el backend llegara a aceptar detalles en el futuro
  listadetalles?: DetalleVenta[];
}
