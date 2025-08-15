import { useState } from "react";
import {
    MoreVertIcon,
    BusinessIcon,
    ReceiptIcon,
    PeopleIcon,
    LockIcon,
    ExitToAppIcon
} from "../constants/iconsConstants"; // 👈 Aquí traes todos los iconos
import { menuItems } from "../constants/menuItemsConstants";
import { buttonColors } from "../constants/colorsConstants";

export default function Sidebar() {
    const [showConfig, setShowConfig] = useState(false);

    return (
        <aside className="flex flex-col bg-blue-800 text-white w-[30rem] min-h-screen">
            {/* Logo y configuración */}
            <div className="relative flex items-center p-6">
                <img
                    src="/images/Logo_WolfFur.webp"
                    alt="Logo"
                    className="h-36 object-contain"
                />
                <MoreVertIcon
                    onClick={() => setShowConfig(!showConfig)}
                    className="absolute top-6 right-6 cursor-pointer text-white"
                />
                {showConfig && (
                    <div className="absolute top-16 right-6 bg-white text-black rounded-lg shadow-lg p-4 w-64 z-50 border border-gray-200">
                        <h6 className="font-bold mb-2">Empresa Seleccionada</h6>

                        <a href="">
                            <div className="hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                <BusinessIcon className="text-blue-600" fontSize="medium" />
                                Gestionar plan
                            </div>
                        </a>

                        <a href="">
                            <div className="hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                <ReceiptIcon className="text-green-600" fontSize="medium" />
                                Ordenes de pago
                            </div>
                        </a>

                        <hr className="my-2" />

                        <h3 className="font-bold mb-2">Usuario</h3>

                        <a href="">
                            <div className="hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                <PeopleIcon className="text-purple-600" fontSize="medium" />
                                Registrar nueva empresa
                            </div>
                        </a>

                        <a href="">
                            <div className="hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                <LockIcon className="text-orange-600" fontSize="medium" />
                                Cambiar contraseña
                            </div>
                        </a>

                        <a href="">
                            <div className="hover:bg-gray-100 rounded-md p-2 flex items-center gap-2">
                                <ExitToAppIcon className="text-red-600" fontSize="medium" />
                                Cerrar sesión
                            </div>
                        </a>
                    </div>
                )}
            </div>

            {/* Datos empresa */}
            <div className="px-6 space-y-3">
                <div className="bg-blue-900/50 rounded-lg p-3">
                    <p className="text-sm font-semibold opacity-80">Nombre</p>
                    <p className="text-lg font-bold">Empresa S.A</p>
                </div>
                <div className="bg-blue-900/50 rounded-lg p-3">
                    <p className="text-sm font-semibold opacity-80">Sucursal</p>
                    <p className="text-lg font-bold">Arduino KE</p>
                </div>
            </div>

            {/* Menú con scroll vertical independiente */}
            <nav
                className="grid grid-cols-2 gap-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900"
                style={{ maxHeight: "calc(100vh - 300px)" }}
            >
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            className={`${buttonColors[index]} flex flex-col items-center justify-center p-4 rounded-lg shadow hover:opacity-90`}
                        >
                            <Icon style={{ fontSize: "2rem" }} />
                            <span className="mt-2 text-sm font-medium text-white text-center">
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
