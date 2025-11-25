import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CloseIcon } from '@constants/icons';
import { toast } from 'react-toastify';
import { useFormInput } from '@hooks/forms';

const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

export default function AlmacenModal({ visible, onHide, mode = 'add', data = null }) {
    const { formData, handleChange, resetForm, setFormData } = useFormInput({
        nombre: '',
        direccion: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && mode === 'edit' && data) {
            setFormData({
                id: data.id,
                nombre: data.nombre || '',
                direccion: data.direccion || '',
            });
        } else if (visible && mode === 'add') {
            resetForm();
        }
    }, [visible, mode, data]);

    const handleGuardar = () => {
        if (!formData.nombre) {
            return toast.error("El nombre es obligatorio.");
        }

        setLoading(true);

        const action = mode === 'add' ? 'Guardando' : 'Actualizando';
        const actionLabel = mode === 'add' ? 'agregado' : 'actualizado';
        console.log(`${action} almacén:`, formData);

        setTimeout(() => {
            setLoading(false);
            onHide(true);
            toast.success(`Almacén ${actionLabel} exitosamente.`);
        }, 1500);
    };

    const dialogTitle = mode === 'add' ? 'Almacén' : 'Administrar Almacén';
    const primaryButtonLabel = mode === 'add' ? 'GUARDAR' : 'ACTUALIZAR';

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
            <Button
                label="CANCELAR"
                icon="pi pi-times"
                onClick={() => onHide(false)}
                className="p-button-text !text-gray-600 !font-semibold !p-2 hover:!bg-gray-100"
                disabled={loading}
            />
            <Button
                label={primaryButtonLabel}
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
            className="w-[min(600px,95vw)]"
            headerClassName="p-0"
            contentClassName="p-0 bg-white"
            modal
            closable={false}
            draggable={false}
            footer={footerContent}
        >
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <InputText
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange('nombre')}
                        className={inputStyle}
                        required
                        placeholder="Nombre"
                    />
                </div>

                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                    </label>
                    <InputText
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange('direccion')}
                        className={inputStyle}
                        placeholder="Dirección"
                    />
                </div>
            </div>
        </Dialog>
    );
}