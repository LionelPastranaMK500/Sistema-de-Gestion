import * as I from "./iconsConstants";

export const menuItems = [
    { name: "Estadisticas",action:"estadistica", icon: I.PollIcon},
    { name: "Realizar Venta",action: "ventas",icon: I.ShoppingCartIcon},
    { name: "Ventas Realizadas",action: "ventasRealizadas", icon: I.ReceiptIcon},
    { name: "Proformas",action:"proformas", icon: I.AssignmentIcon},
    { name: "Reportes",action:"reportes" ,icon: I.AssessmentIcon},
    { name: "Clientes y Proveedores",action:"cliente", icon: I.PeopleIcon},
    { name: "Productos y Servicios",action:"producto", icon: I.InventoryIcon},
    { name: "Configuración",action:"configuracion" , icon: I.SettingsIcon},
    { name: "Soporte / Ayuda",action:"ayuda" , icon: I.SupportAgentIcon},
];

export const menuItemsFactura =[
    {name: "Registrar nuevo",icon: I.AddIcon},
    {name: "Buscar comprobante", icon: I.SearchIcon},
    {name: "Ver resumen del dia", icon: I.ReceiptLongIcon},
];
