import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@components/Sidebar/Sidebar";
import SidebarSkeleton from "@components/Sidebar/SidebarSkeleton";
import { useSidebar } from "@utils/sidebarState";
import { MenuIcon } from "@constants/iconsConstants";

export default function MainLayout() {
    const { sidebarReady } = useSidebar();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex min-h-screen">
            {/* Sidebar con transición */}
            <div
                className={`transition-all duration-300 ${isOpen ? "w-96" : "w-0"
                    } overflow-hidden`}
            >
                {sidebarReady ? <Sidebar /> : <SidebarSkeleton />}
            </div>

            {/* Contenido dinámico */}
            <main className="flex-1 bg-gray-50 p-6 min-w-0 overflow-auto relative">
                {/* Botón hamburguesa */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-md hover:bg-blue-700 transition"
                >
                    <MenuIcon fontSize="medium" />
                </button>

                <Outlet />
            </main>
        </div>
    );
}
