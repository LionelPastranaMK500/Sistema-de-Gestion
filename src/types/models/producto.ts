import {
  Moneda,
  UnidadMedida,
  AfectacionIGV,
  AfectacionISC,
  TipoProducto,
  EstadoStock,
  EstadoProducto,
} from "./comunes";

/**
 * Modelo Maestro de Producto (Lectura / Detail)
 * Refleja ProductoDetailDto.java
 */
export interface Producto {
  // Identificadores y Datos Base
  codigoProducto: string; // Parece ser el ID principal en tus DTOs
  codigoBarras?: string; // Estaba en Create, lo hacemos opcional aquí por si acaso
  nombreProducto: string;
  descripcion: string;
  categoria: string;

  // Precios y Stock
  precioVenta: number; // BigDecimal en Java -> number en TS
  precioTotal: number;
  stock: number;
  incluyeIGV: boolean;

  // Impuestos (Valores calculados o fijos)
  afectacionICBPER: number;
  afectacionIGVPorcentaje: number;
  afectacionISCPorcentaje: number;
  afectacionISCMontoFijo: number;
  afectacionISCFactorPublico: number;

  // Estados
  tipoProducto: TipoProducto;
  estadoStockProducto: EstadoStock;
  estadoProducto: EstadoProducto;

  // Relaciones (Objetos completos para lectura)
  moneda: Moneda;
  unidadMedida: UnidadMedida;
  afectacionIgv: AfectacionIGV;
  afectacionIsc: AfectacionISC;
}

/**
 * Payload para Crear/Editar Producto
 * Refleja ProductoCreateDto.java
 * Omitimos los objetos completos y agregamos los IDs necesarios para el backend.
 */
export interface ProductoPayload
  extends Omit<
    Producto,
    "moneda" | "unidadMedida" | "afectacionIgv" | "afectacionIsc"
  > {
  // Foreign Keys requeridas por el backend
  monedaId: number;
  unidadMedidaId: number;
  afectacionIgvId: number;
  afectacionIscId: number;
}
