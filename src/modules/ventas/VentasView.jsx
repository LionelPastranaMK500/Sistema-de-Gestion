import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { configCalendar } from "../../utils/configCalendar";

export default function VentasModal() {
    const [fechaEmision, setFechaEmision] = useState(null);
    const [fechaVencimiento, setFechaVencimiento] = useState(null);

    useEffect(() => {
        // Configuración locale/es
        configCalendar();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto">
            {/* ENCABEZADO */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Nueva venta</h2>
                <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" className="h-4 w-4" />
                    PROFORMA
                </label>
            </div>

            {/* PRIMERA FILA: Cliente + Fechas */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Cliente"
                    className="col-span-2 border border-gray-300 rounded-md px-3 py-2 text-sm"
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
            <div className="grid grid-cols-4 gap-4 mb-4">
                <select className="border border-gray-300 rounded-md px-2 py-2 text-sm">
                    <option>BOLETA DE VENTA ELECTRÓNICA</option>
                </select>
                <select className="border border-gray-300 rounded-md px-2 py-2 text-sm">
                    <option>BB04</option>
                </select>
                <select className="border border-gray-300 rounded-md px-2 py-2 text-sm">
                    <option>VENTA INTERNA</option>
                </select>
                <input
                    type="number"
                    placeholder="0.00"
                    className="border border-gray-300 rounded-md px-2 py-2 text-sm"
                />
            </div>

            {/* BOTONES DE OPCIONES */}
            <div className="flex flex-wrap gap-2 mb-6">
                {["PLACA", "O. COMPRA", "G. REMISIÓN", "OBSERVACIONES", "COND. PAGO", "OTROS"].map((label) => (
                    <button
                        key={label}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ZONA DE PRODUCTOS */}
            <div className="bg-gray-50 border border-gray-300 rounded-md p-6 mb-6 text-center text-gray-500 text-sm">
                Escanea un producto con un lector de código de barras o búscalo
            </div>

            {/* BUSCAR PRODUCTO + TOTAL */}
            <div className="flex items-center justify-between gap-4">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                />

                <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-gray-700">
                        TOTAL <span className="text-black">0.00</span>
                    </p>
                    <button className="bg-gray-200 px-4 py-2 rounded font-semibold text-gray-700 hover:bg-gray-300">
                        VISTA PREVIA
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700">
                        PROCESAR
                    </button>
                </div>
            </div>
        </div>
    );
}
