import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu"; 
import { MoreVertIcon, KeyboardArrowLeftIcon } from "@constants/iconsConstants";
import { getAlmacenes } from "@services/generadorData";
import { toast } from "react-toastify";
import AlmacenModal from "../components/AlmacenModal"; 
import AlmacenEliminarModal from "../components/AlmacenEliminarModal"; 

export default function ConfigurarAlmacen() {
    const navigate = useNavigate();
    const [almacenes, setAlmacenes] = useState([]);
    
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const [modalMode, setModalMode] = useState('add');
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false); 
    const menuRef = useRef(null);
    const [selectedAlmacen, setSelectedAlmacen] = useState(null);

    useEffect(() => {
        setAlmacenes(getAlmacenes());
    }, []);

    const handleAgregar = () => {
        setModalMode('add');
        setSelectedAlmacen(null);
        setIsModalVisible(true);
    };

    const handleCloseModal = (reload = false) => {
        setIsModalVisible(false); 
        setIsDeleteConfirmVisible(false); 
        setSelectedAlmacen(null); 
        setModalMode('add');
        if (reload) {
            setAlmacenes(getAlmacenes()); 
        }
    };
    
    const ejecutarEliminacionConfirmada = () => {
        if (!selectedAlmacen) return;
        setAlmacenes(prev => prev.filter(a => a.id !== selectedAlmacen.id));
        toast.success(`Almacén ${selectedAlmacen.nombre} eliminado.`);
        handleCloseModal(true); 
    };

    const handleEliminar = () => {
        setIsDeleteConfirmVisible(true);
    };

    const handleAdministrar = () => {
        setModalMode('edit');
        setIsModalVisible(true);
    };

    const handleVolver = () => {
        navigate('/configuracion');
    };

    const menuItems = [
        {
            label: 'Administrar',
            icon: 'pi pi-pencil',
            command: handleAdministrar 
        },
        {
            label: 'Eliminar',
            icon: 'pi pi-trash',
            command: handleEliminar, 
            className: 'text-red-500 hover:bg-red-50/70',
        }
    ];

    const toggleMenu = (e, almacen) => {
        setSelectedAlmacen(almacen);
        menuRef.current?.toggle(e);
    };


    return (
        <div className="flex flex-col w-full h-full p-6 bg-gray-50 overflow-y-auto">
            {/* Menú flotante */}
            <Menu model={menuItems} popup ref={menuRef} />
            
            {/* Header de la sección */}
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleVolver}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Volver a configuración"
                    >
                        <KeyboardArrowLeftIcon />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800">Almacenes</h2>
                </div>

                {/* Botón AGREGAR */}
                <Button
                    label="AGREGAR"
                    onClick={handleAgregar}
                    className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-6 !rounded-lg !text-sm"
                />
            </div>

            {/* Contenedor principal de la tabla */}
            <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 items-center bg-gray-100/70 border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 text-sm">
                    <div className="col-span-6">Nombre</div>
                    <div className="col-span-5">Dirección</div>
                    <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-200">
                    {almacenes.map((almacen) => (
                        <div
                            key={almacen.id}
                            className="grid grid-cols-12 items-center px-6 py-4 text-gray-800 text-sm hover:bg-gray-50 transition-colors"
                        >
                            <div className="col-span-6 font-medium">{almacen.nombre}</div>
                            <div className="col-span-5 text-gray-500">{almacen.direccion || '-'}</div>
                            <div className="col-span-1 flex justify-end">
                                {/* Botón para desplegar el menú */}
                                <button
                                    onClick={(e) => toggleMenu(e, almacen)}
                                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                    aria-label={`Opciones de ${almacen.nombre}`}
                                    title="Más opciones"
                                >
                                    <MoreVertIcon className="!w-5 !h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {almacenes.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                        No hay almacenes registrados.
                    </div>
                )}
            </div>

            {/* Modal Unificado (Agregar/Administrar) */}
            <AlmacenModal
                visible={isModalVisible}
                onHide={handleCloseModal}
                mode={modalMode} 
                data={selectedAlmacen}
            />

            {/* TU DIÁLOGO DE CONFIRMACIÓN DE ELIMINACIÓN INTEGRADO */}
            <AlmacenEliminarModal
                visible={isDeleteConfirmVisible} 
                onHide={handleCloseModal}
                onConfirm={ejecutarEliminacionConfirmada}
                almacenData={selectedAlmacen} 
            />
        </div>
    );
}