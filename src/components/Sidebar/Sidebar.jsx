import { useEffect, useState } from "react";
import {
    MoreVertIcon,
    BusinessIcon,
    ReceiptIcon,
    PeopleIcon,
    LockIcon,
    ExitToAppIcon
} from "@constants/iconsConstants";
import { menuItems } from "@constants/menuItemsConstants";
import { buttonColors } from "@constants/colorsConstants";
import { logoutUser,getActiveCompany, logoutCompany} from "@services/auth/authServices";
import { useNavigate } from "react-router-dom";
import { menuActions } from "@utils/menuActions";
import { useSidebar } from "@utils/sidebarState";

export default function Sidebar() {
    const [showConfig, setShowConfig] = useState(false);
    const { sidebarReady } = useSidebar();
    const user = JSON.parse(localStorage.getItem("activeUser")) || {};
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [empresa, setEmpresa] = useState("");
    const [sucursal, setSucursal] = useState("");
    const initials = `${user.nombres?.split(" ")[0]?.[0] || ""}${user.apellidoPaterno?.[0] || ""}`;
    const handleLogout = () => {
        logoutUser();
        logoutCompany();
        navigate("/");
    }

    const handleMenuAction = (action) => {
        if (menuActions[action]) {
            menuActions[action]({ navigate });
        }
    };

    useEffect(() => {
        if (sidebarReady) {
            const company = getActiveCompany();
                setEmpresas([{ id: 1, nombre: company.razonSocial }]);
                setEmpresa(1);
                setSucursales([{ id: 1, nombre: company.surcursal }]);
                setSucursal(1);
        }
    }, [sidebarReady]);

    if (!sidebarReady) return null;

    return (
        <aside className="flex flex-col bg-blue-800 w-96 min-h-screen text-white">
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
                    <div className="top-16 right-6 z-50 absolute bg-white shadow-lg p-4 border border-gray-200 rounded-lg min-w-[16rem] max-w-md text-black">
                        <div className="flex items-center gap-3 mb-3">
                            {/* Círculo con iniciales */}
                            <div className="flex flex-shrink-0 justify-center items-center bg-blue-600 shadow-md rounded-full w-14 h-14 font-extrabold text-white text-lg">
                                {initials}
                            </div>

                            {/* Nombre, apellido y correo */}
                            <div className="flex flex-col">
                                <p className="font-bold text-gray-900 text-lg leading-tight">
                                    {user.nombres}{" "}
                                    <span className="font-extrabold text-gray-800">
                                        {user.apellidoPaterno}
                                    </span>
                                </p>
                                <p className="text-black text-sm break-words">{user.correo}</p>
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

                        <div
                            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
                            onClick={handleLogout}
                        >
                            <ExitToAppIcon className="text-red-600" fontSize="medium" />
                            Cerrar sesión
                        </div>
                    </div>
                )}
            </div>

            {/* Datos empresa */}
            <div className="space-y-4 px-5">
                <div className="bg-blue-900/50 p-3 rounded-lg">
                    <h2>Empresa</h2>
                    <select
                        name="empresa"
                        id="empresa"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}

                    >
                        <option value="">Seleccione empresa</option>
                        {empresas.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="bg-blue-900/50 p-3 rounded-lg">
                    <h2>Sucursal</h2>
                    <select
                        name="sucursal"
                        id="sucursal"
                        value={sucursal}
                        onChange={(e) => setSucursal(e.target.value)}

                    >
                        <option value="">Seleccione sucursal</option>
                        {sucursales.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Menú con scroll vertical independiente */}
            <nav
                className="gap-3 grid grid-cols-2 p-5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900"
                style={{ maxHeight: "calc(100vh - 200px)" }}
            >
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => handleMenuAction(item.action)}
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