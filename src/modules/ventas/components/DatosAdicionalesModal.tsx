import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useDynamicList } from "@hooks/data";
import { useState, useEffect } from "react";
import AddListModal from "@components/modals/AddListModal";
import useVentaStore from "@stores/ventasStore";

const DatosAdicionalesModal = ({ visible, onHide }) => {
    const { datosAdicionales, setDatosAdicionales } = useVentaStore();
    const { items, addItem, removeItem, setItems } = useDynamicList(datosAdicionales || []);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');

    useEffect(() => {
        if (visible) {
            setItems(datosAdicionales || []);
        }
    }, [visible, datosAdicionales, setItems]);

    const handleSave = () => {
        setDatosAdicionales(items);
        onHide();
    };

    const handleAddItem = () => {
        if (titulo && descripcion) {
            addItem({ titulo, descripcion });
            setTitulo('');
            setDescripcion('');
        }
    };

    const renderFormFields = () => (
        <div className="flex gap-2">
            <InputText
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título *"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <InputText
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción *"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Button
                icon="pi pi-minus-circle"
                onClick={() => {
                    setTitulo('');
                    setDescripcion('');
                }}
                className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-full !w-10 !h-10 !p-0"
            />
        </div>
    );

    const renderItemDisplay = (item) => (
        <div className="flex gap-2 flex-1">
            <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
                <label className="block text-xs text-gray-600 mb-1">Título *</label>
                <span className="text-sm text-gray-700">{item.titulo}</span>
            </div>
            <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
                <label className="block text-xs text-gray-600 mb-1">Descripción *</label>
                <span className="text-sm text-gray-700">{item.descripcion}</span>
            </div>
        </div>
    );

    return (
        <AddListModal
            visible={visible}
            onHide={onHide}
            onSave={handleSave}
            title="Otros datos adicionales"
            addButtonLabel="AGREGAR DATO ADICIONAL"
            items={items}
            setItems={setItems}
            renderFormFields={renderFormFields}
            renderItemDisplay={renderItemDisplay}
            validateForm={() => titulo && descripcion}
            onAddItem={handleAddItem}
            onRemoveItem={removeItem}
            width="500px"
        />
    );
};

export default DatosAdicionalesModal;