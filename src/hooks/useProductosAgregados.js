import { useState, useCallback, useMemo } from "react";

export function useProductosAgregados(globalDiscountPercentage = 0) {
    const [productosAgregados, setProductosAgregados] = useState([]);

    const agregarProducto = useCallback((producto) => {
        if (!producto || !producto.codigo) return; 
        
        setProductosAgregados((prev) => {
            const existente = prev.find((p) => p.codigo === producto.codigo);
            if (existente) {
                return prev.map((p) =>
                    p.codigo === producto.codigo
                        ? { ...p, cantidad: (p.cantidad || 0) + 1 }
                        : p
                );
            }
            return [
                ...prev,
                {
                    ...producto,
                    precio: Number(producto.precio) || 0,
                    isc: Number(producto.isc) || 0, 
                    cantidad: 1
                }
            ];
        });
    }, []);

    const actualizarCantidad = useCallback((codigo, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        setProductosAgregados((prev) =>
            prev.map((p) =>
                p.codigo === codigo ? { ...p, cantidad: nuevaCantidad } : p
            )
        );
    }, []);

    const eliminarProducto = useCallback((codigo) => {
        setProductosAgregados((prev) =>
            prev.filter((p) => p.codigo !== codigo)
        );
    }, []);

    const totalSinDescuento = useMemo(
        () => productosAgregados.reduce(
            (sum, p) => sum + (Number(p.precio) || 0) * (Number(p.cantidad) || 0),
            0
        ),
        [productosAgregados]
    );

    const totalDescuentoGlobal = useMemo(() => {
        const discountRate = (Number(globalDiscountPercentage) || 0) / 100;
        return totalSinDescuento * discountRate;
    }, [totalSinDescuento, globalDiscountPercentage]);
    
    const totalGeneral = useMemo(
        () => totalSinDescuento - totalDescuentoGlobal,
        [totalSinDescuento, totalDescuentoGlobal]
    );

    // NUEVO: Cálculo del desglose de totales (Gravado, IGV, ISC, etc.)
    const totalsDesglose = useMemo(() => {
        const totalBaseConDscto = totalGeneral;
        
        // Simplificación: Asumimos que todo es Gravado y usamos IGV del 18%.
        const gravado = totalBaseConDscto / 1.18;
        const igv = totalBaseConDscto - gravado;
        
        // Sumamos el ISC que pueda venir precalculado en los ítems
        const totalISC = productosAgregados.reduce((sum, p) => 
            sum + (Number(p.isc) || 0) * (Number(p.cantidad) || 0), 0
        );

        return {
            anticipos: 0,
            dscto: totalDescuentoGlobal,
            gravado: gravado,
            exonerado: 0,
            inafecto: 0,
            exportacion: 0,
            gratuito: 0,
            isc: totalISC,
            igv: igv,
            rc: 0,
            icbper: 0,
        };
    }, [totalGeneral, totalDescuentoGlobal, productosAgregados]);
    
    // Función para calcular el descuento aplicado a un ítem individual
    const getDiscountedItem = useCallback((item) => {
        const subtotalSinDscto = (Number(item.precio) || 0) * (Number(item.cantidad) || 0);
        const discountRate = (Number(globalDiscountPercentage) || 0) / 100;
        
        const itemDiscount = subtotalSinDscto * discountRate;
        const totalConDescuento = subtotalSinDscto - itemDiscount;
        const precioUnitarioConDscto = totalConDescuento / (Number(item.cantidad) || 1);

        return {
            ...item,
            subtotal: subtotalSinDscto,
            descuentoAplicado: itemDiscount,
            precioUnitarioFinal: precioUnitarioConDscto,
            totalFinal: totalConDescuento,
        };
    }, [globalDiscountPercentage]);

    return {
        productosAgregados,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        getDiscountedItem,
        totalGeneral,
        totalsDesglose, // EXPORTADO EL NUEVO DESGLOSE
    };
}