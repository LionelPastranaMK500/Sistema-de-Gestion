import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { componentsVentas } from "@constants/menuitemsConstants";
import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";
import { MenuIcon } from "@constants/iconsConstants";

export default function VentasModal() {
    const [modals, setModals] = useState({});
    const [inlineInputs, setInlineInputs] = useState({});
    const menu = useRef(null);

    const handleHideModal = (action) => setModals(prev => ({ ...prev, [action]: false }));
    const toggleInlineInput = (action) => setInlineInputs(prev => ({ ...prev, [action]: true }));
    const blurInlineInput = (action) => setInlineInputs(prev => ({ ...prev, [action]: false }));

    const otrosItems = componentsVentas
        .filter(c => !c.isInput)
        .map(({ name, action }) => ({
            label: name,
            command: () => setModals(prev => ({ ...prev, [action]: true }))
        }));

    const renderModal = (action) => {
        switch (action) {
            case "guia":
                return <GuiaRemisionModal visible={!!modals.guia} onHide={() => handleHideModal("guia")} />;
            case "adicionales":
                return <DatosAdicionalesModal visible={!!modals.adicionales} onHide={() => handleHideModal("adicionales")} />;
            case "condicionPago":
                return <CondicionPagoModal visible={!!modals.condicionPago} onHide={() => handleHideModal("condicionPago")} />;
            default:
                return null;
        }
    };

    return (
        <div>
            {componentsVentas
                .filter(c => c.isInput)
                .map(({ name, action, placeholder }) => (
                    <div key={action} style={{ display: "inline-block", margin: "5px" }}>
                        {inlineInputs[action] ? (
                            <input
                                type="text"
                                placeholder={placeholder}
                                autoFocus
                                onBlur={() => blurInlineInput(action)}
                            />
                        ) : (
                            <button onClick={() => toggleInlineInput(action)} >{name}</button>
                        )}
                    </div>
                ))
            }

            <div style={{ display: "inline-block", margin: "5px" }}>
                <Menu model={otrosItems} popup ref={menu} />
                <Button
                    onClick={e => menu.current.toggle(e)}
                >
                    <span>
                        OTROS
                        <MenuIcon />
                    </span>
                </Button>

            </div>

            {componentsVentas
                .filter(c => !c.isInput)
                .map(({ action }) => (
                    <div key={action}>
                        {renderModal(action)}
                    </div>
                ))
            }
        </div>
    );
}
