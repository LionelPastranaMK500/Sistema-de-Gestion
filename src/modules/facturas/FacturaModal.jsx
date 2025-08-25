import { useState, useRef } from "react";
import { generarPDF } from "@utils/pdfConfig";
import { CloseIcon } from "@constants/iconsConstants";
import { getActiveUser } from "@services/auth/authServices";

export default function FacturaModal({ f, onClose }) {
    const [mostrarFormatos, setMostrarFormatos] = useState(false);
    const btnRef = useRef(null);

    if (!f) return null;
    const usuario = getActiveUser();

    const formatos = [
        { id: "ticket80mm", label: "80mm" },
        { id: "A4", label: "A4" }
    ];

    const handleSeleccionFormato = (formato) => {
        generarPDF(f, formato);
        setMostrarFormatos(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay oscuro */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Contenido del modal */}
            <div className="relative z-50 w-full max-w-lg max-h-[80vh] rounded-lg shadow-xl bg-white flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between bg-blue-600 px-4 py-3 rounded-t-lg">
                    <h3 className="text-white font-bold text-lg">
                        Comprobante electrónico
                    </h3>
                    <CloseIcon
                        className="text-white cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                {/* Body con scroll */}
                <div className="p-4 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {/* Documento */}
                    <div className="bg-white rounded-md shadow px-4 py-3 text-center">
                        <p className="font-bold text-gray-800 uppercase">{f.tDocumento}</p>
                        <p className="text-gray-600">{f.numero}</p>
                        <p className="text-blue-600 font-extrabold text-xl mt-2">
                            S/ {f.monto.toFixed(2)}
                        </p>
                    </div>

                    {/* Cliente */}
                    <div className="bg-white rounded-md shadow px-4 py-3">
                        <strong className="block text-gray-800">CLIENTE</strong>
                        <p className="text-gray-700">{f.cliente}</p>
                        <p className="text-gray-500">RUC {f.ruc}</p>
                    </div>

                    {/* Usuario */}
                    <div className="bg-white rounded-md shadow px-4 py-3">
                        <strong className="block text-gray-800">USUARIO</strong>
                        <p className="text-gray-700">
                            {usuario
                                ? `${usuario.nombres} ${usuario.apellidoPaterno}`
                                : "Usuario no disponible"}
                        </p>
                        <p className="text-gray-500">
                            {new Date(f.fecha).toLocaleString("es-ES")}
                        </p>
                    </div>

                    {/* Estado SUNAT */}
                    <div className="bg-white rounded-md shadow px-4 py-3">
                        <strong className="block text-gray-800">ESTADO SUNAT</strong>
                        <p className="text-green-600 font-medium">ACEPTADO</p>
                    </div>

                    {/* Botonera */}
                    <div className="grid grid-cols-2 gap-3 mt-4 relative">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            ENVIAR POR EMAIL
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            ENVIAR POR WHATSAPP
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            IMPRIMIR
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            VISUALIZAR PDF
                        </button>

                        {/* Generar PDF con dropdown */}
                        <div className="relative">
                            <button
                                ref={btnRef}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded w-full"
                                onClick={() => setMostrarFormatos(!mostrarFormatos)}
                            >
                                GENERAR PDF
                            </button>

                            {mostrarFormatos && (
                                <ul className="absolute z-50 mt-1 left-0 right-0 bg-white shadow-lg rounded border border-gray-200">
                                    {formatos.map((formato) => (
                                        <li key={formato.id}>
                                            <button
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                onClick={() => handleSeleccionFormato(formato.id)}
                                            >
                                                {formato.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            GUÍA DE REMISIÓN
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            NOTA DE CRÉDITO
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            NOTA DE DÉBITO
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            DESCARGAR XML
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
                            DESCARGAR CDR
                        </button>
                    </div>

                    {/* Botón de baja (rojo) */}
                    <button className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded">
                        DAR DE BAJA (ANULAR)
                    </button>
                </div>
            </div>
        </div>
    );
}
