import { useState, useCallback, useMemo } from "react";

export function useProductosAgregados() {
    const [productosAgregados, setProductosAgregados] = useState([]);

    const agregarProducto = useCallback((producto) => {
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

    const totalGeneral = useMemo(
        () => productosAgregados.reduce(
            (sum, p) => sum + (Number(p.precio) || 0) * (Number(p.cantidad) || 0),
            0
        ),
        [productosAgregados]
    );

    return {
        productosAgregados,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        totalGeneral,
    };
}
