import { Dialog } from "primereact/dialog";

const CondicionPagoModal = ({ visible, onHide })  => {
    return (
        <Dialog
            header="Condición de Pago"
            modal
            draggable={false}
            visible={visible}
            onHide={onHide}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
        >
            <div>

            </div>
        </Dialog>
    );
}

export default CondicionPagoModal;
