import {
    MoreVertIcon, // (no usado, lo dejo si lo necesitas luego)
    PermIdentityTwoToneIcon,
    AccessTimeTwoToneIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
} from "@constants/iconsConstants";
import { useState, useEffect, useRef } from "react";
import { configCalendar } from "@utils/configCalendar";
import { Calendar } from "primereact/calendar";
import GuiaRemisionModal from "./GuiaRemisionModal";
import GuiaRemisionNuevo from "./GuiaRemisionNuevo";

export default function GuiaRemision() {
    const [guia_remision] = useState([]);
    const [selectedGuiaRemision, setSelectedGuiaRemision] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [mostrarNuevo, setMostrarNuevo] = useState(false);

    const calendarRef = useRef(null);

    const getTituloFecha = (fecha) => {
        if (!fecha) return "Guias de Remision";
        const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
        const dia = fecha.getDate();
        const mes = fecha.toLocaleDateString("es-ES", { month: "long" });
        const anio = fecha.getFullYear();
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return `${cap(diaSemana)} » ${dia} ${cap(mes)} ${anio}`;
    };

    const guiaRemisionFiltradas = fechaSeleccionada
        ? guia_remision.filter((f) => {
            const fechaGuiaRemision = new Date(f.fecha);
            return (
                fechaGuiaRemision.getDate() === fechaSeleccionada.getDate() &&
                fechaGuiaRemision.getMonth() === fechaSeleccionada.getMonth() &&
                fechaGuiaRemision.getFullYear() === fechaSeleccionada.getFullYear()
            );
        })
        : [];

    const formatoFechaHora = (fechaISO) => {
        if (!fechaISO) return "";
        const fecha = new Date(fechaISO);
        const opcionesFecha = { day: "numeric", month: "long" };
        const fechaFormateada = fecha
            .toLocaleDateString("es-ES", opcionesFecha)
            .replace(/\b\w/, (c) => c.toUpperCase());
        const horaFormateada = fecha.toLocaleTimeString("es-ES", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        return `${fechaFormateada}, ${horaFormateada}`;
    };

    useEffect(() => {
        configCalendar();
    }, []);

    // navegación por días (mismo patrón)
    const moverDia = (cantidad) => {
        setFechaSeleccionada((prev) => {
            const fechaBase = prev ? new Date(prev) : new Date();
            fechaBase.setDate(fechaBase.getDate() + cantidad);
            return fechaBase;
        });
    };

    return (
        <div className="flex flex-col w-full h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="font-bold text-gray-800 text-2xl">
                    {getTituloFecha(fechaSeleccionada)}
                </h2>

                {/* Acciones */}
                <div className="flex items-center gap-4">
                    {/* Flecha izquierda */}
                    <button
                        className="hover:bg-gray-200 p-2 rounded"
                        onClick={() => moverDia(-1)}
                        aria-label="Día anterior"
                    >
                        <KeyboardArrowLeftIcon />
                    </button>

                    {/* Calendario anclado al ícono (overlay en body) */}
                    <div className="relative">
                        <Calendar
                            ref={calendarRef}
                            value={fechaSeleccionada}
                            onChange={(e) => setFechaSeleccionada(e.value)}
                            dateFormat="dd/mm/yy"
                            appendTo={document.body}
                            panelClassName="z-50"
                            className="absolute inset-0 opacity-0 pointer-events-none"
                        />
                        <button
                            className="hover:bg-gray-200 p-2 rounded"
                            onClick={() => calendarRef.current?.show?.()}
                            aria-label="Abrir calendario"
                        >
                            <i className="text-gray-700 pi pi-calendar"></i>
                        </button>
                    </div>

                    {/* Flecha derecha */}
                    <button
                        className="hover:bg-gray-200 p-2 rounded"
                        onClick={() => moverDia(1)}
                        aria-label="Día siguiente"
                    >
                        <KeyboardArrowRightIcon />
                    </button>

                    {/* Registrar Nuevo */}
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        onClick={() => setMostrarNuevo(true)}
                    >
                        Registrar Nuevo
                    </button>
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 min-h-0 px-6 py-6 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                {fechaSeleccionada ? (
                    guiaRemisionFiltradas.length > 0 ? (
                        <div className="flex flex-col gap-6 w-full">
                            {guiaRemisionFiltradas.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => setSelectedGuiaRemision(f)}
                                    className="flex cursor-pointer items-center justify-between rounded-xl border px-6 py-5 shadow-md transition hover:shadow-lg bg-white border-gray-250"
                                    style={{ minHeight: "110px" }}
                                >
                                    {/* Izquierda */}
                                    <div className="flex flex-col gap-1 text-gray-700 text-base">
                                        <p className="font-bold text-gray-900 text-lg">
                                            {f.tDocumento} » {f.numero}
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-700 text-base">
                                            <PermIdentityTwoToneIcon fontSize="small" />
                                            <span>
                                                {f.cliente} ({f.ruc})
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2 text-gray-500 text-sm">
                                            <AccessTimeTwoToneIcon fontSize="small" />
                                            {formatoFechaHora(f.fecha)}
                                        </p>
                                    </div>

                                    {/* Derecha */}
                                    <div className="text-right">
                                        <p className="text-xl font-extrabold text-blue-700">
                                            S/ {Math.abs(f.monto).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-full">
                            <img
                                src="/assets/personaje.png"
                                alt="Sin Guia de Remision"
                                className="mx-auto mb-4 w-48"
                            />
                            <p className="text-gray-600">
                                No se encontraron Guia de Remision realizadas en esta fecha
                            </p>
                        </div>
                    )
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-600">
                            Seleccione una fecha para ver las Guias de Remision.
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL DETALLE */}
            {selectedGuiaRemision && (
                <GuiaRemisionModal
                    f={selectedGuiaRemision}
                    onClose={() => setSelectedGuiaRemision(false)} // (respetando tu lógica)
                />
            )}

            {/* MODAL NUEVO */}
            {mostrarNuevo && (
                <div>
                    <GuiaRemisionNuevo onClose={() => setMostrarNuevo(false)} />
                </div>
            )}
        </div>
    );
}
