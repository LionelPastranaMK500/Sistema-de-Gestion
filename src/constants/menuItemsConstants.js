import * as I from "./iconsConstants";

export const menuItems = [
    { name: "Estadisticas",action:"estadistica", icon: I.PollIcon},
    { name: "Realizar Venta",action: "ventas",icon: I.ShoppingCartIcon},
    { name: "Ventas Realizadas",action: "ventasRealizadas", icon: I.ReceiptIcon},
    { name: "Proformas",action:"proformas", icon: I.AssignmentIcon},
    { name: "Reportes",action:"reportes" ,icon: I.AssessmentIcon},
    { name: "Guias de Remision", action:"guia", icon: I.FilePresentIcon},
    { name: "Clientes y Proveedores",action:"cliente", icon: I.PeopleIcon},
    { name: "Productos y Servicios",action:"producto", icon: I.InventoryIcon},
    { name: "Configuración",action:"configuracion" , icon: I.SettingsIcon},
];

export const menuItemsFactura =[
    {name: "Registrar nuevo",icon: I.AddIcon},
    {name: "Buscar comprobante", icon: I.SearchIcon},
    {name: "Ver resumen del dia", icon: I.ReceiptLongIcon},
];

export const menuItemsProformas =[
    {name: "Registrar nuevo",icon: I.AddIcon},
    {name: "Buscar comprobante", icon: I.SearchIcon},
    {name: "Ver resumen del dia", icon: I.ReceiptLongIcon},
];

export const menuItemsReportes =[
    {name:"Ventas", description: "Reporte General",action: "venta_reporte",icon: I.RealEstateAgentIcon},
    {name:"Ventas",description:"Reporte Detallado",action: "venta_detallado_reporte",icon: I.RealEstateAgentIcon},
    {name:"Productos",description:"Listado",action: "producto_listado", icon: I.InventoryIcon},
    {name:"Cliente/Proveedores",description:"Listado",action: "cliente_proveedor_listado",icon: I.PeopleAltIcon},
    {name:"Guias de Remisión",description:"Reporte General",action: "guia_reporte",icon: I.FilePresentIcon},
];

export const menuItemsConfig =[
    {name:"Empresa",action:"configurar_empresa",icon:I.BusinessIcon},
    {name:"Usuarios",action:"configurar_usuario",icon:I.PeopleAltIcon},
    {name:"Almacenes",action:"configurar_almacen",icon:I.InventoryIcon},
    {name:"Sucursales",action:"configurar_sucursal",icon:I.StoreIcon},
    {name:"Impresión",action:"configurar_impresion",icon:I.LocalPrintshopIcon},
];

export const guiaTabs = [
    { name: "Información Básica", action: "infoBasica", icon: I.PermIdentityTwoToneIcon },
    { name: "Datos de Envío", action: "datosEnvio", icon: I.LocalPrintshopIcon },
    { name: "Productos", action: "productos", icon: I.InventoryIcon },
];