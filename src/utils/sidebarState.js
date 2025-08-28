import React, { createContext, useContext, useState, useEffect } from "react";
import { delaySkeleton } from "./redirectWithDelay";
import { getActiveUser, getActiveCompany } from "@services/auth/authServices";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [sidebarReady, setSidebarReady] = useState(false);
    const [activeUser, setActiveUser] = useState(null);
    const [activeCompany, setActiveCompany] = useState(null);

    useEffect(() => {
        async function initSidebar() {
            await delaySkeleton(2000);
            const user = getActiveUser();
            const company = getActiveCompany();

            if (user && company) {
                setActiveUser(user);
                setActiveCompany(company);
                setSidebarReady(true);
            }
        }

        initSidebar();
    }, []);

    return React.createElement(
        SidebarContext.Provider,
        {
            value: {
                sidebarReady,
                setSidebarReady,
                activeUser,
                setActiveUser,
                activeCompany,
                setActiveCompany,
            },
        },
        children
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
