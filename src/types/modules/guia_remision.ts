import { Producto, VentaGenerada } from "@/types/services";

// --- GuiaRemisionNuevo ---
export interface ProductoGuia extends Producto {
  cantidad: number | string; // string temporalmente mientras se edita
  detalle?: string;
}

export interface GuiaRemisionNuevoProps {
  onClose: () => void;
}

// --- Components: GuiaRemisionModal ---
export interface GuiaRemisionModalProps {
  f: VentaGenerada;
  onClose: () => void;
}

// --- Components: AgregarProductoModal ---
export interface AgregarProductoModalProps {
  onSelect?: (productos: Producto | Producto[]) => void;
  onClose?: () => void;
}
