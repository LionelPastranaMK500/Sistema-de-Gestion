import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function AlmacenEliminarModal({ visible, onHide, onConfirm, almacenData }) {

    const headerContent = (
        <h3 className="text-xl font-bold">Confirmar Eliminación</h3>
    );

    const footerContent = (
        <div className="flex justify-end items-center gap-3">

            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => onHide(false)}
                className="p-button-text !text-gray-700 !font-semibold hover:!bg-gray-100"
            />

            <Button
                label="Sí, Eliminar"
                icon="pi pi-trash"
                onClick={onConfirm}
                autoFocus
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
            />
        </div>
    );

    return (
        <Dialog
            header={headerContent}
            visible={visible}
            onHide={() => onHide(false)}
            footer={footerContent}
            modal
            className="w-[min(450px,95vw)]"
            headerClassName="!p-4 bg-blue-700 text-white rounded-t-lg"
            contentClassName="p-0 pt-4"
        >

            <div className="flex items-start gap-3 px-5 pb-5">

                <i
                    className="pi pi-exclamation-triangle text-3xl flex-shrink-0"
                    style={{ color: '#dc3545' }}
                    aria-hidden="true"
                />


                <div className="text-gray-700 text-sm leading-snug w-full">


                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg shadow-inner">


                        <p className="mb-3 font-medium text-red-700">
                            ¿Está seguro de que desea eliminar permanentemente el siguiente almacén?
                        </p>

                        <div className="mb-3 p-2 bg-white border border-red-300 rounded-md text-center">
                            <p className="font-bold text-base text-red-800 uppercase">
                                {almacenData?.nombre || 'ALMACÉN DESCONOCIDO'}
                            </p>
                        </div>


                        <p className="font-bold text-red-800 mt-2">¡Advertencia!</p>
                        <p className="mt-1 text-red-700 text-sm">
                            Esta acción no se puede deshacer. Al eliminarlo, se perderá **permanentemente** toda la información, historial e inventario asociado a este almacén.
                        </p>
                    </div>

                </div>
            </div>
        </Dialog>
    );
}