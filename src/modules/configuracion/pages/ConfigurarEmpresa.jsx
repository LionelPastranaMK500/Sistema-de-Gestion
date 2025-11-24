import { useEffect } from "react";
import { getActiveCompany } from "@services/auth/authServices";
import { useNavigate } from "react-router-dom";
import { useFormInput } from "@hooks/forms";

const ToggleSwitch = ({ label, name, checked, onChange }) => (
    <label htmlFor={name} className="flex items-center justify-between cursor-pointer">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <div className="relative">
            <input
                type="checkbox"
                id={name}
                name={name}
                className="sr-only"
                checked={checked}
                onChange={onChange}
            />
            <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-full' : ''}`}></div>
        </div>
    </label>
);


export default function ConfigurarEmpresa() {
    const navigate = useNavigate();
    const { formData: companyData, handleChange, setFormData: setCompanyData } = useFormInput({
        ruc: '',
        razonSocial: '',
        nombreComercial: '',
        direccionFiscal: '',
        afectacionIGV: 'gravado',
        moneda: 'PEN',
        ventasSinStock: true,
        clienteAnonimo: 'PÚBLICO EN GENERAL',
        cuentadetraccion: '',
        registroMTC: ''
    });


    useEffect(() => {
        const activeCompany = getActiveCompany();
        if (activeCompany) {
            setCompanyData(prev => ({
                ...prev,
                ruc: activeCompany.ruc || '',
                razonSocial: activeCompany.razonSocial || '',
                nombreComercial: activeCompany.nombreComercial || activeCompany.razonSocial || '',
                direccionFiscal: activeCompany.direccion || ''
            }));
        }
    }, [setCompanyData]);


    const handleSave = () => {
        console.log("Guardando datos:", companyData);
        alert("Datos guardados (simulación).");
    };

    return (
        <div className="flex flex-col w-full h-full p-6 bg-gray-50 overflow-y-auto">

            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <button
                    onClick={() => navigate('/configuracion')}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Volver a configuración"
                >
                    <i className="pi pi-arrow-left"></i>
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Empresa</h2>
            </div>

            <div className="w-full max-w-4xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Información básica</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="ruc" className="block text-sm font-medium text-gray-600 mb-1">RUC</label>
                            <input
                                type="text"
                                id="ruc"
                                name="ruc"
                                value={companyData.ruc}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="razonSocial" className="block text-sm font-medium text-gray-600 mb-1">Razón social</label>
                            <input
                                type="text"
                                id="razonSocial"
                                name="razonSocial"
                                value={companyData.razonSocial}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="nombreComercial" className="block text-sm font-medium text-gray-600 mb-1">Nombre comercial</label>
                            <input
                                type="text"
                                id="nombreComercial"
                                name="nombreComercial"
                                value={companyData.nombreComercial}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="direccionFiscal" className="block text-sm font-medium text-gray-600 mb-1">Dirección fiscal</label>
                            <input
                                type="text"
                                id="direccionFiscal"
                                name="direccionFiscal"
                                value={companyData.direccionFiscal}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Configuración</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-1">
                            <label htmlFor="afectacionIGV" className="block text-sm font-medium text-gray-600 mb-1">Afectación al IGV por defecto</label>
                            <select
                                id="afectacionIGV"
                                name="afectacionIGV"
                                value={companyData.afectacionIGV}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="gravado">Gravado - Operación onerosa</option>
                                <option value="exonerado">Exonerado - Operación onerosa</option>
                                <option value="inafecto">Inafecto - Operación onerosa</option>
                            </select>
                        </div>

                        <div className="md:col-span-1">
                            <label htmlFor="moneda" className="block text-sm font-medium text-gray-600 mb-1">Moneda</label>
                            <select
                                id="moneda"
                                name="moneda"
                                value={companyData.moneda}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="PEN">SOLES (S/)</option>
                                <option value="USD">DÓLARES ($)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <ToggleSwitch
                                label="Ventas sin stock"
                                name="ventasSinStock"
                                checked={companyData.ventasSinStock}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-500 mt-4 mb-2">VENTAS</h4>
                            <label htmlFor="clienteAnonimo" className="block text-sm font-medium text-gray-600 mb-1">Nombre cliente anónimo</label>
                            <input
                                type="text"
                                id="clienteAnonimo"
                                name="clienteAnonimo"
                                value={companyData.clienteAnonimo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-500 mt-4 mb-2">DETRACCIONES</h4>
                            <label htmlFor="cuentaDetraccion" className="block text-sm font-medium text-gray-600 mb-1">Número de cuenta Banco de la Nación</label>
                            <input
                                type="text"
                                id="cuentaDetraccion"
                                name="cuentaDetraccion"
                                value={companyData.cuentaDetraccion}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-gray-500 mt-4 mb-2">GRE - TRANSPORTISTA</h4>
                            <label htmlFor="registroMTC" className="block text-sm font-medium text-gray-600 mb-1">Número de registro MTC</label>
                            <input
                                type="text"
                                id="registroMTC"
                                name="registroMTC"
                                value={companyData.registroMTC}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        GUARDAR
                    </button>
                </div>
            </div>
        </div>
    );
}