import { ChangeEvent } from "react";
import { Almacen, Sucursal, Usuario } from "@/types/services";
import { DynamicItem } from "@/types/hooks/data";

// --- ConfiguracionButtons ---
export interface ConfiguracionButtonsProps {
  query: string;
}

export interface ConfigItem {
  name: string;
  action: string;
  icon: any;
  description?: string;
}

// --- ConfigurarEmpresa ---
export interface ToggleSwitchProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface CompanyFormData {
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  direccionFiscal: string;
  afectacionIGV: string;
  moneda: string;
  ventasSinStock: boolean;
  clienteAnonimo: string;
  cuentaDetraccion: string;
  registroMTC: string;
  [key: string]: any;
}

// --- ConfigurarUsuario / UsuarioModal ---
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

export interface UsuarioForm {
  email: string;
  rol: string | null;
  alias: string;
}

// --- ConfigurarImpresion ---
export interface ColumnsConfig {
  disponibles: string[];
  visibles: string[];
}

export interface ColumnaSelectorProps {
  formato: string;
  initialColumns: ColumnsConfig;
  onUpdate: (newCols: ColumnsConfig) => void;
  onSave: (formatoKey: string) => void;
}

// --- AlmacenModal ---
export interface AlmacenModalProps {
  visible: boolean;
  onHide: (reload?: boolean) => void;
  mode?: "add" | "edit";
  data?: Almacen | null;
}

export interface AlmacenForm {
  id?: string | number;
  nombre: string;
  direccion: string;
  [key: string]: any;
}

// --- AlmacenEliminarModal ---
export interface AlmacenEliminarModalProps {
  visible: boolean;
  onHide: (reload?: boolean) => void;
  onConfirm: () => void;
  almacenData: Almacen | null;
}

// --- SucursalModal ---
export interface SucursalForm {
  nombre: string;
  direccion: string;
  [key: string]: any;
}

export interface SucursalModalProps {
  visible: boolean;
  onHide: () => void;
  mode?: "add" | "edit";
  sucursalData?: Sucursal | null;
}

export interface AlmacenItem extends DynamicItem {
  nombre?: string;
}

// --- SucursalNumeracionModal ---
export interface NumeracionItem extends DynamicItem {
  tipo?: string;
  serie?: string;
  inicial?: number | string;
}

export interface SucursalNumeracionModalProps {
  visible: boolean;
  sucursal: Sucursal;
  onHide: () => void;
}
