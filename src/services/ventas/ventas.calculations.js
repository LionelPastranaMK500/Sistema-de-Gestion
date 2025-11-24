export const calcularValorVenta = (precioConIgv) => {
    return precioConIgv / (1 + IGV_RATE);
};

export const calcularIGV = (valorVenta) => {
    return valorVenta * IGV_RATE;
};

export const calcularItemTotal = (cantidad, precioUnitario) => {
    const subtotal = cantidad * precioUnitario;
    const valorVenta = calcularValorVenta(subtotal);
    const igv = calcularIGV(valorVenta);

    return {
        cantidad,
        precioUnitario,
        valorVenta: Number(valorVenta.toFixed(2)),
        igv: Number(igv.toFixed(2)),
        total: Number(subtotal.toFixed(2))
    };
};

export const calcularTotalesVenta = (items, descuentoGlobal = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const descuento = (subtotal * descuentoGlobal) / 100;
    const subtotalConDescuento = subtotal - descuento;

    const valorVenta = calcularValorVenta(subtotalConDescuento);
    const igv = calcularIGV(valorVenta);
    const total = valorVenta + igv;

    return {
        subtotal: Number(subtotal.toFixed(2)),
        descuento: Number(descuento.toFixed(2)),
        valorVenta: Number(valorVenta.toFixed(2)),
        igv: Number(igv.toFixed(2)),
        total: Number(total.toFixed(2))
    };
};

export const aplicarDescuentoItem = (item, porcentajeDescuento) => {
    const descuento = (item.total * porcentajeDescuento) / 100;
    const nuevoTotal = item.total - descuento;

    return {
        ...item,
        descuento: Number(descuento.toFixed(2)),
        total: Number(nuevoTotal.toFixed(2))
    };
};

export const validarStock = (producto, cantidadSolicitada) => {
    if (!producto.stock) return true;
    return producto.stock >= cantidadSolicitada;
};

export const formatearMoneda = (monto) => {
    return `S/ ${Number(monto).toFixed(2)}`;
};