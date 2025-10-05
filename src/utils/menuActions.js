export const menuActions = {
    estadistica: ({ navigate }) => {
        navigate("/estadistica")
    },
    ventas: ({ navigate }) => {
        navigate("/ventas");
    },
    ventasRealizadas: ({ navigate }) => {
        navigate("/facturas");
    },
    proformas: ({ navigate }) => {
        navigate("/proformas");
    },
    reportes: ({ navigate }) => {
        navigate("/reportes");
    },
    guia: ({ navigate }) => {
        navigate("/guia_remision");
    },
    cliente: ({ navigate }) => {
        navigate("/clientes");
    },
    producto: ({ navigate }) => {
        navigate("/productos");
    },
    configuracion: ({ navigate }) => {
        navigate("/configuracion");
    },
    ayuda: ({ navigate }) => {
        navigate("/");
    },
};

export const menuActionsConfig = {
    configurar_empresa: ({ navigate }) => {
        navigate("/configuracion/empresas");
    },
    configurar_usuario: ({ navigate }) => {
        navigate("/configuracion/usuarios");
    },
    configurar_almacen: ({ navigate }) => {
        navigate("/configuracion/almacenes");
    },
    configurar_sucursal: ({ navigate }) => {
        navigate("/configuracion/sucursales");
    },
    configurar_impresion: ({ navigate }) => {
        navigate("/configuracion/impresion");
    },
};

export const menuActionsReportes = {
    venta_reporte: ({ navigate }) => {
        navigate("/reportes/ventas_general");
    },
    venta_detallado_reporte: ({ navigate }) => {
        navigate("/reportes/ventas_detallado");
    },
    producto_listado: ({ navigate }) => {
        navigate("/reportes/productos");
    },
    cliente_proveedor_listado: ({ navigate }) => {
        navigate("/reportes/clientes_proveedores");
    },
    guia_reporte: ({ navigate }) => {
        navigate("/reportes/guia_remision");
    }
};
