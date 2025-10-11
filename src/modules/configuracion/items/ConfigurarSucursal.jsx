import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { MoreVertIcon, KeyboardArrowLeftIcon } from "@constants/iconsConstants";
import { getSucursales } from "@services/generadorData";
import SucursalModal from "../components/Sucursalmodal";
import SucursalNumeracionModal from "../components/SucursalNumeracionModal"; 

export default function ConfigurarSucursal() {
    const navigate = useNavigate();
    const [sucursales, setSucursales] = useState([]);
    
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [infoModalMode, setInfoModalMode] = useState('add');
    
    const [numModalVisible, setNumModalVisible] = useState(false);
    
    const [selectedSucursal, setSelectedSucursal] = useState(null);

    useEffect(() => {
        setSucursales(getSucursales());
    }, []);

    const handleAgregar = () => {
        setInfoModalMode('add');
        setSelectedSucursal(null);
        setInfoModalVisible(true);
    };

    const handleConfigurar = (sucursal) => {
        setSelectedSucursal(sucursal);
        setNumModalVisible(true);
    };

    const handleVolver = () => {
        navigate('/configuracion');
    };

    return (
        <>
            <div className="flex flex-col w-full h-full p-6 bg-gray-50 overflow-y-auto">
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
                        <h2 className="text-2xl font-bold text-gray-800">Sucursales</h2>
                    </div>
                    
                    {/* Botón AGREGAR */}
                    <Button
                        label="AGREGAR"
                        onClick={handleAgregar}
                        className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-6 !rounded-lg !text-sm"
                    />
                </div>

                {/* Contenedor principal de la tabla (Diseño del boceto) */}
                <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                    {/* Encabezados de la lista */}
                    <div className="grid grid-cols-12 items-center bg-gray-100/70 border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 text-sm">
                        {/* Nombre - 5/12 */}
                        <div className="col-span-5">Nombre</div>
                        {/* Vendedores - 3/12 */}
                        <div className="col-span-3">Vendedores</div>
                        {/* Almacenes - 3/12 */}
                        <div className="col-span-3">Almacenes</div>
                        {/* Opciones - 1/12 (vacío) */}
                        <div className="col-span-1"></div>
                    </div>

                    {/* Filas de Sucursales */}
                    <div className="divide-y divide-gray-200">
                        {sucursales.map((sucursal) => (
                            <div
                                key={sucursal.id}
                                className="grid grid-cols-12 items-center px-6 py-4 text-gray-800 text-sm hover:bg-gray-50 transition-colors"
                            >
                                {/* Nombre */}
                                <div className="col-span-5 font-medium">
                                    {sucursal.nombre}
                                </div>
                                
                                {/* Vendedores */}
                                <div className="col-span-3 text-gray-500">
                                    {sucursal.vendedores?.length > 0 ? `${sucursal.vendedores.length} Vendedores` : '-'}
                                </div>

                                {/* Almacenes */}
                                <div className="col-span-3 flex flex-wrap gap-1">
                                    {sucursal.almacenes?.map((almacen, idx) => (
                                        <span 
                                            key={idx}
                                            className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                                        >
                                            {almacen}
                                        </span>
                                    ))}
                                </div>

                                {/* Opciones (MoreVertIcon) */}
                                <div className="col-span-1 flex justify-end">
                                    <button
                                        onClick={() => handleConfigurar(sucursal)} // Llama al modal de numeración
                                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                        aria-label={`Opciones de ${sucursal.nombre}`}
                                        title="Configurar Numeración"
                                    >
                                        <MoreVertIcon className="!w-5 !h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mensaje de lista vacía */}
                    {sucursales.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            No hay sucursales registradas.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Sucursal (Agregar/Editar Info) */}
            <SucursalModal
                visible={infoModalVisible}
                mode={infoModalMode}
                sucursalData={selectedSucursal}
                onHide={() => setInfoModalVisible(false)}
            />

            {/* Modal de Numeración */}
            {selectedSucursal && (
                <SucursalNumeracionModal
                    visible={numModalVisible}
                    sucursal={selectedSucursal}
                    onHide={() => setNumModalVisible(false)}
                />
            )}
        </>
    );
}