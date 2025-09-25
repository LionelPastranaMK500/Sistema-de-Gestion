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
import { syncActiveCompany } from "@services/auth/authServices";
import { handleLogout } from "@services/auth/authLogic";
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

    const handleMenuAction = (action) => {
        if (menuActions[action]) menuActions[action]({ navigate });
    };

    useEffect(() => {
        if (sidebarReady) {
            const company = syncActiveCompany();
            if (company) {
                setEmpresas([{ id: 1, nombre: company.razonSocial }]);
                setEmpresa(1);
                setSucursales([{ id: 1, nombre: company.sucursal }]);
                setSucursal(1);
            } else {
                setEmpresas([]);
                setEmpresa("");
                setSucursales([]);
                setSucursal("");
            }
        }
    }, [sidebarReady]);

    if (!sidebarReady) return null;

    return (
        // FIXED + ocupa de top a bottom del viewport. Grid reparte verticalmente.
        <aside className="left-0 fixed inset-y-0 grid grid-rows-[auto,auto,1fr] bg-blue-800 w-96 overflow-hidden text-white">

            {/* Logo + config */}
            <div className="relative flex items-center p-6">
                <img src="/images/Logo_WolfFur.avif" alt="Logo" />
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
                            onClick={() => handleLogout(navigate)}
                        >
                            <ExitToAppIcon className="text-red-600" fontSize="medium" />
                            Cerrar sesión
                        </div>
                    </div>
                )}
            </div>
            {/* Empresa / Sucursal (sin scroll) */}
            <div className="space-y-6 px-5">
                {/* EMPRESA */}
                <div className="flex flex-col">
                    <span className="inline-flex self-start bg-blue-700 mb-2 px-2 py-[2px] rounded-md w-fit font-bold text-[11px] text-blue-100 uppercase tracking-wide">
                        Empresa
                    </span>
                    <div className="relative">
                        <select
                            name="empresa"
                            id="empresa"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            className="bg-blue-700/50 px-4 py-4 pr-12 border border-blue-600/40 focus:border-blue-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300/40 w-full font-medium text-[15px] text-white transition appearance-none placeholder-blue-200"
                        >
                            <option value="">Seleccione empresa</option>
                            {empresas.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                        <svg className="top-1/2 right-3 absolute opacity-90 w-6 h-6 text-blue-100 -translate-y-1/2 pointer-events-none"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                

                {/* SUCURSAL */}
                <div className="flex flex-col">
                    <span className="inline-flex self-start bg-blue-700 mb-2 px-2 py-[2px] rounded-md w-fit font-bold text-[11px] text-blue-100 uppercase tracking-wide">
                        Sucursal
                    </span>
                    <div className="relative">
                        <select
                            name="sucursal"
                            id="sucursal"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            className="bg-blue-700/50 px-4 py-4 pr-12 border border-blue-600/40 focus:border-blue-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-300/40 w-full font-medium text-[15px] text-white transition appearance-none placeholder-blue-200"
                        >
                            <option value="">Seleccione sucursal</option>
                            {sucursales.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                        <svg className="top-1/2 right-3 absolute opacity-90 w-6 h-6 text-blue-100 -translate-y-1/2 pointer-events-none"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Mejorar el margen en (Sidebar - ver todoist) */}

            {/* Menú — única zona con scroll */}
            <nav className="gap-3 grid grid-cols-2 row-start-3 row-end-4 p-5 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => handleMenuAction(item.action)}
                            className={`${buttonColors[index]} flex flex-col items-center justify-center p-4 rounded-lg shadow hover:opacity-90`}
                        >
                            <Icon style={{ fontSize: "2rem" }} />
                            <span className="mt-2 font-medium text-white text-sm text-center">{item.name}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
