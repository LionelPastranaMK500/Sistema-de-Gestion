import {
  MonedaDto,
  MonedaSummaryDto,
  UnidadMedidaDto,
  UnidadMedidaSummaryDto,
  TipoProducto,
  EstadoStockProducto,
  EstadoProducto,
} from "./comunes";

import { AfectacionIGVDto } from "./afectacionIgv";
import { AfectacionISCDto } from "./afectacionIsc";

/**
 * Espejo de: studios.tkoh.billing.dto.simple.ProductoDto
 */
export interface ProductoDto {
  productoID: number;
  codigoProducto: string;
  codigoBarras: string;
  nombreProducto: string;
  descripcion: string;
  precioVenta: number;
  precioTotal: number;
  incluyeIGV: boolean;

  tipoProducto: TipoProducto;
  estadoStockProducto: EstadoStockProducto;

  afectacionICBPER: number;
  afectacionIGVPorcentaje: number;
  afectacionISCPorcentaje: number;
  afectacionISCMontoFijo: number;
  afectacionISCFactorPublico: number;

  categoria: string;
  stock: number;
  estadoProducto: EstadoProducto;

  moneda: MonedaSummaryDto;
  unidadMedida: UnidadMedidaSummaryDto;
  afectacionIgv: AfectacionIGVDto;
  afectacionIsc: AfectacionISCDto;
}

/**
 * Espejo de: studios.tkoh.billing.dto.detail.ProductoDetailDto
 * */
export interface ProductoDetailDto {
  codigoProducto: string;
  nombreProducto: string;
  descripcion: string;
  precioVenta: number;
  precioTotal: number;
  incluyeIGV: boolean;

  tipoProducto: TipoProducto;
  estadoStockProducto: EstadoStockProducto;

  afectacionICBPER: number;
  afectacionIGVPorcentaje: number;
  afectacionISCPorcentaje: number;
  afectacionISCMontoFijo: number;
  afectacionISCFactorPublico: number;

  categoria: string;
  stock: number;
  estadoProducto: EstadoProducto;

  moneda: MonedaDto;
  unidadMedida: UnidadMedidaDto;
  afectacionIgv: AfectacionIGVDto;
  afectacionIsc: AfectacionISCDto;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.ProductoCreateDto
 */
export interface ProductoCreateDto {
  codigoProducto: string;
  codigoBarras: string;
  nombreProducto: string;
  descripcion: string;
  precioVenta: number;
  precioTotal: number;
  incluyeIGV: boolean;

  tipoProducto: TipoProducto;
  estadoStockProducto: EstadoStockProducto;

  afectacionICBPER: number;
  afectacionIGVPorcentaje: number;
  afectacionISCPorcentaje: number;
  afectacionISCMontoFijo: number;
  afectacionISCFactorPublico: number;

  categoria: string;
  stock: number;
  estadoProducto: EstadoProducto;

  monedaId: number;
  unidadMedidaId: number;
  afectacionIgvId: number;
  afectacionIscId: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.update.ProductoUpdateDto
 */
export interface ProductoUpdateDto extends ProductoCreateDto {
  productoID: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.summary.ProductoSummaryDto
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
