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

export function buildVentasData(data, fechaFiltro = new Date()) {
    if (!fechaFiltro) fechaFiltro = new Date();
    const mes = fechaFiltro.getMonth();
    const anio = fechaFiltro.getFullYear();

    const filtrada = data.filter(d => {
        const f = new Date(d.fecha);
        return f.getMonth() === mes && f.getFullYear() === anio;
    });

    const ultimoDia = new Date(anio, mes + 1, 0).getDate();

    const dias = Array.from({ length: ultimoDia }, (_, i) => i + 1);

    const ventasPorDia = dias.map(dia =>
        filtrada
            .filter(d =>
                ["FACTURA ELECTRÓNICA", "BOLETA DE VENTA ELECTRÓNICA"].includes(d.tDocumento) &&
                new Date(d.fecha).getDate() === dia
            )
            .reduce((acc, cur) => acc + (cur.monto?.total || 0), 0) // <--- CORRECCIÓN 1
    );

    const proformasPorDia = dias.map(dia =>
        filtrada
            .filter(d =>
                d.tDocumento === "PROFORMA ELECTRÓNICA" &&
                new Date(d.fecha).getDate() === dia
            )
            .reduce((acc, cur) => acc + (cur.monto?.total || 0), 0) // <--- CORRECCIÓN 2
    );

    const labels = dias.map(d => d.toString().padStart(2, "0"));

    return {
        labels,
        datasets: [
            {
                label: "Ventas",
                data: ventasPorDia,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: "Proformas",
                data: proformasPorDia,
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
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
