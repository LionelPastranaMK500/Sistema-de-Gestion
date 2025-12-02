import { Producto } from "@/types/models";

export const IGV_RATE = 0.18;

export const calcularValorVenta = (precioConIgv: number): number => {
  return precioConIgv / (1 + IGV_RATE);
};

export const calcularIGV = (valorVenta: number): number => {
  return valorVenta * IGV_RATE;
};

export const calcularItemTotal = (cantidad: number, precioUnitario: number) => {
  const subtotal = cantidad * precioUnitario;
  const valorVenta = calcularValorVenta(subtotal);
  const igv = calcularIGV(valorVenta);

  return {
    cantidad,
    precioUnitario,
    valorVenta: Number(valorVenta.toFixed(2)),
    igv: Number(igv.toFixed(2)),
    total: Number(subtotal.toFixed(2)),
  };
};

export const validarStock = (
  producto: Producto,
  cantidadSolicitada: number
): boolean => {
  if (producto.stock === undefined || producto.stock === null) return true;
  return (producto.stock as number) >= cantidadSolicitada;
};

export const formatearMoneda = (monto: number | string): string => {
  return `S/ ${Number(monto).toFixed(2)}`;
};
