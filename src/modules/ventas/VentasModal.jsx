import { useState, useRef } from "react";
import { Menu } from "primereact/menu";
import { componentsVentas } from "@constants/menuItemsConstants";
import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";
import { MenuIcon } from "@constants/iconsConstants";

export default function VentasModal() {
    const [modals, setModals] = useState({});
    const [inlineInputs, setInlineInputs] = useState({});
    const menuRef = useRef(null);

    const handleHideModal = (action) =>
        setModals((prev) => ({ ...prev, [action]: false }));

    const toggleInlineInput = (action) =>
        setInlineInputs((prev) => ({ ...prev, [action]: true }));

    const blurInlineInput = (action) =>
        setInlineInputs((prev) => ({ ...prev, [action]: false }));

    const inputItems = componentsVentas.filter((c) => c.isInput);
    const otrosModalItems = componentsVentas
        .filter((c) => !c.isInput) // Guía incluida aquí
        .map(({ name, action }) => ({
            label: name,
            command: () => setModals((prev) => ({ ...prev, [action]: true })),
        }));

    // 👉 CLASES UNIFICADAS (misma altura/estilo para TODOS)
    const BTN_CLASS =
        "w-full h-12 rounded-md bg-blue-600 px-4 text-sm font-medium text-white " +
        "flex items-center justify-center gap-2 leading-none transition hover:bg-blue-700";
    const INPUT_CLASS =
        "w-full h-12 rounded-md border border-gray-300 px-3 text-sm outline-none " +
        "ring-2 ring-transparent focus:ring-blue-400";

    const renderModal = (action) => {
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
            {/* 4 columnas simétricas; estiro hijos para igualar alturas */}
            <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {/* Botones tipo input (PLACA, O. COMPRA, OBSERVACIONES, D. ADICIONALES) */}
                {inputItems.map(({ name, action, placeholder }) => (
                    <div key={action} className="h-full">
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

                {/* Botón OTROS — EXACTAMENTE MISMAS DIMENSIONES */}
                <div className="relative h-full">
                    <Menu model={otrosModalItems} popup ref={menuRef} />
                    <button
                        onClick={(e) => menuRef.current?.toggle(e)}
                        className={BTN_CLASS}
                    >
                        OTROS
                        {/* Limito el tamaño del ícono para no variar la altura */}
                        <MenuIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Montaje de modales */}
            {componentsVentas
                .filter((c) => !c.isInput)
                .map(({ action }) => (
                    <div key={action}>{renderModal(action)}</div>
                ))}
        </div>
    );
}
