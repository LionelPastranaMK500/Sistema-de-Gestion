import React, { useEffect, useRef, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Calendar } from "primereact/calendar";
import { configCalendar } from "@utils/configCalendar";
import { generarDataFalsa, keyMap} from "@services/generadorData";
import { contarComprobantes } from "@utils/comprobantesUtils";
import {
    buildEmisionesData, emisionesChartOptions,
    buildVentasData, ventasChartOptions,
    buildComprasData, comprasChartOptions
} from "@utils/chartUtils";
import { toast } from "react-toastify";

export default function EstadisticasView() {
    const [data, setData] = useState([]);
    const [fechaEmisiones, setFechaEmisiones] = useState(null);
    const [fechaVentas, setFechaVentas] = useState(null);
    const [fechaCompras, setFechaCompras] = useState(null);
    const [ventas, setVentas] = useState(0);
    const [compras, setCompras] = useState(0);
    const [dataVentasFiltrada, setDataVentasFiltrada] = useState([]);
    const [dataCompras, setDataCompras] = useState(null);
    const [emisiones, setEmisiones] = useState({
        total: 0, facturas: 0, boletas: 0, notasCredito: 0,
        notasDebito: 0, proformas: 0, guiasRemision: 0,
    });

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
        const datosGenerados = generarDataFalsa(2);
        setData(datosGenerados);
        configCalendar();
    }, []);

    useEffect(() => {
        if (!data.length) return;
        const filtrada = filtrarPorFecha(fechaEmisiones, data);
        setEmisiones(contarComprobantes(filtrada));
        if (fechaEmisiones) toast.success("Emisiones actualizadas", { autoClose: 1000 });
    }, [fechaEmisiones, data]);

    useEffect(() => {
        if (!data.length) return;
        const filtrada = filtrarPorFecha(fechaVentas, data).filter(d => d.tipoOperacion === "venta");
        const total = filtrada.reduce((acc, cur) => acc + cur.monto, 0);
        setVentas(total);
        setDataVentasFiltrada(filtrada);
        if (fechaVentas) toast.success("Ventas actualizadas", { autoClose: 1000 });
    }, [fechaVentas, data]);

    useEffect(() => {
        if (!data.length) return;
        const filtrada = filtrarPorFecha(fechaCompras, data).filter(d => d.tipoOperacion === "compra");
        const total = filtrada.reduce((acc, cur) => acc + cur.monto, 0);
        setCompras(total);
        setDataCompras(buildComprasData(filtrada, fechaCompras));
        if (fechaCompras) toast.success("Compras actualizadas", { autoClose: 1000 });
    }, [fechaCompras, data]);

    const emisionesData = buildEmisionesData(emisiones);
    const ventasData = buildVentasData(dataVentasFiltrada);

    const refCalEmi = useRef(null);
    const refCalVen = useRef(null);
    const refCalCom = useRef(null);

    return (
        <div className="flex flex-col w-full h-screen">
            {/* HEADER (mismo patrón que FacturasView) */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="ml-14 md:ml-20 font-bold text-gray-800 text-2xl">
                    Estadísticas
                </h2>
            </div>

            {/* CONTENIDO scrollable (idéntico comportamiento que FacturasView) */}
            <div className="flex-1 px-6 py-6 w-full min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">

                {/* === EMISIONES === */}
                <div className="bg-white shadow-sm mb-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-center px-5 py-4 border-b">
                        <h3 className="font-semibold text-gray-800 text-lg">Emisiones</h3>
                        <div className="relative">
                            <Calendar
                                ref={refCalEmi}
                                value={fechaEmisiones}
                                onChange={(e) => setFechaEmisiones(e.value)}
                                dateFormat="mm/yy"
                                view="month"
                                showIcon={false}
                                appendTo={document.body}
                                panelClassName="z-50"
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
                                        <li
                                            key={label}
                                            className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="inline-block rounded-full w-3 h-3"
                                                    style={{ backgroundColor: emisionesData.datasets[0].backgroundColor[i] }}
                                                />
                                                <span className="text-gray-700">{label}</span>
                                            </div>
                                            <span className="text-gray-900">{emisiones[key]}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="col-span-12 lg:col-span-6">
                            <div className="mx-auto max-w-[420px] h-[320px]">
                                <Doughnut
                                    data={emisionesData}
                                    options={{ ...emisionesChartOptions, maintainAspectRatio: false, responsive: true }}
                                />
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
                                    dateFormat="mm/yy"
                                    view="month"
                                    showIcon={false}
                                    appendTo={document.body}
                                    panelClassName="z-50"
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
                            <span className="bg-indigo-600 shadow px-3 py-1 rounded-md font-bold text-white text-sm">
                                S/ {ventas.toFixed(2)}
                            </span>
                            <span className="bg-blue-500 shadow px-3 py-1 rounded-md font-bold text-white text-sm">
                                S/ {(0).toFixed(2)}
                            </span>
                        </div>

                        <div className="w-full h-[360px]">
                            <Line
                                data={ventasData}
                                options={{ ...ventasChartOptions, maintainAspectRatio: false, responsive: true }}
                            />
                        </div>
                    </div>
                </div>

                {/* === COMPRAS === */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-center px-5 py-4 border-b">
                        <h3 className="font-semibold text-gray-800 text-lg">Compras</h3>
                        <div className="flex items-center gap-2">
                            <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm">
                                <option>PEN</option>
                            </select>
                            <div className="relative">
                                <Calendar
                                    ref={refCalCom}
                                    value={fechaCompras}
                                    onChange={(e) => setFechaCompras(e.value)}
                                    dateFormat="mm/yy"
                                    view="month"
                                    showIcon={false}
                                    appendTo={document.body}
                                    panelClassName="z-50"
                                    className="absolute inset-0 opacity-0 pointer-events-none"
                                />
                                <button
                                    onClick={() => refCalCom.current?.show?.()}
                                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm"
                                >
                                    {fmtMesAnio(fechaCompras)}
                                    <i className="text-gray-500 pi pi-chevron-down" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative px-5 py-6">
                        <div className="top-6 right-6 absolute pointer-events-none">
                            <span className="bg-emerald-600 shadow px-3 py-1 rounded-md font-bold text-white text-sm">
                                S/ {compras.toFixed(2)}
                            </span>
                        </div>

                        <div className="w-full h-[360px]">
                            {dataCompras && (
                                <Line
                                    data={dataCompras}
                                    options={{ ...comprasChartOptions, maintainAspectRatio: false, responsive: true }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
