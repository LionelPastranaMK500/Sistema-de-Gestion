import { useState, useRef } from "react";
import { generarPDF } from "@utils/pdfConfig";
import { CloseIcon } from "@constants/iconsConstants";
import { getActiveUser } from "@services/auth/authServices";

const FacturaModal = ({ f, onClose }) => {
    const [mostrarFormatos, setMostrarFormatos] = useState(false);
    const btnRef = useRef(null);

    if (!f) return null;
    const usuario = getActiveUser();

    const formatos = [
        { id: "t80mm", label: "80mm" },
        { id: "A4", label: "A4" }
    ];

    const handleSeleccionFormato = (formato) => {
        generarPDF(f, formato);
        setMostrarFormatos(false);
    };

    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center">
            {/* Overlay oscuro */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Contenido del modal */}
            <div className="z-50 relative flex flex-col bg-white shadow-xl rounded-lg w-full max-w-lg max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center bg-blue-600 px-4 py-3 rounded-t-lg">
                    <h3 className="font-bold text-white text-lg">
                        Comprobante electrónico
                    </h3>
                    <CloseIcon
                        className="text-white cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                {/* Body con scroll */}
                <div className="space-y-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                    {/* Documento */}
                    <div className="bg-white shadow px-4 py-3 rounded-md text-center">
                        <p className="font-bold text-gray-800 uppercase">{f.tDocumento}</p>
                        <p className="text-gray-600">{f.serie}-{f.numero}</p>
                        <p className="mt-2 font-extrabold text-blue-600 text-xl">
                            S/ {f.monto.toFixed(2)}
                        </p>
                    </div>

                    {/* Cliente */}
                    <div className="bg-white shadow px-4 py-3 rounded-md">
                        <strong className="block text-gray-800">CLIENTE</strong>
                        <p className="text-gray-700">{f.cliente}</p>
                        <p className="text-gray-500">RUC {f.ruc}</p>
                    </div>

                    {/* Usuario */}
                    <div className="bg-white shadow px-4 py-3 rounded-md">
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
                    <div className="bg-white shadow px-4 py-3 rounded-md">
                        <strong className="block text-gray-800">ESTADO SUNAT</strong>
                        <p className="font-medium text-green-600">{f.state}</p>
                    </div>

                    {/* Botonera */}
                    <div className="relative gap-3 grid grid-cols-2 mt-4">
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            ENVIAR POR EMAIL
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            ENVIAR POR WHATSAPP
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            IMPRIMIR
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            VISUALIZAR PDF
                        </button>

                        {/* Generar PDF con dropdown */}
                        <div className="relative">
                            <button
                                ref={btnRef}
                                className="bg-blue-600 hover:bg-blue-700 py-2 rounded w-full font-semibold text-white"
                                onClick={() => setMostrarFormatos(!mostrarFormatos)}
                            >
                                GENERAR PDF
                            </button>

                            {mostrarFormatos && (
                                <ul className="right-0 left-0 z-50 absolute bg-white shadow-lg mt-1 border border-gray-200 rounded">
                                    {formatos.map((formato) => (
                                        <li key={formato.id}>
                                            <button
                                                className="hover:bg-gray-100 px-4 py-2 w-full text-left"
                                                onClick={() => handleSeleccionFormato(formato.id)}
                                            >
                                                {formato.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            GUÍA DE REMISIÓN
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            NOTA DE CRÉDITO
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            NOTA DE DÉBITO
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            DESCARGAR XML
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold text-white">
                            DESCARGAR CDR
                        </button>
                    </div>

                    {/* Botón de baja (rojo) */}
                    <button className="bg-red-600 hover:bg-red-700 mt-3 py-2 rounded w-full font-semibold text-white">
                        DAR DE BAJA (ANULAR)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FacturaModal;