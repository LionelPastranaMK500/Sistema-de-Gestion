import { createContext, useContext, useState, useEffect } from "react";
import { delaySkeleton } from "./redirectWithDelay";
import { getActiveUser, getActiveCompany } from "@/services/auth/authServices";
import {
  SidebarContextType,
  SidebarProviderProps,
  SidebarUser,
  SidebarCompany,
} from "@/types/utils/navigation";

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [sidebarReady, setSidebarReady] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<SidebarUser | null>(null);
  const [activeCompany, setActiveCompany] = useState<SidebarCompany | null>(
    null
  );

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
