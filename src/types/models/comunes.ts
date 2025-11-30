// --- ENUMS DEL SISTEMA (Reflejan studios.tkoh.billing.util.Enums) ---

// Usuarios y Transporte
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

// Documentos
export type EstadoDocumento =
  | "PENDIENTE"
  | "ENVIADO"
  | "ACEPTADO"
  | "RECHAZADO"
  | "ANULADO";

// --- LO QUE FALTABA (Productos e Inventario) ---
export type TipoProducto = "BIEN" | "SERVICIO";
export type EstadoStock = "DISPONIBLE" | "AGOTADO" | "POR_AGOTAR";
export type EstadoProducto = "ACTIVO" | "INACTIVO";

// --- INTERFACES BÁSICAS COMUNES ---

export interface Moneda {
  monedaID: number;
  nombreMoneda: string;
  simbolo: string;
  codigoISO: string;
}

export interface UnidadMedida {
  unidadMedidaID: number;
  nombreUnidadMedida: string;
  abreviatura: string;
  codigoSUNAT: string;
}

// --- LO QUE FALTABA (Impuestos) ---
export interface AfectacionIGV {
  tipoAfectacionIGVID: number; // o 'id' dependiendo del DTO
  descripcion: string;
  codigoSUNAT: string;
  porcentajeIGV: number;
}

export interface AfectacionISC {
  tipoAfectacionISCID: number; // o 'id' dependiendo del DTO
  descripcion: string;
  codigoSUNAT: string;
}

// --- SUMMARIES (Versiones ligeras) ---

export interface UsuarioSummary {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  email: string;
}

export interface ClienteSummary {
  id: number;
  razonSocial: string;
  numeroRuc: string;
}

export interface SucursalSummary {
  id: number;
  nombre: string;
}
