import { Outlet, useLocation } from "react-router-dom";
import { useLayoutEffect, useEffect, useState } from "react";
import Sidebar from "@components/Sidebar/Sidebar";
import SidebarSkeleton from "@components/Sidebar/SidebarSkeleton";
import { useSidebar } from "@utils/sidebarState";
import { MenuIcon } from "@constants/iconsConstants";
import "@styles/ContentLoader.css";

export default function MainLayout() {
    const { sidebarReady } = useSidebar();
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    // --- Tu lógica de loader se mantiene intacta ---
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayTotal, setOverlayTotal] = useState(2000);
    const [overlayRunId, setOverlayRunId] = useState(0);
    const [contentHidden, setContentHidden] = useState(false);

    useLayoutEffect(() => {
        setOverlayTotal(2000);
        setOverlayRunId((id) => id + 1);
        setOverlayVisible(true);
        setContentHidden(true);
    }, [location.key]);
    
    // ... resto de hooks del loader sin cambios ...

    return (
        // Contenedor principal: Ocupa toda la pantalla y no permite desbordamiento
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Contenedor del Sidebar */}
            <div className={`flex-shrink-0 transition-all duration-300 ${isOpen ? "w-96" : "w-0"}`}>
                {sidebarReady ? <Sidebar /> : <SidebarSkeleton />}
            </div>

            {/* Área de Contenido Principal */}
            <main className="relative flex-1 flex flex-col min-w-0">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="top-4 left-4 z-50 absolute bg-blue-600 hover:bg-blue-700 shadow-md p-2 rounded-md text-white transition"
                >
                    <MenuIcon fontSize="medium" />
                </button>

                {/* Este div ahora contiene el loader y el Outlet, y ocupa toda la altura */}
                <div className="w-full h-full relative">
                    {overlayVisible && (
                        <div
                            key={overlayRunId}
                            className="private-loader-overlay"
                            style={{ "--overlay-total": `${overlayTotal}ms` }}
                            onAnimationEnd={() => {
                                setOverlayVisible(false);
                                setContentHidden(false);
                            }}
                        >
                            <div className="bars-loader">
                                <div className="bars-loader__bar"></div>
                                <div className="bars-loader__bar"></div>
                                <div className="bars-loader__bar"></div>
                                <div className="bars-loader__bar"></div>
                                <div className="bars-loader__bar"></div>
                                <div className="bars-loader__ball"></div>
                            </div>
                        </div>
                    )}
                    <div className={`${contentHidden ? "opacity-0" : "opacity-100"} h-full`}>
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}