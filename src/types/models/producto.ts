import { EstadoProducto, EstadoStockProducto, TipoProducto } from "./comunes";

import { AfectacionIGVDto } from "./afectacionIgv";
import { AfectacionISCDto } from "./afectacionIsc";
import { MonedaDto, MonedaSummaryDto } from "./moneda";
import { UnidadMedidaDto, UnidadMedidaSummaryDto } from "./unidadMedida";

// =============================================================================
// 1. DTOs AUXILIARES
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ProductoCantidadDto
 * (Usado en reportes de almacén y otros)
 */
export interface ProductoCantidadDto {
  productoId: number; // Java: Long productoId
  productoNombre: string; // Java: String productoNombre
  stock: number; // Java: Integer stock
}

// =============================================================================
// 2. DTOs BASE (Campos comunes)
// =============================================================================

/**
 * Campos comunes que se repiten en casi todos los DTOs de producto.
 * (No es un DTO de Java, es un helper de TypeScript para herencia)
 */
interface ProductoBase {
  codigoProducto: string;
  nombreProducto: string;
  descripcion: string;
  precioVenta: number; // BigDecimal -> number
  precioTotal: number; // BigDecimal -> number
  incluyeIGV: boolean; // Boolean/boolean
  tipoProducto: TipoProducto;
  estadoStockProducto: EstadoStockProducto;
  afectacionICBPER: number;
  afectacionIGVPorcentaje: number;
  afectacionISCPorcentaje: number;
  afectacionISCMontoFijo: number;
  afectacionISCFactorPublico: number;
  categoria: string;
  stock: number; // Integer -> number
  estadoProducto: EstadoProducto;
  codigoBarras?: string; // Opcional porque Detail NO lo tiene en tu Java
}

// =============================================================================
// 3. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.ProductoCreateDto
 * Usa IDs para las relaciones.
 */
export interface ProductoCreateDto extends ProductoBase {
  // En Java CreateDto SÍ tiene codigoBarras, así que lo aseguramos
  codigoBarras: string;

  // Relaciones por ID
  monedaId: number;
  unidadMedidaId: number;
  afectacionIgvId: number;
  afectacionIscId: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.ProductoUpdateDto
 * Hereda de CreateDto pero agrega el ID del producto.
 */
export interface ProductoUpdateDto extends ProductoCreateDto {
  productoID: number; // Java: Long productoID
}

// =============================================================================
// 4. DTOs DE LECTURA (Simple / Detail / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ProductoDto
 * Usa Summaries para Moneda y UnidadMedida, y DTOs completos para Afectaciones.
 */
export interface ProductoDto extends ProductoBase {
  productoID: number;
  codigoBarras: string; // En Simple SÍ está

  // Relaciones (Objetos, no IDs)
  moneda: MonedaSummaryDto;
  unidadMedida: UnidadMedidaSummaryDto;
  afectacionIgv: AfectacionIGVDto; // DTO Completo según tu Java
  afectacionIsc: AfectacionISCDto; // DTO Completo según tu Java
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.ProductoDetailDto
 * CUIDADO: En tu Java Detail NO tiene productoID ni codigoBarras.
 * Usa DTOs completos (MonedaDto, UnidadMedidaDto) en vez de Summaries.
 */
export interface ProductoDetailDto extends Omit<ProductoBase, "codigoBarras"> {
  // No tiene ID según tu código Java
  // No tiene codigoBarras según tu código Java

  // Relaciones (DTOs Completos según tu Java)
  moneda: MonedaDto;
  unidadMedida: UnidadMedidaDto;
  afectacionIgv: AfectacionIGVDto;
  afectacionIsc: AfectacionISCDto;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.ProductoSummaryDto
 * Estructura reducida para listados rápidos.
 */
export interface ProductoSummaryDto {
  productoID: number;
  codigoProducto: string;
  codigoBarras: string;
  nombreProducto: string;
  categoria: string;
  precioVenta: number;
  incluyeIGV: boolean;

  monedaSummaryDto: MonedaSummaryDto;
  unidadMedidaSummaryDto: UnidadMedidaSummaryDto;
}
