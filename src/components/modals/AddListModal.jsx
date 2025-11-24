import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useState } from "react";

/**
 * Componente base para modales que agregan items a una lista
 * Maneja la lógica común de mostrar/ocultar formulario, lista de items, etc.
 */
const AddListModal = ({
    visible,
    onHide,
    onSave,
    title,
    addButtonLabel,
    items = [],
    setItems,
    renderFormFields,
    renderItemDisplay,
    validateForm,
    onAddItem,
    onRemoveItem,
    width = '450px'
}) => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const handleAdd = () => {
        if (validateForm && validateForm()) {
            onAddItem();
            setMostrarFormulario(false);
        }
    };

    const handleSave = () => {
        onSave(items);
        setItems([]);
        setMostrarFormulario(false);
        onHide();
    };

    const handleCancel = () => {
        setItems([]);
        setMostrarFormulario(false);
        onHide();
    };

    const headerContent = (
        <h2 className="text-xl font-bold">{title}</h2>
    );

    const footer = (
        <div className="flex justify-end items-center gap-3 w-full">
            <Button
                label="CANCELAR"
                onClick={handleCancel}
                className="p-button-text !text-gray-600 hover:!bg-gray-100 !font-semibold !py-2 !px-5"
            />
            <Button
                label="GUARDAR"
                onClick={handleSave}
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
            />
        </div>
    );

    return (
        <Dialog
            header={headerContent}
            visible={visible}
            style={{ width }}
            modal
            draggable={false}
            onHide={handleCancel}
            footer={footer}
            headerClassName="!p-4 bg-blue-700 text-white rounded-t-lg"
            contentClassName="p-5 bg-white"
            footerClassName="p-5 bg-white border-t-2 border-gray-200"
        >
            <div className="space-y-3">
                {items.length > 0 && (
                    <div className="space-y-2 mb-3">
                        {items.map((item) => (
                            <div key={item.id || item.tempId} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-1">
                                    {renderItemDisplay(item)}
                                </div>
                                <Button
                                    icon="pi pi-times"
                                    onClick={() => onRemoveItem(item.id || item.tempId)}
                                    className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-full !w-8 !h-8 !p-0"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {mostrarFormulario && (
                    <div className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        {renderFormFields()}

                        <div className="flex gap-2">
                            <Button
                                label="Agregar"
                                icon="pi pi-check"
                                onClick={handleAdd}
                                disabled={validateForm && !validateForm()}
                                className="flex-1 !bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-4 !rounded-lg disabled:!opacity-50"
                            />
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                onClick={() => setMostrarFormulario(false)}
                                className="flex-1 !bg-gray-300 hover:!bg-gray-400 !text-gray-700 !font-semibold !py-2 !px-4 !rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {!mostrarFormulario && (
                    <Button
                        label={addButtonLabel}
                        icon="pi pi-plus"
                        onClick={() => setMostrarFormulario(true)}
                        className="w-full !bg-white !text-blue-600 !border-2 !border-blue-600 hover:!bg-blue-50 !font-semibold !py-2 !px-4 !rounded-lg"
                    />
                )}
            </div>
        </Dialog>
    );
};

export default AddListModal;