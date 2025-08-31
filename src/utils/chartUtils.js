import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title
);

export const comprobantesLabels = [
    "Facturas",
    "Boletas de Venta",
    "Notas de Crédito",
    "Notas de Débito",
    "Proformas",
    "Guías de Remisión",
];

export function buildEmisionesData(conteo) {
    return {
        labels: comprobantesLabels,
        datasets: [
            {
                label: "Comprobantes",
                data: [
                    conteo.facturas,
                    conteo.boletas,
                    conteo.notasCredito,
                    conteo.notasDebito,
                    conteo.proformas,
                    conteo.guiasRemision,
                ],
                backgroundColor: [
                    "#3B82F6",
                    "#10B981",
                    "#EF4444",
                    "#F59E0B",
                    "#8B5CF6",
                    "#06B6D4",
                ],
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };
}

export const emisionesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            position: "right",
        },
        tooltip: {
            callbacks: {
                label: function (context) {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    const dataset = context.dataset.data;
                    const total = dataset.reduce((a, b) => a + b, 0);
                    const porcentaje = total ? ((value / total) * 100).toFixed(1) : 0;
                    return `${label}: ${value} (${porcentaje}%)`;
                },
            },
        },
    },
};

export function buildVentasData(data, fechaFiltro = null) {
    let filtrada = data;
    if (fechaFiltro) {
        const mes = fechaFiltro.getMonth();
        const anio = fechaFiltro.getFullYear();
        filtrada = data.filter((d) => {
            const f = new Date(d.fecha);
            return f.getMonth() === mes && f.getFullYear() === anio;
        });
    }

    const dias = Array.from(
        new Set(filtrada.map((d) => new Date(d.fecha).getDate()))
    ).sort((a, b) => a - b);

    const ventasPorDia = dias.map((dia) =>
        filtrada
            .filter(
                (d) =>
                    ["Factura Electrónica", "Boleta de Venta Electrónica"].includes(d.tDocumento) &&
                    new Date(d.fecha).getDate() === dia
            )
            .reduce((acc, cur) => acc + cur.monto, 0)
    );

    const proformasPorDia = dias.map((dia) =>
        filtrada
            .filter(
                (d) =>
                    d.tDocumento === "Proforma" &&
                    new Date(d.fecha).getDate() === dia
            )
            .reduce((acc, cur) => acc + cur.monto, 0)
    );

    return {
        labels: dias,
        datasets: [
            {
                label: "Ventas",
                data: ventasPorDia,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.3,
            },
            {
                label: "Proformas",
                data: proformasPorDia,
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                tension: 0.3,
            },
        ],
        totals: {
            ventas: ventasPorDia.reduce((a, b) => a + b, 0),
            proformas: proformasPorDia.reduce((a, b) => a + b, 0),
        },
    };
}

export const ventasChartOptions = {
    responsive: true,
    plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Ventas vs Proformas" },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { callback: (value) => `S/ ${value}` },
        },
    },
};

export function buildComprasData(data, fechaFiltro = null) {
    let filtrada = data.filter(d => d.tipoOperacion === "compra");
    if (fechaFiltro) {
        const mes = fechaFiltro.getMonth();
        const anio = fechaFiltro.getFullYear();
        filtrada = filtrada.filter(d => {
            const f = new Date(d.fecha);
            return f.getMonth() === mes && f.getFullYear() === anio;
        });
    }

    const dias = Array.from(
        new Set(filtrada.map(d => new Date(d.fecha).getDate()))
    ).sort((a, b) => a - b);

    const comprasPorDia = dias.map(dia =>
        filtrada
            .filter(d => new Date(d.fecha).getDate() === dia)
            .reduce((acc, cur) => acc + cur.monto, 0)
    );
    return {
        labels: dias,
        datasets: [
            {
                label: "Compras",
                data: comprasPorDia,
                borderColor: "rgba(54,162,235,1)",
                backgroundColor: "rgba(54,162,235,0.2)",
                tension: 0.3,
            }
        ],
        totals: {
            compras: comprasPorDia.reduce((a, b) => a + b, 0)
        }
    };
}

export const comprasChartOptions = {
    responsive: true,
    plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Compras por día" },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { callback: value => `S/ ${value}` },
        },
    },
};