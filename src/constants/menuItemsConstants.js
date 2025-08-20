import {
    PollIcon,
    PeopleIcon,
    InventoryIcon,
    ReceiptIcon,
    ShoppingCartIcon,
    AssessmentIcon,
    SettingsIcon,
    SupportAgentIcon,
    AssignmentIcon
} from "./iconsConstants";

export const menuItems = [
    { name: "Estadisticas",action:"estadistica", icon: PollIcon},
    { name: "Realizar Venta",action: "ventas",icon: ShoppingCartIcon},
    { name: "Ventas Realizadas",action: "ventasRealizadas", icon: ReceiptIcon},
    { name: "Proformas",action:"proformas", icon: AssignmentIcon},
    { name: "Reportes",action:"reportes" ,icon: AssessmentIcon},
    { name: "Clientes y Proveedores",action:"cliente", icon: PeopleIcon},
    { name: "Productos y Servicios",action:"producto", icon: InventoryIcon},
    { name: "Configuración",action:"configuracion" , icon: SettingsIcon},
    { name: "Soporte / Ayuda",action:"ayuda" , icon: SupportAgentIcon},
];
