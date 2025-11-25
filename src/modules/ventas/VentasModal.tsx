import { useState, useRef } from "react";
import { Menu } from "primereact/menu";
import { componentsVentas } from "@constants/menuItems";
import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";
import { MenuIcon } from "@constants/icons";

const VentasModal = () => {
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
            <div className="items-stretch gap-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
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

                <div className="relative h-full">
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

            {componentsVentas
                .filter((c) => !c.isInput)
                .map(({ action }) => (
                    <div key={action}>{renderModal(action)}</div>
                ))}
        </div>
    );
}


export default VentasModal;