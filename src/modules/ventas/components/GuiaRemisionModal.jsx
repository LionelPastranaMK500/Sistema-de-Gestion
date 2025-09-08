import { Dialog } from "primereact/dialog";

export default function GuiaRemisionModal({ visible, onHide }) {
    return (
        <Dialog
            header="Guía de Remisión"
            visible={visible}
            modal
            draggable={false}
            onHide={onHide}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
            <div>

            </div>
        </Dialog>
    );
}
