import React, { useEffect, useRef, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Calendar } from "primereact/calendar";
import { configCalendar } from "@utils/configCalendar";
import { generarDataFalsa } from "@services/generadorData";
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
        const datosGenerados = generarDataFalsa(50);
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
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="ml-14 md:ml-20 text-2xl font-bold text-gray-800">
                    Estadísticas
                </h2>
            </div>

            {/* CONTENIDO scrollable (idéntico comportamiento que FacturasView) */}
            <div className="flex-1 min-h-0 w-full px-6 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">

                {/* === EMISIONES === */}
                <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <h3 className="text-lg font-semibold text-gray-800">Emisiones</h3>
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
                                className="absolute inset-0 pointer-events-none opacity-0"
                            />
                            <button
                                onClick={() => refCalEmi.current?.show?.()}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                {fmtMesAnio(fechaEmisiones)}
                                <i className="pi pi-chevron-down text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6 px-5 py-6">
                        <div className="col-span-12 lg:col-span-6">
                            <div className="mb-6 text-center">
                                <p className="text-4xl font-semibold text-gray-800">{emisiones.total}</p>
                                <p className="text-sm text-gray-500">Comprobantes emitidos</p>
                            </div>

                            <ul className="space-y-2">
                                {emisionesData.labels.map((label, i) => {
                                    const keyMap = {
                                        "Factura Electronica": "facturas",
                                        "Boleta de Venta Electronica": "boletas",
                                        "Nota de Credito": "notasCredito",
                                        "Nota de Debito": "notasDebito",
                                        "Proforma": "proformas",
                                        "Guia de Remision": "guiasRemision",
                                    };
                                    const key = keyMap[label];
                                    return (
                                        <li
                                            key={label}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="inline-block h-3 w-3 rounded-full"
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
                            <div className="mx-auto h-[320px] max-w-[420px]">
                                <Doughnut
                                    data={emisionesData}
                                    options={{ ...emisionesChartOptions, maintainAspectRatio: false, responsive: true }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* === VENTAS === */}
                <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <h3 className="text-lg font-semibold text-gray-800">Ventas</h3>
                        <div className="flex items-center gap-2">
                            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700">
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
                                    className="absolute inset-0 pointer-events-none opacity-0"
                                />
                                <button
                                    onClick={() => refCalVen.current?.show?.()}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    {fmtMesAnio(fechaVentas)}
                                    <i className="pi pi-chevron-down text-gray-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative px-5 py-6">
                        <div className="pointer-events-none absolute right-6 top-6 flex flex-col items-end gap-2">
                            <span className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-bold text-white shadow">
                                S/ {ventas.toFixed(2)}
                            </span>
                            <span className="rounded-md bg-blue-500 px-3 py-1 text-sm font-bold text-white shadow">
                                S/ {(0).toFixed(2)}
                            </span>
                        </div>

                        <div className="h-[360px] w-full">
                            <Line
                                data={ventasData}
                                options={{ ...ventasChartOptions, maintainAspectRatio: false, responsive: true }}
                            />
                        </div>
                    </div>
                </div>

                {/* === COMPRAS === */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <h3 className="text-lg font-semibold text-gray-800">Compras</h3>
                        <div className="flex items-center gap-2">
                            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700">
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
                                    className="absolute inset-0 pointer-events-none opacity-0"
                                />
                                <button
                                    onClick={() => refCalCom.current?.show?.()}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    {fmtMesAnio(fechaCompras)}
                                    <i className="pi pi-chevron-down text-gray-500" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="relative px-5 py-6">
                        <div className="pointer-events-none absolute right-6 top-6">
                            <span className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-bold text-white shadow">
                                S/ {compras.toFixed(2)}
                            </span>
                        </div>

                        <div className="h-[360px] w-full">
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
