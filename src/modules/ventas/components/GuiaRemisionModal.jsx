import { Dialog } from "primereact/dialog";

const GuiaRemisionModal = ({ visible, onHide }) => {
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
export default GuiaRemisionModal;