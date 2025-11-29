// --- useModalInput (Tipos para los parámetros) ---
export type OnSaveCallback = (value: string) => void;

// --- useClienteSeleccionado ---
export interface Cliente {
  razonSocial?: string;
  nombre?: string;
  direccion?: string;
  documento?: string;
  documentoTipo?: string;
  email?: string;
  [key: string]: any;
}

export interface SpecialItem {
  __type: "header" | "tips";
  razonSocial?: never;
  documento?: never;
}

export type SuggestionItem = Cliente | SpecialItem;

// --- useProductosAgregados ---
export interface Producto {
  codigo: string | number;
  descripcion?: string;
  precio?: number;
  isc?: number;
  [key: string]: any;
}

export interface ProductoAgregado extends Producto {
  cantidad: number;
}
