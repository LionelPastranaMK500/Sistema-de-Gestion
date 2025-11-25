import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/utils/navigation/sidebarState";
import App from "@/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </BrowserRouter>
);
