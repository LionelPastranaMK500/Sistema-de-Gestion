// src/types/models/almacen.ts

// Importamos lo que pertenece al dominio de Producto
import { ProductoSummaryDto, ProductoCantidadDto } from "./producto";

// =============================================================================
// 1. DTOs PRINCIPALES DE ALMACÉN
// =============================================================================

/**
 * BASE / CREATE
 * Espejo de: studios.tkoh.billing.dto.create.AlmacenCreateDto
 */
export interface AlmacenCreateDto {
  nombre: string; // Java: String nombre
  direccion: string; // Java: String direccion
}

/**
 * SIMPLE
 * Espejo de: studios.tkoh.billing.dto.simple.AlmacenDto
 */
export interface AlmacenDto extends AlmacenCreateDto {
  almacenID: number; // Java: Long almacenID
}

/**
 * SUMMARY
 * Espejo de: studios.tkoh.billing.dto.summary.AlmacenSummaryDto
 */
export interface AlmacenSummaryDto extends Pick<AlmacenCreateDto, "nombre"> {
  id: number; // Java: Long id
}

/**
 * DETAIL
 * Espejo de: studios.tkoh.billing.dto.detail.AlmacenDetailDto
 */
export interface AlmacenDetailDto extends AlmacenCreateDto {
  id: number; // Java: Long id
  detalleAlmacenes: DetalleAlmacenDto[]; // Java: Set<DetalleAlmacenDto>
}

/**
 * REPORTE / CON PRODUCTOS
 * Espejo de: studios.tkoh.billing.dto.detail.AlmacenConProductosDto
 */
export interface AlmacenConProductosDto {
  almacenId: number; // Java: Long almacenId
  almacenNombre: string; // Java: String almacenNombre
  productos: ProductoCantidadDto[]; // ✅ Importado de producto.ts
}

// =============================================================================
// 2. DEPENDENCIAS INTERNAS (Nativas de Almacén)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.DetalleAlmacenDto
 * Se queda aquí porque es un detalle PROPIO del almacén.
 */
export interface DetalleAlmacenDto {
  detalleAlmacenID: number; // Java: Long detalleAlmacenID
  nombre: string; // Java: String nombre
  direccion: string; // Java: String direccion
  almacenDto: AlmacenDto; // Java: AlmacenDto (Recursivo)
  prodSummaryDto: ProductoSummaryDto[]; // ✅ Importado de producto.ts
}
