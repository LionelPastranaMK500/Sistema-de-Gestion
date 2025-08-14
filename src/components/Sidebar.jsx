import { useState } from "react"; 
import { MoreVertIcon } from "../constants/iconsConstants";
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
                    <div className="absolute top-16 right-6 bg-white text-black rounded shadow-lg p-4 w-56 z-50">
                        <h6 className="font-bold mb-2">Empresa Seleccionada</h6>
                        <a href=""><div className="hover:underline">Gestionar plan</div></a>
                        <a href=""><div className="hover:underline">Ordenes de pago</div></a>
                        <hr className="my-2" />
                        <h3 className="font-bold mb-2">Usuario</h3>
                        <a href=""><div className="hover:underline">Registrar nueva empresa</div></a>
                        <a href=""><div className="hover:underline">Cambiar contraseña</div></a>
                        <a href=""><div className="hover:underline">Cerrar sesión</div></a>
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

            {/* Menú con scroll independiente */}
            <nav className="grid grid-cols-2 gap-4 p-6 overflow-y-auto flex-grow">
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
