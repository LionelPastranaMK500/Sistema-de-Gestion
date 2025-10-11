// src/modules/configuracion/components/AlmacenModalAgregar.jsx
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { useState, useMemo } from 'react';
import { getSucursales } from '@services/generadorData';
import { CloseIcon } from '@constants/iconsConstants'; // Importar CloseIcon
import { toast } from 'react-toastify';

// Estilos de campo compactos
const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm";
const dropdownStyle = "w-full p-0 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm [&_.p-dropdown-label]:py-2.5 [&_.p-dropdown-label]:px-3";

const emptyAlmacen = {
    nombre: '',
    sucursal: null,
    direccion: '',
    isPrincipal: false,
};

export default function AlmacenModalAgregar({ visible, onHide, modo = 'add', data = null }) {
    const [almacenData, setAlmacenData] = useState(data || emptyAlmacen);
    const [loading, setLoading] = useState(false);

    const sucursales = useMemo(() => {
        return getSucursales().map(s => ({
            label: s.nombre,
            value: s.id
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setAlmacenData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleGuardar = () => {
        if (!almacenData.nombre || !almacenData.sucursal) {
            return toast.error("El nombre y la sucursal son obligatorios.");
        }

        setLoading(true);
        console.log("Guardando almacén:", almacenData);

        setTimeout(() => {
            setLoading(false);
            onHide(true);
            toast.success("Almacén guardado exitosamente.");
        }, 1500);
    };

    const dialogTitle = "Agregar Almacén";

    const headerContent = (
        <div className="flex justify-between items-center bg-blue-700 px-5 py-3 text-white">
            <h2 className="text-xl font-bold">{dialogTitle}</h2>
            <button
                onClick={() => onHide(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Cerrar"
            >
                <CloseIcon />
            </button>
        </div>
    );
        const footerContent = (
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-200 mt-6 px-6">
            {/* BOTÓN CANCELAR (Diseño: Texto con ícono "X") */}
            <Button
                label="CANCELAR"
                icon="pi pi-times" 
                onClick={() => onHide(false)}
                className="p-button-text !text-gray-600 !font-semibold !p-2 hover:!bg-gray-100"
                disabled={loading}
            />
            {/* BOTÓN GUARDAR (Diseño: Azul primario con ícono de check "✓") */}
            <Button
                label="GUARDAR"
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"} 
                onClick={handleGuardar}
                className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-5 !rounded-lg"
                disabled={loading}
            />
        </div>
    );


    return (
        <Dialog
            header={headerContent}
            visible={visible}
            // Ajustar el ancho para que se vea bien en desktop y móvil
            className="w-[min(600px,95vw)]"
            headerClassName="p-0" // Remover padding para que el headerContent tome control
            contentClassName="p-0 bg-white"
            modal
            closable={false} // Usamos el botón personalizado en el header
            draggable={false}
            footer={footerContent}
        >
            <div className="p-6 space-y-4">

                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="nombre"
                        name="nombre"
                        value={almacenData.nombre}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                        placeholder="Nombre" // Placeholder de la referencia
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                    </label>
                    <InputText
                        id="direccion"
                        name="direccion"
                        value={almacenData.direccion}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="Dirección" // Placeholder de la referencia
                    />
                </div>

                {/* Sucursal */}
                <div className="pt-4 border-t border-gray-200">
                    <label htmlFor="sucursal" className="block text-sm font-medium text-gray-700 mb-1">
                        Sucursal <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                        id="sucursal"
                        name="sucursal"
                        value={almacenData.sucursal}
                        options={sucursales}
                        onChange={handleChange}
                        placeholder="Seleccione una sucursal"
                        className={dropdownStyle}
                        required
                    />
                </div>

                {/* Checkbox Principal */}
                <div className="flex items-center mt-6 pt-4 border-t border-gray-200">
                    <Checkbox
                        inputId="isPrincipal"
                        name="isPrincipal"
                        checked={almacenData.isPrincipal}
                        onChange={handleChange}
                        className="p-checkbox-box-sm"
                    />
                    <label htmlFor="isPrincipal" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                        Establecer como almacén principal
                    </label>
                </div>

            </div>
        </Dialog>
    );
}