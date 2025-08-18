import { Outlet } from "react-router-dom";
import Sidebar from "@components/Sidebar";


export default function MainLayout() {
    return (
        <div className="flex">
            {/* Sidebar fijo */}
            <Sidebar />

            {/* Contenido dinámico */}
            <div className="p-6">
                <Outlet />
            </div>
        </div>
    );
}