// src/types/models/comunes.ts

// ==========================================
// 1. ENUMS (Espejo de studios.tkoh.billing.util.Enums)
// ==========================================

export type EstadoUsuario = "ACTIVO" | "INACTIVO" | "BLOQUEADO" | "PENDIENTE";

export type TipoLicencia =
  | "A_I"
  | "A_IIa"
  | "A_IIb"
  | "A_IIIa"
  | "A_IIIb"
  | "A_IIIc";

export type TipoVehiculo = "CAMION" | "AUTO" | "CAMIONETA" | "MOTO";
export type ModalidadTransporte = "TRANSPORTE_PUBLICO" | "TRANSPORTE_PRIVADO";
export type TrasladoEstado = "PROGRAMADO" | "EN_CAMINO" | "ENTREGADO";
export type PesoUnidad = "KGM" | "TNE";

export type EstadoDocumento =
  | "PENDIENTE"
  | "ENVIADO"
  | "ACEPTADO"
  | "RECHAZADO"
  | "ANULADO";

// Estos son vitales para Producto
export type TipoProducto = "BIEN" | "SERVICIO";
export type EstadoStockProducto = "DISPONIBLE" | "AGOTADO" | "POR_AGOTAR";
export type EstadoProducto = "ACTIVO" | "INACTIVO";

// ==========================================
// 2. DTOs REUTILIZABLES (Solo los que no tienen archivo propio)
// ==========================================

export interface MonedaDto {
  monedaID: number;
  nombreMoneda: string;
  simbolo: string;
  codigoISO: string;
}

export interface UnidadMedidaDto {
  unidadMedidaID: number;
  nombreUnidadMedida: string;
  abreviatura: string;
  codigoSUNAT: string;
}

// ==========================================
// 3. SUMMARIES (Espejos de dto.summary.*)
// ==========================================

export interface UsuarioSummaryDto {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  email: string;
}

export interface ClienteSummaryDto {
  id: number;
  razonSocial: string;
  numeroRuc: string;
}

export interface SucursalSummaryDto {
  id: number;
  nombre: string;
}

// Espejo de MonedaSummaryDto.java
export interface MonedaSummaryDto {
  monedaID: number; // Long -> number
  nombreMoneda: string;
  simbolo: string;
}

// Espejo de UnidadMedidaSummaryDto.java
export interface UnidadMedidaSummaryDto {
  unidadMedidaID: number; // Long -> number
  nombreUnidadMedida: string;
  abreviatura: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.MonedaCreateDto
 */
export interface MonedaCreateDto {
  nombreMoneda: string;
  simbolo: string;
  codigoISO: string;
}
