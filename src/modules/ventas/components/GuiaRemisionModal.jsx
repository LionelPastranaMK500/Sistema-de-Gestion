import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import AddListModal from "@components/modals/AddListModal";
import useVentaStore from "@stores/ventasStore";

const GuiaRemisionModal = ({ visible, onHide }) => {
    const { guiasRemision, setGuiasRemision } = useVentaStore();
    const [guias, setGuias] = useState(guiasRemision || []);
    const [tipo, setTipo] = useState('REMITENTE');
    const [serie, setSerie] = useState('');
    const [numero, setNumero] = useState('');

    useEffect(() => {
        if (visible) {
            setGuias(guiasRemision || []);
        }
    }, [visible, guiasRemision]);

    const handleSave = () => {
        setGuiasRemision(guias);
        onHide();
    };

    const tiposGuia = [
        { label: 'REMITENTE', value: 'REMITENTE' },
        { label: 'TRANSPORTISTA', value: 'TRANSPORTISTA' },
    ];

    const handleAddItem = () => {
        const nuevaGuia = { tipo, serie, numero, id: Date.now() };
        setGuias([...guias, nuevaGuia]);
        setSerie('');
        setNumero('');
        setTipo('REMITENTE');
    };

    const handleRemoveItem = (id) => {
        setGuias(guias.filter(g => g.id !== id));
    };

    const handleSetItems = (newItems) => {
        setGuias(newItems);
        setSerie('');
        setNumero('');
        setTipo('REMITENTE');
    };

    const renderFormFields = () => (
        <>
            <div>
                <label className="block mb-2 text-sm text-gray-600">Tipo</label>
                <Dropdown
                    value={tipo}
                    options={tiposGuia}
                    onChange={(e) => setTipo(e.value)}
                    className="w-full"
                />
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <label className="block mb-2 text-sm text-gray-600">Serie *</label>
                    <InputText
                        value={serie}
                        onChange={(e) => setSerie(e.target.value.toUpperCase())}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex-1">
                    <label className="block mb-2 text-sm text-gray-600">Número *</label>
                    <div className="flex gap-2">
                        <InputText
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            type="number"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Button
                            icon="pi pi-minus-circle"
                            onClick={() => {
                                setSerie('');
                                setNumero('');
                            }}
                            className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-full !w-10 !h-10 !p-0"
                        />
                    </div>
                </div>
            </div>
        </>
    );

    const renderItemDisplay = (guia) => (
        <div className="flex gap-2 flex-1">
            <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
                <label className="block text-xs text-gray-600 mb-1">Tipo *</label>
                <span className="text-sm text-gray-700">{guia.tipo}</span>
            </div>
            <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
                <label className="block text-xs text-gray-600 mb-1">Serie *</label>
                <span className="text-sm text-gray-700">{guia.serie}</span>
            </div>
            <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
                <label className="block text-xs text-gray-600 mb-1">Número *</label>
                <span className="text-sm text-gray-700">{guia.numero}</span>
            </div>
        </div>
    );

    return (
        <AddListModal
            visible={visible}
            onHide={onHide}
            onSave={handleSave}
            title="Guías de remisión"
            addButtonLabel="AGREGAR GUÍA DE REMISIÓN"
            items={guias}
            setItems={handleSetItems}
            renderFormFields={renderFormFields}
            renderItemDisplay={renderItemDisplay}
            validateForm={() => serie && numero}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            width="450px"
        />
    );
};

export default GuiaRemisionModal;