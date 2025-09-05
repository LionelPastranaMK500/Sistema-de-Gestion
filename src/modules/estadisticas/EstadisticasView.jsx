import React, { useEffect, useState } from "react";
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
        total: 0,
        facturas: 0,
        boletas: 0,
        notasCredito: 0,
        notasDebito: 0,
        proformas: 0,
        guiasRemision: 0,
    });

    const filtrarPorFecha = (fechaFiltro, data) => {
        if (!fechaFiltro) return data;
        const mes = fechaFiltro.getMonth();
        const anio = fechaFiltro.getFullYear();
        return data.filter((d) => {
            const fecha = new Date(d.fecha);
            return fecha.getMonth() === mes && fecha.getFullYear() === anio;
        });
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
        if (fechaEmisiones) toast.success("Emisiones actualizadas",{autoClose: 1000});
    }, [fechaEmisiones, data]);

    useEffect(() => {
        if (!data.length) return;
        const filtrada = filtrarPorFecha(fechaVentas, data).filter(d => d.tipoOperacion === "venta");
        const total = filtrada.reduce((acc, cur) => acc + cur.monto, 0);
        setVentas(total);
        setDataVentasFiltrada(filtrada);
        if (fechaVentas) toast.success("Ventas actualizadas",{autoClose: 1000});
    }, [fechaVentas, data]);

    useEffect(() => {
        if (!data.length) return;
        const filtrada = filtrarPorFecha(fechaCompras, data).filter(d => d.tipoOperacion === "compra");
        const total = filtrada.reduce((acc, cur) => acc + cur.monto, 0);
        setCompras(total);
        setDataCompras(buildComprasData(filtrada, fechaCompras));
        if (fechaCompras) toast.success("Compras actualizadas",{autoClose: 1000});
    }, [fechaCompras, data]);

    const emisionesData = buildEmisionesData(emisiones);
    const ventasData = buildVentasData(dataVentasFiltrada);

    return (
        <div>
            <h2>Estadísticas</h2>

            <div>
                <h2>Emisiones</h2>
                <p>{emisiones.total} Comprobantes Emitidos</p>
                <Calendar
                    value={fechaEmisiones}
                    onChange={(e) => setFechaEmisiones(e.value)}
                    dateFormat="mm/yy"
                    showIcon
                />
                <ul>
                    {emisionesData.labels.map((label, i) => {
                        // mapeo
                        const keyMap = {
                            "Factura Electronica": "Factura",
                            "Boleta de Venta Electronica": "Boleta",
                            "Nota de Credito": "NotaCredito",
                            "Nota de Debito": "NotaDebito",
                            "Proforma": "Proforma",
                            "Guia de Remision": "Guia"
                        };
                        const key = keyMap[label];

                        return (
                            <li key={label}>
                                <span style={{ backgroundColor: emisionesData.datasets[0].backgroundColor[i] }} />
                                {label}: {emisiones[key]}
                            </li>
                        );
                    })}
                </ul>

                <div>
                    <Doughnut data={emisionesData} options={emisionesChartOptions} />
                </div>
            </div>

            <div>
                <h2>Ventas</h2>
                <select>
                    <option value="">PEN</option>
                </select>
                <Calendar
                    value={fechaVentas}
                    onChange={(e) => setFechaVentas(e.value)}
                    dateFormat="mm/yy"
                    showIcon
                />
                <p>Total Ventas: S/{ventas.toFixed(2)}</p>
                <div>
                    <Line data={ventasData} options={ventasChartOptions} />
                </div>
            </div>

            <div>
                <h2>Compras</h2>
                <select>
                    <option value="">PEN</option>
                </select>
                <Calendar
                    value={fechaCompras}
                    onChange={(e) => setFechaCompras(e.value)}
                    dateFormat="mm/yy"
                    showIcon
                />
                <p>Total Compras: S/ {compras.toFixed(2)}</p>
                <div>
                    {dataCompras && <Line data={dataCompras} options={comprasChartOptions} />}
                </div>
            </div>
        </div>
    );
}
