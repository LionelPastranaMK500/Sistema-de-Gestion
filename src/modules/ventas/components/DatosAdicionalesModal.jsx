import { Dialog } from "primereact/dialog";

const DatosAdicionalesModal = ({ visible, onHide }) => {
    return (
        <Dialog
            header="Datos Adicionales"
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

export default DatosAdicionalesModal;