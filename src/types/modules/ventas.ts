import { DynamicItem } from "@/types/hooks/data";

// Definición para los items del menú de ventas
export interface VentaComponent {
  name: string;
  action: string;
  isInput: boolean;
  placeholder?: string;
}

// Props genéricos para los modales de ventas
export interface BaseVentaModalProps {
  visible: boolean;
  onHide: () => void;
}

// Interfaces específicas (extienden la base para mantener consistencia)
export interface CondicionPagoModalProps extends BaseVentaModalProps {}
export interface ObservacionesModalProps extends BaseVentaModalProps {}
export interface OrdenCompraModalProps extends BaseVentaModalProps {}
export interface PlacaModalProps extends BaseVentaModalProps {}
export interface DatosAdicionalesModalProps extends BaseVentaModalProps {}
export interface GuiaRemisionVentaModalProps extends BaseVentaModalProps {}

// Items para listas dinámicas dentro de los modales
export interface DatoItem extends DynamicItem {
  titulo: string;
  descripcion: string;
}

export interface GuiaItem extends DynamicItem {
  tipo: string;
  serie: string;
  numero: string;
  [key: string]: any;
}
