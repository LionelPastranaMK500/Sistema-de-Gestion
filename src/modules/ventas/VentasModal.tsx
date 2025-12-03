import { useState, useRef } from "react";
import { Menu } from "primereact/menu";
import { componentsVentas } from "@/constants/menuItems";
import { MenuIcon } from "@/constants/icons";
import useVentaStore from "@/stores/ventasStore";

import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";

import { VentaComponentItem, BaseVentaModalProps } from "@/types/ui/modules";

const INPUT_CLASS =
  "w-full h-full px-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-semibold text-gray-700 placeholder-gray-400 shadow-sm transition-all";
const BTN_CLASS =
  "w-full h-full flex items-center justify-center gap-2 px-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-xs font-bold text-gray-600 uppercase tracking-wide shadow-sm transition-all active:scale-95";

const VentasModal = () => {
  // Store
  const {
    placa,
    setPlaca,
    ordenCompra,
    setOrdenCompra,
    observaciones,
    setObservaciones,
    condicionPago,
    datosAdicionales,
    guiasRemision,
  } = useVentaStore();

  // Estado Local UI
  const [modals, setModals] = useState<Record<string, boolean>>({});
  const [inlineInputs, setInlineInputs] = useState<Record<string, boolean>>({});
  const menuRef = useRef<Menu>(null);

  const handleHideModal = (action: string) =>
    setModals((prev) => ({ ...prev, [action]: false }));

  const toggleInlineInput = (action: string) =>
    setInlineInputs((prev) => ({ ...prev, [action]: true }));

  const blurInlineInput = (action: string) =>
    setInlineInputs((prev) => ({ ...prev, [action]: false }));

  // Casting correcto con el nuevo tipo de UI
  const allComponents = componentsVentas as VentaComponentItem[];
  const inputItems = allComponents.filter((c) => c.isInput);

  const otrosModalItems = allComponents
    .filter((c) => !c.isInput)
    .map(({ name, action }) => ({
      label: `${name} ${(() => {
        switch (action) {
          case "guia":
            return guiasRemision && guiasRemision.length > 0 ? " ✓" : "";
          case "adicionales":
            return datosAdicionales && datosAdicionales.length > 0 ? " ✓" : "";
          case "condicionPago":
            return (condicionPago as any)?.id ||
              (condicionPago as any)?.condicion
              ? " ✓"
              : "";
          default:
            return "";
        }
      })()}`,
      command: () => setModals((prev) => ({ ...prev, [action]: true })),
    }));

  const renderModal = (action: string) => {
    // Usamos la interfaz base de UI para las props
    const modalProps: BaseVentaModalProps = {
      visible: !!modals[action],
      onHide: () => handleHideModal(action),
    };

    switch (action) {
      case "guia":
        return <GuiaRemisionModal {...modalProps} />;
      case "adicionales":
        return <DatosAdicionalesModal {...modalProps} />;
      case "condicionPago":
        return <CondicionPagoModal {...modalProps} />;
      default:
        return null;
    }
  };

  const getStoreBinding = (action: string) => {
    switch (action) {
      case "placa":
        return { value: placa, onChange: setPlaca };
      case "ordenCompra":
        return { value: ordenCompra, onChange: setOrdenCompra };
      case "observaciones":
        return { value: observaciones, onChange: setObservaciones };
      default:
        return {
          value: "",
          onChange: (v: string) => console.warn(`No handler for ${action}`, v),
        };
    }
  };

  return (
    <div className="col-span-4 w-full">
      <div className="items-stretch gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {inputItems.map(({ name, action, placeholder }) => {
          const { value, onChange } = getStoreBinding(action);
          const isEditing = inlineInputs[action];
          const hasValue = !!value;

          return (
            <div key={action} className="h-full min-h-[40px]">
              {isEditing ? (
                <input
                  type="text"
                  placeholder={placeholder}
                  autoFocus
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={() => blurInlineInput(action)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && blurInlineInput(action)
                  }
                  className={INPUT_CLASS}
                />
              ) : (
                <button
                  onClick={() => toggleInlineInput(action)}
                  className={`${BTN_CLASS} ${
                    hasValue
                      ? "bg-green-50 border-green-300 text-green-700"
                      : ""
                  }`}
                  title={name}
                >
                  {name} {hasValue && "✓"}
                </button>
              )}
            </div>
          );
        })}

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
