// 1. Servicio API (Comunicación HTTP)
export { ventasService } from "../api/ventas.service";

export { useCrearVentaLogic } from "./ventas.logic";

export {
  calcularValorVenta,
  calcularIGV,
  calcularItemTotal,
  validarStock,
  formatearMoneda,
} from "./ventas.calculations";

export { validarVenta, validarCantidadProducto } from "./validations";
