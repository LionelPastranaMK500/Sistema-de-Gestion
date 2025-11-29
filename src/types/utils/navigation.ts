import { NavigateFunction } from "react-router-dom";
import { ReactNode } from "react";

export interface MenuActionParams {
  navigate: NavigateFunction;
}

export interface SidebarUser {
  nombres: string;
  apellidoPaterno: string;
  correo: string;
  [key: string]: any;
}

export interface SidebarCompany {
  razonSocial: string;
  sucursal: string;
  [key: string]: any;
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
