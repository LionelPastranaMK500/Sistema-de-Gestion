import { ReactNode } from "react";

export interface CustomStyle extends React.CSSProperties {
  "--overlay-total"?: string;
}

// --- Sidebar ---
export interface SidebarOption {
  id: number | string;
  nombre: string;
}

export interface SidebarUser {
  nombres: string;
  apellidoPaterno: string;
  correo: string;
}

export interface SidebarCompany {
  razonSocial: string;
  sucursal: string;
}

export interface SidebarContextType {
  sidebarReady: boolean;
  setSidebarReady: React.Dispatch<React.SetStateAction<boolean>>;
  activeUser: SidebarUser | null;
  setActiveUser: React.Dispatch<React.SetStateAction<SidebarUser | null>>;
  activeCompany: SidebarCompany | null;
  setActiveCompany: React.Dispatch<React.SetStateAction<SidebarCompany | null>>;
}

export interface SidebarProviderProps {
  children: ReactNode;
}

// --- Menús de Navegación ---
export interface MenuItemInfo {
  name: string;
  action: string;
  icon: any;
  description?: string;
}
