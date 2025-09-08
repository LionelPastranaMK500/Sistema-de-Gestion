import { useState, useRef } from "react";
import { Menu } from "primereact/menu";
import { componentsVentas } from "@constants/menuitemsConstants";
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
        .filter((c) => !c.isInput) // Guía también va aquí
        .map(({ name, action }) => ({
            label: name,
            command: () => setModals((prev) => ({ ...prev, [action]: true })),
        }));

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
            {/* Ahora: grid de 4 columnas, cada botón ocupa toda la celda */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {/* Botones con inline input */}
                {inputItems.map(({ name, action, placeholder }) => (
                    <div key={action} className="w-full">
                        {inlineInputs[action] ? (
                            <input
                                type="text"
                                placeholder={placeholder}
                                autoFocus
                                onBlur={() => blurInlineInput(action)}
                                onKeyDown={(e) => e.key === "Enter" && blurInlineInput(action)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-2 ring-transparent focus:ring-blue-400"
                            />
                        ) : (
                            <button
                                onClick={() => toggleInlineInput(action)}
                                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                {name}
                            </button>
                        )}
                    </div>
                ))}

                {/* Botón OTROS, ahora con mismo diseño que los demás */}
                <div className="relative w-full">
                    <Menu model={otrosModalItems} popup ref={menuRef} />
                    <button
                        onClick={(e) => menuRef.current?.toggle(e)}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        OTROS
                        <MenuIcon />
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
