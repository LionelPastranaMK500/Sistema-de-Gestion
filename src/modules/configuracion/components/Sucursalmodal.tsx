import { useEffect, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { CloseIcon, AddIcon, RemoveCircleIcon } from "@constants/icons";
import { getUsuarios, getSucursales } from "@services/generadorData";
import { getActiveCompany } from "@services/auth/authServices";
import { toast } from "react-toastify";
import { useFormInput } from "@hooks/forms";
import { useDynamicList, useListSelection } from "@hooks/data";

const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm";
const dropdownStyle = "w-full p-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm [&_.p-dropdown-label]:py-2.5 [&_.p-dropdown-label]:px-3";

const SucursalModal = ({ visible, mode, sucursalData, onHide }) => {
    const activeCompany = getActiveCompany();
    const defaultSucursal = activeCompany?.sucursal || '';

    const { formData, handleChange, setFormData } = useFormInput({
        nombre: '',
        direccion: '',
    });

    const { items: almacenes, setItems: setAlmacenes, addItem: addAlmacen, removeItem: removeAlmacen, updateItem: updateAlmacen } = useDynamicList([]);

    const {
        selectedItems: vendedores,
        selectedItem: selectedVendedor,
        addItem: addVendedor,
        removeItem: removeVendedor,
        setSelectedItem: setSelectedVendedor,
        setSelectedItems: setVendedores
    } = useListSelection([], {
        onEmptySelection: () => toast.warn("Selecciona un usuario primero."),
        onDuplicate: () => toast.info("El vendedor ya está asignado.")
    });

    const almacenesDisponibles = useMemo(() =>
        getSucursales().map(s => ({
            label: s.almacenes[0] || s.nombre,
            value: s.almacenes[0] || s.nombre,
        })), []
    );

    const vendedoresOptions = useMemo(() =>
        getUsuarios().map(u => ({
            label: `${u.nombres} ${u.apellidoPaterno} (${u.rol})`,
            value: u.correo
        })), []
    );

    useEffect(() => {
        if (visible) {
            if (mode === 'edit' && sucursalData) {
                setFormData({
                    nombre: sucursalData.nombre || '',
                    direccion: sucursalData.direccion || '',
                });
                setVendedores(sucursalData.vendedores || []);
                setAlmacenes(sucursalData.almacenes.map((nombre, i) => ({ tempId: i, nombre })));
            } else {
                setFormData({
                    nombre: defaultSucursal,
                    direccion: '',
                });
                setVendedores([]);
                setAlmacenes([{ tempId: 1, nombre: defaultSucursal }]);
            }
        }
    }, [visible, mode, sucursalData, defaultSucursal, setFormData, setVendedores, setAlmacenes]);

    const handleSubmit = () => {
        if (!formData.nombre || !formData.direccion) {
            return toast.error("El nombre y la dirección son obligatorios.");
        }

        const action = mode === 'add' ? 'AGREGAR' : 'EDITAR';
        const dataToSave = {
            ...formData,
            vendedores,
            almacenes: almacenes.map(a => a.nombre).filter(Boolean)
        };
        console.log(`${action} Sucursal:`, dataToSave);

        toast.success(`Sucursal ${action === 'AGREGAR' ? 'agregada' : 'actualizada'} con éxito.`);
        onHide();
    };

    const getVendedorLabel = (email) => {
        const vendedor = vendedoresOptions.find(o => o.value === email);
        return vendedor?.label || email;
    };

    return (
        <Dialog
            header={
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
            }
            visible={visible}
            onHide={onHide}
            modal
            closable={false}
            draggable={false}
            className="w-[min(650px,95vw)]"
            headerClassName="p-0"
            contentClassName="p-0 bg-white"
            footer={
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
            }
        >
            <div className="space-y-6 p-6">
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
                    <InputText
                        placeholder="Nombre de la sucursal"
                        value={formData.nombre}
                        onChange={handleChange('nombre')}
                        className={inputStyle}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Dirección</label>
                    <InputText
                        placeholder="Dirección completa"
                        value={formData.direccion}
                        onChange={handleChange('direccion')}
                        className={inputStyle}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">VENDEDORES ASIGNADOS</label>

                    <div className="flex items-center gap-2">
                        <Dropdown
                            options={vendedoresOptions}
                            value={selectedVendedor}
                            onChange={(e) => setSelectedVendedor(e.value)}
                            placeholder="Usuario"
                            className={`${dropdownStyle} flex-1`}
                            panelClassName="rounded-lg max-h-48 overflow-y-auto"
                            optionLabel="label"
                        />
                        <button
                            type="button"
                            onClick={addVendedor}
                            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                            aria-label="Agregar vendedor"
                        >
                            <AddIcon className="!text-lg" />
                        </button>
                    </div>

                    {vendedores.map((email) => (
                        <div key={email} className="flex items-center justify-between bg-gray-50 px-3 py-2 mt-2 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-700">{getVendedorLabel(email)}</span>
                            <button
                                type="button"
                                onClick={() => removeVendedor(email)}
                                className="text-red-500 hover:text-red-700 p-1 rounded"
                                aria-label="Eliminar vendedor"
                            >
                                <RemoveCircleIcon className="!text-lg" />
                            </button>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ALMACENES VINCULADOS</label>

                    {almacenes.map((almacen, index) => (
                        <div key={almacen.tempId} className="flex items-center gap-2 mb-3">
                            <Dropdown
                                options={almacenesDisponibles}
                                placeholder="Almacen"
                                value={almacen.nombre}
                                onChange={(e) => updateAlmacen(almacen.tempId, 'nombre', e.value)}
                                className={`${dropdownStyle} flex-1`}
                                panelClassName="rounded-lg max-h-48 overflow-y-auto"
                                optionLabel="label"
                            />
                            <button
                                type="button"
                                onClick={() => removeAlmacen(almacen.tempId)}
                                disabled={almacenes.length === 1}
                                className="p-2 rounded-full bg-red-500 disabled:bg-gray-300 hover:bg-red-600 text-white transition-colors"
                                aria-label="Remover almacén"
                            >
                                <RemoveCircleIcon className="!text-lg" />
                            </button>
                            {(index === almacenes.length - 1) && (
                                <button
                                    type="button"
                                    onClick={() => addAlmacen({ nombre: defaultSucursal })}
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