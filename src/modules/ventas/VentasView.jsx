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
                <h2 className="font-bold text-gray-800 text-xl ml-5">Nueva venta</h2>
                <label className="flex items-center gap-2 text-gray-700 text-sm">
                    <input type="checkbox" className="w-4 h-4" />
                    PROFORMA
                </label>
            </div>

            {/* PRIMERA FILA */}
            <div className="gap-4 grid grid-cols-4 mb-4">
                {/* Cliente */}
                <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Cliente</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Fecha emisión */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Fecha de emisión</label>
                    <Calendar
                        value={fechaEmision}
                        onChange={(e) => setFechaEmision(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-full"
                        inputClassName="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Fecha vcto */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Fecha de vencimiento</label>
                    <Calendar
                        value={fechaVencimiento}
                        onChange={(e) => setFechaVencimiento(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-full"
                        inputClassName="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            {/* SEGUNDA FILA */}
            <div className="gap-4 grid grid-cols-4 mb-4">
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipo de comprobante</label>
                    <select className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm">
                        <option>BOLETA DE VENTA ELECTRÓNICA</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Serie</label>
                    <select className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm">
                        <option>BB04</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Tipo de operación</label>
                    <select className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm">
                        <option>VENTA INTERNA</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Dscto. global (%)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-2 py-2 border border-gray-300 rounded-md text-sm"
                    />
                </div>
            </div>

            {/* BOTONES DE OPCIONES */}
            <div className="grid grid-cols-4 gap-2 mb-6">
                {["PLACA", "O. COMPRA", "G. REMISIÓN", "OBSERVACIONES"].map((label) => (
                    <button
                        key={label}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded text-white text-sm font-medium"
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* ZONA DE PRODUCTOS */}
            <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md text-gray-500 text-sm text-center overflow-auto">
                Escanea un producto con un lector de código de barras o búscalo
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-white border-t border-gray-300 pt-4">
                {/* Buscar producto (más alto) */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="w-full px-3 py-3 border border-gray-300 rounded-md text-sm"
                    />
                </div>

                {/* TOTAL + BOTONES */}
                <div className="flex justify-between items-center gap-4">
                    <div className="relative flex-[2] group text-center cursor-pointer">
                        <p className="font-bold text-gray-700 text-lg">
                            TOTAL <span className="text-black">0.00</span>
                        </p>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white shadow-lg border rounded-lg p-4 w-52 text-sm text-gray-700">
                            {[
                                "Anticipios","DSCTO","Gravado","Exonerado","Inafecto",
                                "Exportación","Gratuito","I.S.C","I.G.V","R.C","I.C.B.P.E.R",
                            ].map((item) => (
                                <div key={item} className="flex justify-between">
                                    <span>{item}</span>
                                    <span>0.00</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="flex-[1] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700">
                        VISTA PREVIA
                    </button>
                    <button className="flex-[1] bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white">
                        PROCESAR
                    </button>
                </div>
            </div>
        </div>
    );
}