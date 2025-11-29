export interface CatalogoItem {
  precio?: number;
  [key: string]: any;
}

export interface ItemCompra {
  precio: number;
  cantidad: number;
  afectoISC?: boolean;
  [key: string]: any;
}
