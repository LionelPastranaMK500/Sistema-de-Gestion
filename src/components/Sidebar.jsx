import { useState } from "react";
import {
    MoreVertIcon,
    BusinessIcon,
    ReceiptIcon,
    PeopleIcon,
    LockIcon,
    ExitToAppIcon
} from "../constants/iconsConstants";
import { menuItems } from "../constants/menuItemsConstants";
import { buttonColors } from "../constants/colorsConstants";
import { logoutUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const [showConfig, setShowConfig] = useState(false);
    const user = JSON.parse(localStorage.getItem("activeUser")) || {};
    const navigate = useNavigate();
    const initials = `${user.nombres?.split(" ")[0]?.[0] || ""}${user.apellidoPaterno?.[0] || ""}`;
    const handleLogout = () =>{
        logoutUser();
        navigate("/");
    }

    return (
        <aside className="flex flex-col bg-blue-800 w-[30rem] min-h-screen text-white">
            {/* Logo y configuración */}
            <div className="relative flex items-center p-6">
                <img
                    src="/images/Logo_WolfFur.webp"
                    alt="Logo"
                    className="h-36 object-contain"
                />
                <MoreVertIcon
                    onClick={() => setShowConfig(!showConfig)}
                    className="top-6 right-6 absolute text-white cursor-pointer"
                />
                {showConfig && (
                    <div className="top-16 right-6 z-50 absolute bg-white shadow-lg p-4 border border-gray-200 rounded-lg w-64 text-black">

                        <div>
                            <div>{initials}</div>
                            <div>
                                <p>
                                    {user.nombres} {user.apellidoPaterno}
                                </p>
                                <p>{user.correo}</p>
                            </div>
    
                        </div>

                        <h6 className="mb-2 font-bold">Empresa Seleccionada</h6>

                        <a href="">
                            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                <BusinessIcon className="text-blue-600" fontSize="medium" />
                                Gestionar plan
                            </div>
                        </a>

                        <a href="">
                            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                <ReceiptIcon className="text-green-600" fontSize="medium" />
                                Ordenes de pago
                            </div>
                        </a>

                        <hr className="my-2" />

                        <h3 className="mb-2 font-bold">Usuario</h3>

                        <a href="">
                            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                <PeopleIcon className="text-purple-600" fontSize="medium" />
                                Registrar nueva empresa
                            </div>
                        </a>

                        <a href="">
                            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                                <LockIcon className="text-orange-600" fontSize="medium" />
                                Cambiar contraseña
                            </div>
                        </a>


                        <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md" onClick={handleLogout}>
                            <ExitToAppIcon className="text-red-600" fontSize="medium" />
                            Cerrar sesión
                        </div>

                    </div>
                )}
            </div>

            {/* Datos empresa */}
            <div className="space-y-3 px-6">
                <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="opacity-80 font-semibold text-sm">Empresa</p>
                    <select name="" id="">
                        <option>

                        </option>
                    </select>
                </div>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="opacity-80 font-semibold text-sm">Sucursal</p>
                    <select name="" id="">
                        <option>
                            
                        </option>
                    </select>
                </div>
            </div>

            {/* Menú con scroll vertical independiente */}
            <nav
                className="gap-4 grid grid-cols-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900"
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
                            <span className="mt-2 font-medium text-white text-sm text-center">
                                {item.name}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
