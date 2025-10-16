import React, { useEffect, useRef, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Calendar } from "primereact/calendar";
import { configCalendar } from "@utils/configCalendar";
import { generarDataFalsa, keyMap } from "@services/generadorData";
import { contarComprobantes } from "@utils/comprobantesUtils";
import {
    buildEmisionesData,
    emisionesChartOptions,
    buildVentasData,
    ventasChartOptions,
} from "@utils/chartUtils";
import { toast } from "react-toastify";

const EstadisticasView = () => {
    const [data, setData] = useState([]);
    const [fechaEmisiones, setFechaEmisiones] = useState(new Date());
    const [fechaVentas, setFechaVentas] = useState(new Date());
    
    // Estados separados para los totales
    const [totalVentas, setTotalVentas] = useState(0);
    const [totalProformas, setTotalProformas] = useState(0);

    const [emisiones, setEmisiones] = useState({
        total: 0, facturas: 0, boletas: 0, notasCredito: 0,
        notasDebito: 0, proformas: 0, guiasRemision: 0,
    });

    const [dataVentasFiltrada, setDataVentasFiltrada] = useState([]);
    const refCalEmi = useRef(null);
    const refCalVen = useRef(null);

    const filtrarPorFecha = (fechaFiltro, data) => {
        if (!fechaFiltro) return data;
        const mes = fechaFiltro.getMonth();
        const anio = fechaFiltro.getFullYear();
        return data.filter((d) => {
            const f = new Date(d.fecha);
            return f.getMonth() === mes && f.getFullYear() === anio;
        });
    };

    const fmtMesAnio = (d) => {
        if (!d) return "SELECCIONAR MES";
        const mes = d.toLocaleDateString("es-ES", { month: "long" }).toUpperCase();
        return `${mes} - ${d.getFullYear()}`;
    };

    useEffect(() => {
        // Llamada a la función, que ahora genera 1000 documentos distribuidos en los últimos 6 meses.
        const datosGenerados = generarDataFalsa(1000); 
        setData(datosGenerados);
        configCalendar();
    }, []); 

    useEffect(() => {
        if (!data.length) return;
        const filtrada = filtrarPorFecha(fechaEmisiones, data);
        setEmisiones(contarComprobantes(filtrada));
        if (fechaEmisiones) toast.success("Emisiones actualizadas", { autoClose: 1000 });
    }, [fechaEmisiones, data]);

    // ✅ CORRECCIÓN: Calcular ambos totales aquí
    useEffect(() => {
        if (!data.length) return;
        const datosDelMes = filtrarPorFecha(fechaVentas, data);

        const ventasDelMes = datosDelMes.filter(d => ["FACTURA ELECTRÓNICA", "BOLETA DE VENTA ELECTRÓNICA"].includes(d.tDocumento));
        const proformasDelMes = datosDelMes.filter(d => d.tDocumento === "PROFORMA ELECTRÓNICA");

        const totalVentasCalculado = ventasDelMes.reduce((acc, cur) => acc + (cur.monto?.total || 0), 0);
        const totalProformasCalculado = proformasDelMes.reduce((acc, cur) => acc + (cur.monto?.total || 0), 0);
        
        setTotalVentas(totalVentasCalculado);
        setTotalProformas(totalProformasCalculado);
        setDataVentasFiltrada(datosDelMes); // Pasamos todos los datos del mes al gráfico

        if (fechaVentas) toast.success("Ventas actualizadas", { autoClose: 1000 });
    }, [fechaVentas, data]);
    
    const emisionesData = buildEmisionesData(emisiones);
    const ventasData = buildVentasData(dataVentasFiltrada, fechaVentas);

    return (
        <div className="flex flex-col w-full h-full p-6">
            {/* 1. HEADER (Fijo) */}
            <div className="flex-shrink-0 flex justify-between items-center pb-4 border-b">
                <h2 className="font-bold text-gray-800 text-3xl ml-16">
                    Estadísticas
                </h2>
            </div>

            {/* 2. CONTENIDO (Con scroll interno) */}
            <div className="flex-1 pt-6 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                {/* === EMISIONES === */}
                <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-center px-5 py-4 border-b">
                        <h3 className="font-semibold text-gray-800 text-lg">Emisiones</h3>
                        <div className="relative">
                            <Calendar
                                ref={refCalEmi}
                                value={fechaEmisiones}
                                onChange={(e) => setFechaEmisiones(e.value)}
                                dateFormat="mm/yy" view="month" showIcon={false}
                                appendTo={document.body} panelClassName="z-50"
                                className="absolute inset-0 opacity-0 pointer-events-none"
                            />
                            <button
                                onClick={() => refCalEmi.current?.show?.()}
                                className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm"
                            >
                                {fmtMesAnio(fechaEmisiones)}
                                <i className="text-gray-500 pi pi-chevron-down" />
                            </button>
                        </div>
                    </div>
                    <div className="gap-6 grid grid-cols-12 px-5 py-6">
                        <div className="col-span-12 lg:col-span-6">
                            <div className="mb-6 text-center">
                                <p className="font-semibold text-gray-800 text-4xl">{emisiones.total}</p>
                                <p className="text-gray-500 text-sm">Comprobantes emitidos</p>
                            </div>
                            <ul className="space-y-2">
                                {emisionesData.labels.map((label, i) => {
                                    const key = keyMap[label];
                                    return (
                                        <li key={label} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="inline-block rounded-full w-3 h-3" style={{ backgroundColor: emisionesData.datasets[0].backgroundColor[i] }} />
                                                <span className="text-gray-700">{label}</span>
                                            </div>
                                            <span className="text-gray-900">{emisiones[key] || 0}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
                            <div className="mx-auto max-w-[420px] h-[320px] w-full">
                                <Doughnut data={emisionesData} options={{ ...emisionesChartOptions, maintainAspectRatio: false, responsive: true }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* === VENTAS === */}
                <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-center px-5 py-4 border-b">
                        <h3 className="font-semibold text-gray-800 text-lg">Ventas</h3>
                        <div className="flex items-center gap-2">
                            <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm">
                                <option>PEN</option>
                            </select>
                            <div className="relative">
                                <Calendar
                                    ref={refCalVen}
                                    value={fechaVentas}
                                    onChange={(e) => setFechaVentas(e.value)}
                                    dateFormat="mm/yy" view="month" showIcon={false}
                                    appendTo={document.body} panelClassName="z-50"
                                    className="absolute inset-0 opacity-0 pointer-events-none"
                                />
                                <button
                                    onClick={() => refCalVen.current?.show?.()}
                                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm"
                                >
                                    {fmtMesAnio(fechaVentas)}
                                    <i className="text-gray-500 pi pi-chevron-down" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="relative px-5 py-6">
                        <div className="top-6 right-6 absolute flex flex-col items-end gap-2 pointer-events-none">
                            {/* ✅ CORRECCIÓN: Usar los estados correctos */}
                            <span className="bg-cyan-500 shadow px-3 py-1 rounded-md font-bold text-white text-sm">
                                S/ {totalVentas.toFixed(2)}
                            </span>
                            <span className="bg-pink-500 shadow px-3 py-1 rounded-md font-bold text-white text-sm">
                                S/ {totalProformas.toFixed(2)}
                            </span>
                        </div>
                        <div className="w-full h-[360px]">
                            <Line data={ventasData} options={{ ...ventasChartOptions, maintainAspectRatio: false, responsive: true }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EstadisticasView;