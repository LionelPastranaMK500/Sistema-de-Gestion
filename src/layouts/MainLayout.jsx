import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar/Sidebar";
import SidebarSkeleton from "@components/Sidebar/SidebarSkeleton";
import { useSidebar } from "@utils/sidebarState";

export default function MainLayout() {
    const { sidebarReady } = useSidebar();

    return (
        <div className="flex">
            {/* Sidebar o Skeleton */}
            {sidebarReady ? <Sidebar /> : <SidebarSkeleton />}

            {/* Contenido dinámico */}
            <main className="flex-1 bg-gray-50 p-6 min-w-0 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}