// --- Entidades Core (Base Models) ---

export interface Cliente {
  id?: string | number;
  nombre?: string;
  razonSocial?: string;
  direccion: string;
  tipo: string;
  documentoTipo: string;
  documento: string;
  email: string;
  telefono?: string;
  observaciones?: string;
  [key: string]: any;
}

export interface Producto {
  id?: string | number;
  codigo: string;
  unidad: string;
  descripcion: string;
  precio: number;
  isc: number;
  moneda?: string;
  unidadMedida?: string;
  categoria?: string;
  stock?: number;
  [key: string]: any;
}

export interface Usuario {
  id?: string | number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  rol: string;
  [key: string]: any;
}

export interface Numeracion {
  tipo: string;
  serie: string;
  inicial: number;
}

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  vendedores: string[];
  almacenes: string[];
  isPrincipal: boolean;
  numeracion: Numeracion[];
}

export interface Almacen {
  id: string;
  nombre: string;
  direccion: string;
}

export interface ImpresionConfig {
  basica: {
    formatoDefecto: string;
    decimales: number;
    infoCabecera: string;
    cuentasBancarias: string;
    infoPiePagina: string;
  };
  formatos: {
    [key: string]: {
      disponibles: string[];
      visibles: string[];
    };
  };
}

export interface MontoVenta {
  total: number;
  gravado?: number;
  igv?: number;
  isc?: number;
  rc?: number;
  descuento?: number;
  exonerado?: number;
  inafecto?: number;
  moneda?: string;
  [key: string]: any;
}

export interface VentaGenerada {
  id: number;
  serie: string;
  numero: string;
  cliente: string;
  documentoTipo: string;
  documento: string;
  direccion: string;
  email: string;
  fecha: string | Date;
  monto: MontoVenta;
  tDocumento: string;
  state: string;
  items: any[];
  tipoOperacion: string;
  sucursal: string;
  usuario: string;
  placaVehiculo?: string;
  documentoAfectado?: string;
  motivo?: string;
  observaciones?: string;
  [key: string]: any;
}

// --- Entidades de Maestras y Otros Servicios ---

export interface Serie {
  id: number | string;
  nombre: string;
  [key: string]: any;
}

export interface Direccion {
  id: number | string;
  descripcion: string;
  [key: string]: any;
}

export interface TipoDocNota {
  id: number | string;
  codigo: string;
  descripcion: string;
}

export interface Chofer {
  id?: string | number;
  dni: string;
  nombre: string;
  licencia: string;
  [key: string]: any;
}

export interface Vehiculo {
  id?: string | number;
  placa: string;
  marca?: string;
  modelo?: string;
  [key: string]: any;
}

export interface GuiaRemision {
  id: number | string;
  serie: string;
  numero: string;
  fecha: string | Date;
  remitente: string;
  destinatario: string;
  [key: string]: any;
}
