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

    // Estado del overlay y control de reinicio de animación
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayTotal, setOverlayTotal] = useState(2000); // ms
    const [overlayRunId, setOverlayRunId] = useState(0);

    // Para ocultar el contenido por completo mientras hay overlay
    const [contentHidden, setContentHidden] = useState(false);

    // 1) Antes del primer paint de la app
    useLayoutEffect(() => {
        setOverlayTotal(2000);            // ajusta: 2000 / 3000 / 5000 ...
        setOverlayRunId((id) => id + 1);  // fuerza nueva animación
        setOverlayVisible(true);
        setContentHidden(true);           // oculta contenido
    }, []);

    // 2) En cada cambio de ruta (ANTES de pintar el contenido nuevo)
    useLayoutEffect(() => {
        setOverlayTotal(2000);
        setOverlayRunId((id) => id + 1);  // key distinta => reinicia animación CSS
        setOverlayVisible(true);
        setContentHidden(true);           // oculta contenido hasta que termine el overlay
    }, [location.key]);

    // 3) Soporte opcional para eventos manuales (si los usas)
    useEffect(() => {
        const onShow = (e) => {
            const total = Number(e?.detail?.total) || 2000;
            setOverlayTotal(total);
            setOverlayRunId((id) => id + 1);
            setOverlayVisible(true);
            setContentHidden(true);
        };
        const onHide = () => {
            // dejamos que el overlay termine su animación y se auto-cierre
        };
        window.addEventListener("content-loader:show", onShow);
        window.addEventListener("content-loader:hide", onHide);
        return () => {
            window.removeEventListener("content-loader:show", onShow);
            window.removeEventListener("content-loader:hide", onHide);
        };
    }, []);

    return (
        <div className="flex min-h-screen">
            <div className={`transition-all duration-300 ${isOpen ? "w-96" : "w-0"} overflow-hidden`}>
                {sidebarReady ? <Sidebar /> : <SidebarSkeleton />}
            </div>

            <main className="relative flex-1 bg-gray-50 p-6 min-w-0 overflow-auto">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="top-4 left-4 z-50 absolute bg-blue-600 hover:bg-blue-700 shadow-md p-2 rounded-md text-white transition"
                >
                    <MenuIcon fontSize="medium" />
                </button>

                {/* Overlay: siempre por encima y con animación controlada por key y duración */}
                {overlayVisible && (
                    <div
                        key={overlayRunId}                           // 🔑 reinicia la animación en cada navegación
                        className="private-loader-overlay"
                        style={{ "--overlay-total": `${overlayTotal}ms` }}
                        onAnimationEnd={() => {
                            setOverlayVisible(false);
                            setContentHidden(false);                  // muestra el contenido al terminar
                        }}
                    >
                        {/* Loader equalizer */}
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

                {/* Contenido: completamente oculto mientras el overlay está activo */}
                <div className={contentHidden ? "opacity-0 pointer-events-none select-none" : "opacity-100"}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
