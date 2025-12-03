import {
  Cliente,
  Producto,
  // Venta, // ELIMINADO: No existe en models
  Usuario,
  Sucursal,
  Almacen,
  Documento,
  GuiaRemision,
} from "../models";

// --- CLIENTES UI ---
export interface ClienteCardProps {
  cliente: Cliente;
  index: number;
}

export interface ClienteNuevoProps {
  onClose: () => void;
}

// --- VENTAS UI ---
export interface VentaComponentItem {
  name: string;
  action: string;
  isInput: boolean;
  placeholder?: string;
}

export interface BaseVentaModalProps {
  visible: boolean;
  onHide: () => void;
}

// Items específicos para la UI de Ventas (Estado local)
export interface DatoAdicionalItem {
  id?: string | number; // Reemplaza DynamicItem si no quieres importar de hooks
  titulo: string;
  descripcion: string;
}

// --- PRODUCTOS & GUÍAS UI ---
export interface AgregarProductoModalProps {
  onSelect?: (productos: Producto | Producto[]) => void;
  onClose?: () => void;
}

export interface ProductoGuiaUI extends Producto {
  cantidad: number | string;
  detalle?: string;
}

export interface GuiaRemisionItem {
  id?: string | number;
  tipo: string;
  serie: string;
  numero: string;
}

// --- MODALES DE DOCUMENTOS ---
export interface DocumentoModalProps {
  documento: Documento; // CORREGIDO: Solo Documento, Venta es redundante
  onClose: () => void;
}

export type FacturaModalProps = DocumentoModalProps;
export type ProformasModalProps = DocumentoModalProps;

export interface GuiaRemisionModalProps {
  guia: GuiaRemision;
  onClose: () => void;
}

// --- CONFIGURACIÓN UI ---
export interface ConfiguracionButtonsProps {
  query: string;
}

export interface ToggleSwitchProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface UsuarioDisplay extends Usuario {
  nombreCompleto?: string;
  alias?: string;
}

export interface UsuarioModalProps {
  visible: boolean;
  onHide: () => void;
  mode: "add" | "edit";
  userData?: UsuarioDisplay | null;
}

export interface SucursalModalProps {
  visible: boolean;
  onHide: () => void;
  mode?: "add" | "edit";
  sucursalData?: Sucursal | null;
}

export interface AlmacenModalProps {
  visible: boolean;
  onHide: (reload?: boolean) => void;
  mode?: "add" | "edit";
  data?: Almacen | null;
}
