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
    { name: "Estadisticas", icon: PollIcon},
    { name: "Realizar Venta",action: "ventas",icon: ShoppingCartIcon},
    { name: "Ventas Realizadas",action: "ventasRealizadas", icon: ReceiptIcon},
    { name: "Proformas", icon: AssignmentIcon},
    { name: "Reportes", icon: AssessmentIcon},
    { name: "Clientes y Proveedores", icon: PeopleIcon},
    { name: "Productos y Servicios", icon: InventoryIcon},
    { name: "Configuración", icon: SettingsIcon},
    { name: "Soporte / Ayuda", icon: SupportAgentIcon},
];
