import { useState, useRef } from "react";
import { Menu } from "primereact/menu";
import { componentsVentas } from "@/constants/menuItems";
import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";
import { MenuIcon } from "@/constants/icons";
import { VentaComponent } from "@/types/modules/ventas";

const INPUT_CLASS =
  "w-full h-full px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold text-gray-700 placeholder-gray-400 shadow-sm transition-all";
const BTN_CLASS =
  "w-full h-full flex items-center justify-center gap-2 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-xs font-bold text-gray-600 uppercase tracking-wide shadow-sm transition-all active:scale-95";

const VentasModal = () => {
  const [modals, setModals] = useState<Record<string, boolean>>({});
  const [inlineInputs, setInlineInputs] = useState<Record<string, boolean>>({});
  const menuRef = useRef<Menu>(null);

  const handleHideModal = (action: string) =>
    setModals((prev) => ({ ...prev, [action]: false }));

  const toggleInlineInput = (action: string) =>
    setInlineInputs((prev) => ({ ...prev, [action]: true }));

  const blurInlineInput = (action: string) =>
    setInlineInputs((prev) => ({ ...prev, [action]: false }));

  const allComponents = componentsVentas as VentaComponent[];
  const inputItems = allComponents.filter((c) => c.isInput);

  const otrosModalItems = allComponents
    .filter((c) => !c.isInput)
    .map((c) => ({
      label: c.name,
      command: () => setModals((prev) => ({ ...prev, [c.action]: true })),
    }));

  const renderModal = (action: string) => {
    switch (action) {
      case "guia":
        return (
          <GuiaRemisionModal
            visible={!!modals.guia}
            onHide={() => handleHideModal("guia")}
          />
        );
      case "adicionales":
        return (
          <DatosAdicionalesModal
            visible={!!modals.adicionales}
            onHide={() => handleHideModal("adicionales")}
          />
        );
      case "condicionPago":
        return (
          <CondicionPagoModal
            visible={!!modals.condicionPago}
            onHide={() => handleHideModal("condicionPago")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="col-span-4 w-full">
      <div className="items-stretch gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {inputItems.map(({ name, action, placeholder }) => (
          <div key={action} className="h-full min-h-[40px]">
            {inlineInputs[action] ? (
              <input
                type="text"
                placeholder={placeholder}
                autoFocus
                onBlur={() => blurInlineInput(action)}
                onKeyDown={(e) => e.key === "Enter" && blurInlineInput(action)}
                className={INPUT_CLASS}
              />
            ) : (
              <button
                onClick={() => toggleInlineInput(action)}
                className={BTN_CLASS}
                title={name}
              >
                {name}
              </button>
            )}
          </div>
        ))}

        <div className="relative h-full min-h-[40px]">
          <Menu model={otrosModalItems} popup ref={menuRef} />
          <button
            onClick={(e) => menuRef.current?.toggle(e)}
            className={BTN_CLASS}
          >
            OTROS
            <MenuIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {allComponents
        .filter((c) => !c.isInput)
        .map(({ action }) => (
          <div key={action}>{renderModal(action)}</div>
        ))}
    </div>
  );
};

export default VentasModal;
