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

// NUEVO: Agregado para que compile DocumentoDto
export type EstadoEnvioSunat =
  | "PENDIENTE"
  | "ENVIADO"
  | "ACEPTADO"
  | "RECHAZADO"
  | "OBSERVADO"
  | "ANULADO"
  | "ERROR";

export type FormatoImpresion = "A4" | "TICKET" | "A5" | "A6" | string;

// Valores del Enum NumDecimalesMaximo
export type NumDecimalesMaximo = "DOS" | "CUATRO" | "SEIS" | string;
