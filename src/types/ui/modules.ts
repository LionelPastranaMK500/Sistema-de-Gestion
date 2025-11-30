import {
  Cliente,
  Producto,
  Venta,
  Usuario,
  Sucursal,
  Almacen,
  Documento,
  GuiaRemision,
} from "../models";
import { DynamicItem } from "../hooks/data";

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

// Items específicos para la UI de Ventas (Estado local, no modelo de BD)
export interface DatoAdicionalItem extends DynamicItem {
  titulo: string;
  descripcion: string;
}

// --- PRODUCTOS & GUÍAS UI (Lo que faltaba) ---
export interface AgregarProductoModalProps {
  onSelect?: (productos: Producto | Producto[]) => void;
  onClose?: () => void;
}

// Interfaz para la lista de productos en la creación de Guía (extiende el modelo base con campos de UI)
export interface ProductoGuiaUI extends Producto {
  cantidad: number | string; // string temporal mientras el usuario escribe
  detalle?: string;
}

export interface GuiaRemisionItem extends DynamicItem {
  tipo: string;
  serie: string;
  numero: string;
}

// --- MODALES DE DOCUMENTOS ---
export interface DocumentoModalProps {
  documento: Documento | Venta;
  onClose: () => void;
}

export type FacturaModalProps = DocumentoModalProps;
export type ProformasModalProps = DocumentoModalProps;

export interface GuiaRemisionModalProps {
  guia: GuiaRemision; // Tipado fuerte con el modelo real
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
