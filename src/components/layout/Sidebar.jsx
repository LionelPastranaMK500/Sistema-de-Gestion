import { useEffect, useState } from "react";
import {
  MoreVertIcon,
  BusinessIcon,
  ReceiptIcon,
  PeopleIcon,
  LockIcon,
  ExitToAppIcon,
} from "@constants/icons";
import { menuItems } from "@constants/menuItems";
import { buttonColors } from "@constants/colors";
import { syncActiveCompany } from "@services/auth/authServices";
import { handleLogout } from "@services/auth/authLogic";
import { useNavigate } from "react-router-dom";
import { menuActions } from "@utils/navigation/menuActions";
import { useSidebar } from "@utils/navigation/sidebarState";

export default function Sidebar() {
  const [showConfig, setShowConfig] = useState(false);
  const { sidebarReady } = useSidebar();
  const user = JSON.parse(localStorage.getItem("activeUser")) || {};
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [empresa, setEmpresa] = useState("");
  const [sucursal, setSucursal] = useState("");
  const initials = `${user.nombres?.split(" ")[0]?.[0] || ""}${user.apellidoPaterno?.[0] || ""
    }`;

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
    <aside className="grid grid-rows-[auto,auto,1fr] w-full h-full overflow-hidden bg-blue-800 text-white">
      {/* Logo + config */}
      <div className="relative flex items-center p-6">
        <img
          src="/images/Logo_WolfFur.webp"
          alt="Logo"
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer"
          title="Ir a Dashboard"
        />
        <MoreVertIcon
          onClick={() => setShowConfig(!showConfig)}
          className="absolute right-6 top-6 cursor-pointer text-white"
        />
        {showConfig && (
          <div className="absolute right-6 top-16 z-50 min-w-[16rem] max-w-md rounded-lg border border-gray-200 bg-white p-4 text-black shadow-lg">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-extrabold text-white">
                {initials}
              </div>
              <div className="flex flex-col">
                <p className="leading-tight text-lg font-bold text-gray-900">
                  {user.nombres}{" "}
                  <span className="font-extrabold text-gray-800">
                    {user.apellidoPaterno}
                  </span>
                </p>
                <p className="text-sm text-black">{user.correo}</p>
              </div>
            </div>

            <h6 className="mb-2 font-bold">Empresa Seleccionada</h6>
            <a href="">
              <div className="hover:bg-gray-100 flex items-center gap-2 rounded-md p-2">
                <BusinessIcon className="text-blue-600" fontSize="medium" />
                Gestionar plan
              </div>
            </a>
            <a href="">
              <div className="hover:bg-gray-100 flex items-center gap-2 rounded-md p-2">
                <ReceiptIcon className="text-green-600" fontSize="medium" />
                Ordenes de pago
              </div>
            </a>

            <hr className="my-2" />

            <h3 className="mb-2 font-bold">Usuario</h3>
            <a href="">
              <div className="hover:bg-gray-100 flex items-center gap-2 rounded-md p-2">
                <PeopleIcon className="text-purple-600" fontSize="medium" />
                Registrar nueva empresa
              </div>
            </a>
            <a href="">
              <div className="hover:bg-gray-100 flex items-center gap-2 rounded-md p-2">
                <LockIcon className="text-orange-600" fontSize="medium" />
                Cambiar contraseña
              </div>
            </a>

            <div
              className="hover:bg-gray-100 flex cursor-pointer items-center gap-2 rounded-md p-2"
              onClick={() => handleLogout(navigate)}
            >
              <ExitToAppIcon className="text-red-600" fontSize="medium" />
              Cerrar sesión
            </div>
          </div>
        )}
      </div>

      {/* Empresa / Sucursal */}
      <div className="px-5 space-y-6 mb-6">
        {/* EMPRESA */}
        <div className="flex flex-col">
          <span className="mb-2 inline-flex w-fit self-start rounded-md bg-blue-700 px-2 py-[2px] text-[11px] font-bold uppercase tracking-wide text-blue-100">
            Empresa
          </span>
          <div className="relative">
            <select
              name="empresa"
              id="empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="w-full appearance-none rounded-xl border border-blue-600/40 bg-blue-700/50 px-4 py-4 pr-12 text-[15px] font-medium text-white outline-none transition placeholder-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-300/40"
            >
              <option value="">Seleccione empresa</option>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-blue-100 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* SUCURSAL */}
        <div className="flex flex-col">
          <span className="mb-2 inline-flex w-fit self-start rounded-md bg-blue-700 px-2 py-[2px] text-[11px] font-bold uppercase tracking-wide text-blue-100">
            Sucursal
          </span>
          <div className="relative">
            <select
              name="sucursal"
              id="sucursal"
              value={sucursal}
              onChange={(e) => setSucursal(e.target.value)}
              className="w-full appearance-none rounded-xl border border-blue-600/40 bg-blue-700/50 px-4 py-4 pr-12 text-[15px] font-medium text-white outline-none transition placeholder-blue-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-300/40"
            >
              <option value="">Seleccione sucursal</option>
              {sucursales.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-blue-100 opacity-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Menú — única zona con scroll */}
      <nav className="row-start-3 row-end-4 grid min-h-0 grid-cols-2 gap-3 overflow-y-auto p-5 mt-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isWide = index === 0; // ← “Estadísticas” es el primer ítem

          return (
            <button
              key={index}
              onClick={() => handleMenuAction(item.action)}
              className={`${buttonColors[index]} 
                ${isWide ? "col-span-2 h-16 md:h-20" : "h-28"} 
                flex items-center justify-center rounded-lg p-4 shadow hover:opacity-90 transition`}
            >
              <div
                className={`${isWide
                  ? "flex items-center gap-3"
                  : "flex flex-col items-center"
                  }`}
              >
                <Icon style={{ fontSize: isWide ? "1.6rem" : "2rem" }} />
                <span
                  className={`${isWide ? "text-base md:text-lg" : "mt-2 text-sm"
                    } font-semibold text-white text-center`}
                >
                  {item.name}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
