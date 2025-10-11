import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CloseIcon, AddIcon, RemoveCircleIcon } from "@constants/iconsConstants";
import { getUsuarios, getSucursales } from "@services/generadorData";
import { toast } from "react-toastify";

// Estilos comunes para inputs de texto (Ajuste a p-2.5 para menor altura)
const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm";
// Estilos comunes para Dropdown (Ajuste a p-0 y forzar p-2.5 en label para menor altura)
const dropdownStyle = "w-full p-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm [&_.p-dropdown-label]:py-2.5 [&_.p-dropdown-label]:px-3";

/**
 * Componente modal para agregar o editar la información básica de Sucursales.
 */
const SucursalModal = ({ visible, mode, sucursalData, onHide }) => {
    const [formData, setFormData] = useState({
        nombre: 'LUBRICANTES CLAUDIA', 
        direccion: 'AVENIDA TOMAS VALLE 3911 - CALLAO', 
        vendedores: [], 
        almacenes: [{ id: 1, nombre: 'LUBRICANTES CLAUDIA' }],
        selectedVendedor: null, 
    });
    
    // Simulación de almacenes y vendedores disponibles
    const almacenesDisponibles = getSucursales().map(s => ({ 
        label: s.almacenes[0] || s.nombre,
        value: s.almacenes[0] || s.nombre,
    }));
    const vendedoresOptions = getUsuarios().map(u => ({ 
        label: `${u.nombres} ${u.apellidoPaterno} (${u.rol})`, 
        value: u.correo 
    }));

    useEffect(() => {
        if (visible) {
            if (mode === 'edit' && sucursalData) {
                setFormData({
                    nombre: sucursalData.nombre || '',
                    direccion: sucursalData.direccion || '',
                    vendedores: sucursalData.vendedores || [],
                    almacenes: sucursalData.almacenes.map((nombre, i) => ({ id: i, nombre: nombre })),
                    selectedVendedor: null,
                });
            } else {
                setFormData({ 
                    nombre: 'LUBRICANTES CLAUDIA', 
                    direccion: 'AVENIDA TOMAS VALLE 3911 - CALLAO', 
                    vendedores: [], 
                    almacenes: [{ id: 1, nombre: 'LUBRICANTES CLAUDIA' }],
                    selectedVendedor: null,
                });
            }
        }
    }, [visible, mode, sucursalData]);

    const handleInputChange = (e, field) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleDropdownChange = (value, field) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleAddVendedor = () => {
        if (!formData.selectedVendedor) {
            return toast.warn("Selecciona un usuario primero.");
        }
        if (formData.vendedores.includes(formData.selectedVendedor)) {
            return toast.info("El vendedor ya está asignado.");
        }
        setFormData(prev => ({ 
            ...prev, 
            vendedores: [...prev.vendedores, prev.selectedVendedor],
            selectedVendedor: null, 
        }));
    };

    const handleRemoveVendedor = (email) => {
        setFormData(prev => ({
            ...prev,
            vendedores: prev.vendedores.filter(v => v !== email),
        }));
    };

    const handleRemoveAlmacen = (id) => {
        if (formData.almacenes.length <= 1) return;
        setFormData(prev => ({
            ...prev,
            almacenes: prev.almacenes.filter(a => a.id !== id),
        }));
    };

    const handleAddAlmacen = () => {
        setFormData(prev => ({
            ...prev,
            almacenes: [...prev.almacenes, { id: Date.now(), nombre: '' }],
        }));
    };

    const handleAlmacenSelect = (event, id) => {
        setFormData(prev => ({
            ...prev,
            almacenes: prev.almacenes.map(almacen =>
                almacen.id === id ? { ...almacen, nombre: event.value } : almacen
            ),
        }));
    };

    const handleSubmit = () => {
        if (!formData.nombre || !formData.direccion) {
            return toast.error("El nombre y la dirección son obligatorios.");
        }
        
        const action = mode === 'add' ? 'AGREGAR' : 'EDITAR';
        console.log(`${action} Sucursal:`, formData);
        
        toast.success(`Sucursal ${action === 'AGREGAR' ? 'agregada' : 'actualizada'} con éxito.`);
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
    
    // Función auxiliar para obtener el nombre completo del vendedor
    const getVendedorLabel = (email) => {
        const vendedor = vendedoresOptions.find(o => o.value === email);
        return vendedor?.label || email;
    };

    return (
        <Dialog
            header={header}
            visible={visible}
            onHide={onHide}
            modal
            closable={false}
            draggable={false}
            className="w-[min(650px,95vw)]"
            headerClassName="p-0"
            contentClassName="p-0 bg-white"
            footer={footer}
        >
            {/* Cuerpo del modal */}
            <div className="space-y-6 p-6">
                
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <InputText
                        placeholder="Nombre de la sucursal"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange(e, 'nombre')}
                        className={inputStyle}
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Dirección</label>
                    <InputText
                        placeholder="Dirección completa"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange(e, 'direccion')}
                        className={inputStyle}
                    />
                </div>

                {/* VENDEDORES ASIGNADOS (Sección dinámica) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">VENDEDORES ASIGNADOS</label>
                    
                    {/* Fila de asignación de usuario */}
                    <div className="flex items-center gap-2">
                        <Dropdown
                            options={vendedoresOptions}
                            value={formData.selectedVendedor}
                            onChange={(e) => handleDropdownChange(e.value, 'selectedVendedor')} 
                            placeholder="Usuario"
                            className={`${dropdownStyle} flex-1`}
                            panelClassName="rounded-lg max-h-48 overflow-y-auto"
                            optionLabel="label"
                        />
                        <button
                            type="button"
                            onClick={handleAddVendedor}
                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                            aria-label="Agregar vendedor"
                        >
                            <AddIcon className="!text-lg" />
                        </button>
                    </div>

                    {/* Lista de vendedores asignados */}
                    {formData.vendedores.map((email) => (
                        <div key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 mt-2 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-700">{getVendedorLabel(email)}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveVendedor(email)} 
                                className="text-red-500 hover:text-red-700 p-1 rounded"
                                aria-label="Eliminar vendedor"
                            >
                                <RemoveCircleIcon className="!text-lg" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* ALMACENES VINCULADOS (Sección dinámica) */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ALMACENES VINCULADOS</label>
                    
                    {formData.almacenes.map((almacen, index) => (
                        <div key={almacen.id} className="flex items-center gap-2 mb-3">
                            <Dropdown
                                options={almacenesDisponibles}
                                placeholder="Almacen"
                                value={almacen.nombre}
                                onChange={(e) => handleAlmacenSelect(e, almacen.id)}
                                className={`${dropdownStyle} flex-1`}
                                panelClassName="rounded-lg max-h-48 overflow-y-auto"
                                optionLabel="label"
                            />
                            {/* Botón de remover */}
                            <button
                                type="button"
                                onClick={() => handleRemoveAlmacen(almacen.id)}
                                disabled={formData.almacenes.length === 1}
                                className="p-2 rounded-full bg-red-500 disabled:bg-gray-300 hover:bg-red-600 text-white transition-colors"
                                aria-label="Remover almacén"
                            >
                                <RemoveCircleIcon className="!text-lg" />
                            </button>
                            {/* Botón Añadir (simula el ícono '+' de la imagen, alineado con el campo) */}
                            {(index === formData.almacenes.length - 1) && (
                                <button
                                    type="button"
                                    onClick={handleAddAlmacen}
                                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                    aria-label="Agregar almacén"
                                >
                                    <AddIcon className="!text-lg" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Dialog>
    );
}

export default SucursalModal;