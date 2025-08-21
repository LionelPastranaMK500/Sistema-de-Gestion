import React,{createContext, useContext,useState} from "react";

const SidebarContext=createContext();

export function SidebarProvider({children}){
    const[sidebarReady, setSidebarReady] = useState(false);

    return React.createElement( 
        SidebarContext.Provider,
        {value:{sidebarReady,setSidebarReady}},
        children
    );
}
export const useSidebar=()=> useContext(SidebarContext);