import { NavigateFunction } from "react-router-dom";

interface MenuActionParams {
  navigate: NavigateFunction;
}

export const menuActions = {
  estadistica: ({ navigate }: MenuActionParams) => {
    navigate("/estadistica");
  },
  ventas: ({ navigate }: MenuActionParams) => {
    navigate("/ventas");
  },
  ventasRealizadas: ({ navigate }: MenuActionParams) => {
    navigate("/facturas");
  },
  proformas: ({ navigate }: MenuActionParams) => {
    navigate("/proformas");
  },
  reportes: ({ navigate }: MenuActionParams) => {
    navigate("/reportes");
  },
  guia: ({ navigate }: MenuActionParams) => {
    navigate("/guia_remision");
  },
  cliente: ({ navigate }: MenuActionParams) => {
    navigate("/clientes");
  },
  producto: ({ navigate }: MenuActionParams) => {
    navigate("/productos");
  },
  configuracion: ({ navigate }: MenuActionParams) => {
    navigate("/configuracion");
  },
  ayuda: ({ navigate }: MenuActionParams) => {
    navigate("/");
  },
};

export const menuActionsConfig = {
  configurar_empresa: ({ navigate }: MenuActionParams) => {
    navigate("/configuracion/empresa");
  },
  configurar_usuario: ({ navigate }: MenuActionParams) => {
    navigate("/configuracion/usuarios");
  },
  configurar_almacen: ({ navigate }: MenuActionParams) => {
    navigate("/configuracion/almacenes");
  },
  configurar_sucursal: ({ navigate }: MenuActionParams) => {
    navigate("/configuracion/sucursales");
  },
  configurar_impresion: ({ navigate }: MenuActionParams) => {
    navigate("/configuracion/impresion");
  },
};

export const menuActionsReportes = {
  venta_reporte: ({ navigate }: MenuActionParams) => {
    navigate("/reportes/ventas_general");
  },
  venta_detallado_reporte: ({ navigate }: MenuActionParams) => {
    navigate("/reportes/ventas_detallado");
  },
  producto_listado: ({ navigate }: MenuActionParams) => {
    navigate("/reportes/productos");
  },
  cliente_proveedor_listado: ({ navigate }: MenuActionParams) => {
    navigate("/reportes/clientes_proveedores");
  },
  guia_reporte: ({ navigate }: MenuActionParams) => {
    navigate("/reportes/guia_remision");
  },
};
