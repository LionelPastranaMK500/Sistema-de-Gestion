import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { configCalendar } from "@utils/configCalendar";

export default function VentasModal() {
    const [fechaEmision, setFechaEmision] = useState(null);
    const [fechaVencimiento, setFechaVencimiento] = useState(null);

    useEffect(() => {
        // Configuración locale/es
        configCalendar();
    }, []);

    return (
        <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
            {/* ENCABEZADO */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-gray-800 text-xl">Nueva venta</h2>
                <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
                    PROFORMA
                </label>
            </div>

            {/* PRIMERA FILA: Cliente + Fechas */}
            <div className="gap-4 grid grid-cols-4 mb-4">
                <input
                    type="text"
                    placeholder="Cliente"
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-md text-sm"
                />

                {/* Calendar - Fecha de emisión */}
                <Calendar
                    value={fechaEmision}
                    onChange={(e) => setFechaEmision(e.value)}
                    placeholder="Fecha de emisión"
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="w-full"
                    inputClassName="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />

                {/* Calendar - Fecha de vcto */}
                <Calendar
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.value)}
                    placeholder="Fecha de vcto"
                    dateFormat="dd/mm/yy"
                    showIcon
                    className="w-full"
                    inputClassName="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* SEGUNDA FILA: Comprobante, Serie, Operación, Dscto */}
            <div className="gap-4 grid grid-cols-4 mb-4">
                <select className="px-2 py-2 border border-gray-300 rounded-md text-sm">
                    <option>BOLETA DE VENTA ELECTRÓNICA</option>
                </select>
                <select className="px-2 py-2 border border-gray-300 rounded-md text-sm">
                    <option>BB04</option>
                </select>
                <select className="px-2 py-2 border border-gray-300 rounded-md text-sm">
                    <option>VENTA INTERNA</option>
                </select>
                <input
                    type="number"
                    placeholder="0.00"
                    className="px-2 py-2 border border-gray-300 rounded-md text-sm"
                />
            </div>

            {/* BOTONES DE OPCIONES */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    "PLACA",
                    "O. COMPRA",
                    "G. REMISIÓN",
                    "OBSERVACIONES",
                    "COND. PAGO",
                    "OTROS",
                ].map((label) => (
                    <button
                        key={label}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ZONA DE PRODUCTOS (se expande para ocupar espacio disponible) */}
            <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md text-gray-500 text-sm text-center overflow-auto">
                Escanea un producto con un lector de código de barras o búscalo
            </div>

            {/* FOOTER FIJO DENTRO DEL MODAL */}
            <div className="sticky bottom-0 bg-white border-t border-gray-300 pt-4">
                <div className="flex justify-between items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />

                    <div className="flex items-center gap-4">
                        <p className="font-bold text-gray-700 text-lg">
                            TOTAL <span className="text-black">0.00</span>
                        </p>
                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700">
                            VISTA PREVIA
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white">
                            PROCESAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
