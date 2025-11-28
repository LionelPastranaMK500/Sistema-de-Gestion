import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { delaySkeleton } from "./redirectWithDelay";
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";

// 1. Definimos qué forma tienen el Usuario y la Empresa
// (Esto evita el error de "unknown" en otros archivos)
interface User {
  nombres: string;
  apellidoPaterno: string;
  correo: string;
  [key: string]: any;
}

interface Company {
  razonSocial: string;
  sucursal: string;
  [key: string]: any;
}

// 2. Definimos qué datos guarda nuestro Contexto
interface SidebarContextType {
  sidebarReady: boolean;
  setSidebarReady: React.Dispatch<React.SetStateAction<boolean>>;
  activeUser: User | null;
  setActiveUser: React.Dispatch<React.SetStateAction<User | null>>;
  activeCompany: Company | null;
  setActiveCompany: React.Dispatch<React.SetStateAction<Company | null>>;
}

// 3. Creamos el contexto tipado (Soluciona el error "Se esperaban 1 argumentos")
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 4. Definimos el tipo para 'children' (Soluciona el error "children tiene un tipo any")
interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [sidebarReady, setSidebarReady] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);

  useEffect(() => {
    async function initSidebar() {
      await delaySkeleton(2000);
      const user = getActiveUser();
      const company = getActiveCompany();

      if (user) setActiveUser(user);
      if (company) setActiveCompany(company);

      setSidebarReady(true);
    }

    initSidebar();
  }, []);

  const value = {
    sidebarReady,
    setSidebarReady,
    activeUser,
    setActiveUser,
    activeCompany,
    setActiveCompany,
  };

  // Usamos JSX estándar (<Provider>) que es más limpio en TypeScript
  // que React.createElement, pero hace exactamente lo mismo.
  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar debe ser usado dentro de un SidebarProvider");
  }
  return context;
}
