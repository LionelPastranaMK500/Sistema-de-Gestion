import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar/Sidebar";


export default function MainLayout() {
    return (
        <div className="flex">
            {/* Sidebar fijo */}
            <Sidebar />

            {/* Contenido dinámico */}
            <main className="flex-1 bg-gray-50 p-6 min-w-0 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}