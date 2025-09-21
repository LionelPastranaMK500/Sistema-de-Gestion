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
        <aside className="fixed inset-y-0 left-0 w-96 bg-blue-800 text-white
                      grid grid-rows-[auto,auto,1fr] overflow-hidden">

            {/* Logo + config */}
            <div className="relative flex items-center p-6">
                <img src="/images/Logo_WolfFur.avif" alt="Logo" />
                <MoreVertIcon
                    onClick={() => setShowConfig(!showConfig)}
                    className="top-6 right-6 absolute text-white cursor-pointer"
                />
                {showConfig && (
                    <div className="top-16 right-6 z-50 absolute bg-white shadow-lg p-4 border border-gray-200 rounded-lg min-w-[16rem] max-w-md text-black">
                        {/* ...contenido igual... */}
                    </div>
                )}
            </div>

            {/* Empresa / Sucursal (sin scroll) */}
            <div className="space-y-6 px-5">
                {/* EMPRESA */}
                <div className="flex flex-col">
                    <span className="self-start inline-flex w-fit rounded-md bg-blue-700 px-2 py-[2px] text-[11px] font-bold tracking-wide text-blue-100 uppercase mb-2">
                        Empresa
                    </span>
                    <div className="relative">
                        <select
                            name="empresa"
                            id="empresa"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-blue-600/40 bg-blue-700/50 px-4 pr-12 py-4 text-[15px] font-medium text-white placeholder-blue-200 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300/40"
                        >
                            <option value="">Seleccione empresa</option>
                            {empresas.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 opacity-90 text-blue-100"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* SUCURSAL */}
                <div className="flex flex-col">
                    <span className="self-start inline-flex w-fit rounded-md bg-blue-700 px-2 py-[2px] text-[11px] font-bold tracking-wide text-blue-100 uppercase mb-2">
                        Sucursal
                    </span>
                    <div className="relative">
                        <select
                            name="sucursal"
                            id="sucursal"
                            value={sucursal}
                            onChange={(e) => setSucursal(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-blue-600/40 bg-blue-700/50 px-4 pr-12 py-4 text-[15px] font-medium text-white placeholder-blue-200 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-300/40"
                        >
                            <option value="">Seleccione sucursal</option>
                            {sucursales.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 opacity-90 text-blue-100"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Menú — única zona con scroll */}
            <nav className="row-start-3 row-end-4 min-h-0 overflow-y-auto p-5 grid grid-cols-2 gap-3
                      scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300
                      dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => menuActions[item.action]?.({ navigate })}
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
