import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "@components/Sidebar/Sidebar";
import SidebarSkeleton from "@components/Sidebar/SidebarSkeleton";
import { useSidebar } from "@utils/sidebarState";
import { MenuIcon } from "@constants/iconsConstants";

const MainLayout = () => {
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
            <main className="relative flex-1 bg-gray-50 p-6 min-w-0 overflow-auto">
                {/* Botón hamburguesa */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="top-4 left-4 z-50 absolute bg-blue-600 hover:bg-blue-700 shadow-md p-2 rounded-md text-white transition"
                >
                    <MenuIcon fontSize="medium" />
                </button>

                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
