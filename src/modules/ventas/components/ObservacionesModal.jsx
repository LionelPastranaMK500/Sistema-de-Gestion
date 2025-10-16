import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import useVentaStore from "@stores/ventasStore";

const ObservacionesModal = ({ visible, onHide }) => {
    const { observaciones, setObservaciones } = useVentaStore();
    const [inputValue, setInputValue] = useState(observaciones || "");

    useEffect(() => {
        if (visible) {
            setInputValue(observaciones || "");
        }
    }, [visible, observaciones]);

    const handleSave = () => {
        setObservaciones(inputValue);
        onHide();
    };

    const headerContent = (
        <h2 className="text-xl font-bold">Agregar Observaciones</h2>
    );

    const footer = (
        <div className="flex justify-end items-center gap-3 w-full">
            <Button 
                label="Cancelar" 
                icon="pi pi-times" 
                onClick={onHide} 
                // Estilo grisáceo prominente para Cancelar
                className="p-button-secondary !bg-gray-300 !text-gray-700 hover:!bg-gray-400 !border-gray-400 !font-semibold !py-2 !px-5 !rounded-lg" 
            />
            <Button 
                label="Guardar" 
                icon="pi pi-check" 
                onClick={handleSave} 
                autoFocus 
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
            />
        </div>
    );

    return (
        <Dialog
            header={headerContent}
            visible={visible}
            style={{ width: '30vw' }}
            modal
            onHide={onHide}
            footer={footer}
            headerClassName="!p-4 bg-blue-700 text-white rounded-t-lg"
            contentClassName="p-5 bg-white"
            // CORRECCIÓN: Se usa p-5 para dar padding al footer y separar de los bordes
            footerClassName="p-5 bg-white border-t-2 border-gray-200"
        >
            <InputTextarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                placeholder="OBSERVACIONES"
                autoFocus
            />
        </Dialog>
    );
};

export default ObservacionesModal;