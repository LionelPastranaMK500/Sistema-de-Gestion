import { configCalendar } from "@/utils/calendar/configCalendar";
import { useEffect, useState } from "react";
import { guiaTabsClienteProveedor } from "@/constants/menuItems";
import { CloseIcon } from "@/constants/icons";
import { ClienteNuevoProps } from "@/types/modules/clientes";

import ClienteTabInfoBasica from "./components/ClienteTabInfoBasica";
import ClienteTabVentas from "./components/ClienteTabVentas";
import ClienteTabProformas from "./components/ClienteTabProformas";
import ClienteTabGuias from "./components/ClienteTabGuias";

const ClienteNuevo = ({ onClose }: ClienteNuevoProps) => {
  const [activeTab, setActiveTab] = useState("infoBasica");

  useEffect(() => {
    configCalendar();
  }, []);

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "infoBasica":
        return <ClienteTabInfoBasica />;
      case "ventas":
        return <ClienteTabVentas />;
      case "proformas":
        return <ClienteTabProformas />;
      case "guias":
        return <ClienteTabGuias />;
      default:
        return null;
    }
  };

  return (
    <div className="z-10 fixed inset-0 flex justify-center items-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex flex-col bg-white shadow-2xl rounded-xl w-[min(980px,95vw)] max-h-[92vh] overflow-hidden">
        <div className="flex justify-between items-center bg-blue-700 px-5 py-4 text-white">
          <h3>Cliente / Proveedor</h3>
          <button onClick={onClose} aria-label="Cerrar">
            <CloseIcon />
          </button>
        </div>

        <div className="bg-blue-700 px-3">
          <div className="flex gap-2 overflow-x-auto">
            {guiaTabsClienteProveedor.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.action;
              return (
                <button
                  key={tab.action}
                  onClick={() => setActiveTab(tab.action)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm uppercase tracking-wide text-white/90
                                    hover:text-white transition ${
                                      active ? "font-semibold" : ""
                                    }`}
                >
                  <Icon />
                  {tab.name}
                  {active && (
                    <span className="right-0 bottom-0 left-0 absolute bg-white rounded-t h-[3px]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 bg-white px-5 py-5 overflow-y-auto">
          {renderActiveTabContent()}
        </div>

        <div className="bottom-0 sticky flex justify-end items-center gap-3 bg-white px-5 py-3 border-t">
          <button
            onClick={onClose}
            className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm"
          >
            Cancelar
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-white text-sm">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteNuevo;
