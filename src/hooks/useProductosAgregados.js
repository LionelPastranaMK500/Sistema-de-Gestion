import { useState, useCallback, useMemo } from "react";

export function useProductosAgregados(globalDiscountPercentage = 0) {
    const [productosAgregados, setProductosAgregados] = useState([]);

    const agregarProducto = useCallback((producto) => {
        // FIX: Verificación defensiva para evitar crash si el producto es nulo o no tiene código
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
    
    // Calculates the total general after applying the global discount
    const totalGeneral = useMemo(
        () => totalSinDescuento - totalDescuentoGlobal,
        [totalSinDescuento, totalDescuentoGlobal]
    );
    
    // Función para calcular el descuento aplicado a un ítem individual
    const getDiscountedItem = useCallback((item) => {
        const subtotalSinDscto = (Number(item.precio) || 0) * (Number(item.cantidad) || 0);
        const discountRate = (Number(globalDiscountPercentage) || 0) / 100;
        
        // El descuento del ítem es proporcional al descuento global.
        const itemDiscount = subtotalSinDscto * discountRate;
        const totalConDescuento = subtotalSinDscto - itemDiscount;
        const precioUnitarioConDscto = totalConDescuento / (Number(item.cantidad) || 1);

        return {
            ...item,
            subtotal: subtotalSinDscto, // Total antes del descuento
            descuentoAplicado: itemDiscount, // Descuento aplicado (para mostrar en tabla/PDF)
            precioUnitarioFinal: precioUnitarioConDscto, // Precio por unidad después del descuento (útil para imprimir)
            totalFinal: totalConDescuento, // Total por item después del descuento
        };
    }, [globalDiscountPercentage]);

    return {
        productosAgregados,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        getDiscountedItem,
        totalGeneral,
    };
}