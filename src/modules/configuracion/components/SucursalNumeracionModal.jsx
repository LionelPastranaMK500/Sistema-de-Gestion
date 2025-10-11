import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { CloseIcon, AddIcon, RemoveCircleIcon } from "@constants/iconsConstants";
import { getTiposComprobante } from "@services/generadorData";
import { toast } from "react-toastify";

// Estilos comunes para inputs
const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm";
// Ajuste del estilo del Dropdown para manejar texto largo y evitar overflow horizontal
const dropdownStyle = "w-full p-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm [&_.p-dropdown-label]:whitespace-normal [&_.p-dropdown-label]:py-2.5 [&_.p-dropdown-label]:px-3";

/**
 * Modal para configurar la numeración de comprobantes de una sucursal.
 */
const SucursalNumeracionModal = ({ visible, sucursal, onHide }) => {
    const [numeracion, setNumeracion] = useState([]);
    
    // Incluir todos los tipos de comprobante de los dos archivos
    const todosLosComprobantes = [
        "FACTURA ELECTRÓNICA",
        "BOLETA DE VENTA ELECTRÓNICA",
        "NOTA DE CRÉDITO ELECTRÓNICA",
        "NOTA DE DÉBITO ELECTRÓNICA",
        "PROFORMA ELECTRÓNICA",
        "GUÍA DE REMISIÓN REMITENTE ELECTRÓNICA",
    ];
    
    // Función para mapear el Dropdown con el atributo title para UX
    const tiposOptions = todosLosComprobantes.map(t => ({ label: t, value: t, title: t }));

    useEffect(() => {
        if (visible && sucursal?.numeracion) {
            setNumeracion(sucursal.numeracion.map((item, index) => ({ ...item, tempId: index })));
        } else if (visible) {
            setNumeracion([]); 
        }
    }, [visible, sucursal]);

    const handleAddNumeracion = () => {
        setNumeracion(prev => [...prev, { tempId: Date.now(), tipo: '', serie: '', inicial: 1 }]);
    };

    const handleRemoveNumeracion = (tempId) => {
        setNumeracion(prev => prev.filter(item => item.tempId !== tempId));
    };

    const handleChange = (tempId, field, value) => {
        setNumeracion(prev => prev.map(item =>
            item.tempId === tempId ? { ...item, [field]: value } : item
        ));
    };

    const handleSubmit = () => {
        const dataToSave = numeracion.filter(n => n.tipo && n.serie);
        
        console.log(`Guardando numeración para ${sucursal.nombre}:`, dataToSave);
        
        toast.success(`Numeración actualizada para ${sucursal.nombre}.`);
        onHide();
    };

    const header = (
        <div className="flex justify-between items-center bg-blue-700 px-5 py-3 text-white">
            <h2 className="text-xl font-bold">Sucursal</h2>
            <button 
                onClick={onHide} 
                className="hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Cerrar"
            >
                <CloseIcon />
            </button>
        </div>
    );

    const footer = (
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200 mt-6 px-6">
            <Button 
                label="CANCELAR" 
                onClick={onHide} 
                className="!text-gray-600 !font-semibold hover:!bg-gray-100 !py-2 !px-5 !rounded-lg" 
                text 
            />
            <Button 
                label="GUARDAR" 
                onClick={handleSubmit}
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
            />
        </div>
    );

    const itemTemplate = (option) => (
        <span title={option.title}>{option.label}</span>
    );
    
    const tiposSeleccionados = numeracion.map(n => n.tipo).filter(Boolean);
    const tiposRestantes = todosLosComprobantes.filter(t => !tiposSeleccionados.includes(t));

    return (
        <Dialog
            header={header}
            visible={visible}
            onHide={onHide}
            modal
            closable={false}
            draggable={false}
            className="w-[min(850px,95vw)]" 
            headerClassName="p-0"
            contentClassName="p-0 bg-white max-h-[85vh] overflow-hidden" 
            footer={footer}
        >
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Configuración de Numeración
                </h3>

                {/* Contenedor de la tabla con scroll interno (si hay muchos items) */}
                <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                    
                    {/* Encabezado de la tabla de numeración */}
                    <div className="sticky top-0 bg-white z-10 grid grid-cols-[5fr_1fr_1fr_0.5fr] gap-4 font-bold text-gray-600 text-xs uppercase px-2 py-2 border-b border-gray-200">
                        <div>Tipo comprobante</div>
                        <div>Serie</div>
                        <div className="text-center">Número inicial</div>
                        <div></div>
                    </div>

                    {/* Lista de campos de numeración */}
                    <div className="space-y-3 pt-2">
                        {numeracion.map(item => (
                            <div key={item.tempId} className="grid grid-cols-[5fr_1fr_1fr_0.5fr] items-center gap-4">
                                
                                {/* Tipo Comprobante */}
                                <Dropdown
                                    options={tiposOptions}
                                    value={item.tipo}
                                    onChange={(e) => handleChange(item.tempId, 'tipo', e.value)}
                                    placeholder="Tipo comprobante"
                                    className={`${dropdownStyle}`}
                                    // << CORRECCIÓN CLAVE >>: Eliminar el max-height y overflow del panelClassName
                                    panelClassName="rounded-lg" 
                                    optionLabel="label"
                                    itemTemplate={itemTemplate}
                                />
                                
                                {/* Serie */}
                                <InputText
                                    value={item.serie}
                                    onChange={(e) => handleChange(item.tempId, 'serie', e.target.value.toUpperCase())}
                                    placeholder="FF01"
                                    className={inputStyle + " text-center"}
                                    title={`Serie actual: ${item.serie}`}
                                />

                                {/* Número Inicial */}
                                <InputText
                                    value={item.inicial}
                                    onChange={(e) => handleChange(item.tempId, 'inicial', e.target.value.replace(/[^0-9]/g, ''))}
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    className={inputStyle + " text-center"}
                                />

                                {/* Botón de eliminar */}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveNumeracion(item.tempId)}
                                    className="p-2.5 rounded-full bg-red-500 disabled:bg-gray-300 hover:bg-red-600 text-white transition-colors"
                                    aria-label="Remover"
                                >
                                    <RemoveCircleIcon className="!text-lg" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botón Añadir Fila */}
                <div className="flex justify-start pt-4">
                    <button
                        type="button"
                        onClick={handleAddNumeracion}
                        disabled={tiposRestantes.length === 0}
                        className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 px-4 py-2 border border-blue-300 rounded-md font-semibold text-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <AddIcon className="!text-lg" />
                        Añadir
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default SucursalNumeracionModal;