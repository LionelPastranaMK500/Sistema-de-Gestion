export { ventasService } from '../api/ventas.service';
export {
    handleEmitirVenta,
    handleConsultarEstado,
    handleDescargarCDR,
    handleAnularDocumento,
    prepararDatosVenta
} from './ventas.logic';
export {
    calcularValorVenta,
    calcularIGV,
    calcularItemTotal,
    calcularTotalesVenta,
    aplicarDescuentoItem,
    validarStock,
    formatearMoneda
} from './ventas.calculations';