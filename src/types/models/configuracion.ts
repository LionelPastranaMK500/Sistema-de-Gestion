import { UsuarioSummary } from "./comunes";

// --- ALMACÉN ---
export interface DetalleAlmacen {
  id?: number;
  producto?: string;
  cantidad?: number;
}

export interface Almacen {
  id: number;
  nombre: string;
  direccion: string;
  detalleAlmacenes?: DetalleAlmacen[];
}

export interface AlmacenPayload
  extends Omit<Almacen, "id" | "detalleAlmacenes"> {}

// --- SUCURSAL ---
export interface SucursalComprobanteConfig {
  serie: string;
  tipoDocumentoId: number;
}

export interface SucursalConfigOptions {
  availableDocumentTypes: any[];
  availableSeries: any[];
}

export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
  vendedores: UsuarioSummary[];
  almacenes: Almacen[];
  comprobantes: any[];
  configOptions?: SucursalConfigOptions;
}

export interface SucursalPayload {
  nombre: string;
  direccion: string;
  usuariosIds: number[];
  almacenesIds: number[];
  comprobantes: SucursalComprobanteConfig[];
}

// --- CONFIGURACIÓN EMPRESA ---
export interface ConfiguracionEmpresa {
  id: number;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  direccionFiscal: string;
  logo?: string;
  certificadoDigital?: string;
  claveSol?: string;
  usuarioSol?: string;
}

export interface ConfiguracionEmpresaPayload
  extends Omit<ConfiguracionEmpresa, "id"> {}

// --- IMPRESIÓN ---
export interface Impresion {
  id: number;
  formato: "A4" | "TICKET" | "A5";
  cabecera?: string;
  piePagina?: string;
  mostrarLogo: boolean;
}

export interface ImpresionPayload extends Omit<Impresion, "id"> {}

// --- REPORTES ---
export interface Reporte {
  id: number;
  nombre: string;
  tipo: string;
  filtros: string;
  fechaCreacion: string;
}

export interface ReportePayload extends Omit<Reporte, "id" | "fechaCreacion"> {}

// --- CONFIGURACIÓN UI (Aquí vive ahora la interfaz) ---
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
