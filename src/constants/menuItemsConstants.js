import * as I from "./iconsConstants";

export const menuItems = [
    { name: "Estadisticas", action: "estadistica", icon: I.PollIcon },
    { name: "Realizar Venta", action: "ventas", icon: I.ShoppingCartIcon },
    { name: "Ventas Realizadas", action: "ventasRealizadas", icon: I.ReceiptIcon },
    { name: "Proformas", action: "proformas", icon: I.AssignmentIcon },
    { name: "Reportes", action: "reportes", icon: I.AssessmentIcon },
    { name: "Guias de Remision", action: "guia", icon: I.FilePresentIcon },
    { name: "Clientes y Proveedores", action: "cliente", icon: I.PeopleIcon },
    { name: "Productos y Servicios", action: "producto", icon: I.InventoryIcon },
    { name: "Configuración", action: "configuracion", icon: I.SettingsIcon },
];

export const menuItemsFactura = [
    { name: "Registrar nuevo", icon: I.AddIcon },
    { name: "Buscar comprobante", icon: I.SearchIcon },
    { name: "Ver resumen del dia", icon: I.ReceiptLongIcon },
];

export const menuItemsProformas = [
    { name: "Registrar nuevo", icon: I.AddIcon },
    { name: "Buscar comprobante", icon: I.SearchIcon },
    { name: "Ver resumen del dia", icon: I.ReceiptLongIcon },
];

export const componentsVentas = [
    { name: "PLACA", action: "placa", isInput: true, placeholder: "PLACA VEHICULO" },
    { name: "O. COMPRA", action: "ordenCompra", isInput: true, placeholder: "ORDEN DE COMPRA" },
    { name: "G. REMISIÓN", action: "guia", isInput: false },
    { name: "OBSERVACIONES", action: "observaciones", isInput: true, placeholder: "OBSERVACIONES" },
    { name: "D. ADICIONALES", action: "adicionales", isInput: false },
    { name: "COND. PAGO", action: "condicionPago", isInput: false }
];


export const menuItemsReportes = [
    { name: "Ventas", description: "Reporte General", action: "venta_reporte", icon: I.RealEstateAgentIcon },
    { name: "Ventas", description: "Reporte Detallado", action: "venta_detallado_reporte", icon: I.RealEstateAgentIcon },
    { name: "Productos", description: "Listado", action: "producto_listado", icon: I.InventoryIcon },
    { name: "Cliente/Proveedores", description: "Listado", action: "cliente_proveedor_listado", icon: I.PeopleAltIcon },
    { name: "Guias de Remisión", description: "Reporte General", action: "guia_reporte", icon: I.FilePresentIcon },
];

export const menuItemsConfig = [
    { name: "Empresa", action: "configurar_empresa", icon: I.BusinessIcon },
    { name: "Usuarios", action: "configurar_usuario", icon: I.PeopleAltIcon },
    { name: "Almacenes", action: "configurar_almacen", icon: I.InventoryIcon },
    { name: "Sucursales", action: "configurar_sucursal", icon: I.StoreIcon },
    { name: "Impresión", action: "configurar_impresion", icon: I.LocalPrintshopIcon },
];

export const guiaTabsGuiaRemision = [
    { name: "Información Básica", action: "infoBasica", icon: I.PermIdentityTwoToneIcon },
    { name: "Datos de Envío", action: "datosEnvio", icon: I.LocalPrintshopIcon },
    { name: "Productos", action: "productos", icon: I.InventoryIcon },
];

export const guiaTabsClienteProveedor = [
    { name: "Información Básica", action: "infoBasica", icon: I.PermIdentityTwoToneIcon },
    { name: "Ventas", action: "ventas", icon: I.DescriptionIcon },
    { name: "Proformas", action: "proformas", icon: I.AssignmentIcon },
    { name: "Guias de Remisión", action: "guias", icon: I.FilePresentIcon },
];

export const condicionPago = [
    { name: "Contado", days: 0 },
    { name: "Crédito 7 días", days: 7 },
    { name: "Crédito 15 días", days: 15 },
    { name: "Crédito 30 días", days: 30 },
    { name: "Crédito 60 días", days: 60 },
    { name: "Crédito 90 días", days: 90 },
];