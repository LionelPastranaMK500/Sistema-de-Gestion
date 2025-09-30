import {
    MoreVertIcon,
    PermIdentityTwoToneIcon,
    AccessTimeTwoToneIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
} from "@constants/iconsConstants";
import { useState, useEffect, useRef } from "react";
import { configCalendar } from "@utils/configCalendar";
import { Calendar } from "primereact/calendar";
import ProformasModal from "./ProformasModal";
import { menuItemsProformas } from "@constants/menuItemsConstants";

const ProformasView = () => {
    const [proformas] = useState([]); // sin cambios de data ni lógica
    const [showConfig, setShowConfig] = useState(false);
    const [selectedProformas, setSelectedProformas] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const calendarRef = useRef(null);

    const getTituloFecha = (fecha) => {
        if (!fecha) return "Proformas";
        const d = new Date(fecha);
        const diaSemana = d.toLocaleDateString("es-ES", { weekday: "long" });
        const dia = d.getDate(); 
        const mes = d.toLocaleDateString("es-ES", { month: "long" }); 
        const anio = d.getFullYear(); 
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return `${cap(diaSemana)} » ${dia} ${cap(mes)} ${anio}`;
    };

    const proformasFiltradas = fechaSeleccionada
        ? proformas.filter((f) => {
            const fechaProforma = new Date(f.fecha);
            return (
                fechaProforma.getDate() === fechaSeleccionada.getDate() &&
                fechaProforma.getMonth() === fechaSeleccionada.getMonth() &&
                fechaProforma.getFullYear() === fechaSeleccionada.getFullYear()
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

    // === Nuevo: mover día (igual que en Facturas) ===
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

                    <MoreVertIcon
                        className="hover:bg-gray-200 cursor-pointer"
                        onClick={() => setShowConfig(!showConfig)}
                    />
                    {showConfig && (
                        <div className="top-14 right-6 z-40 absolute bg-white shadow-lg p-2 rounded-md">
                            {menuItemsProformas.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 cursor-pointer"
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 px-6 py-6 w-full min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                {fechaSeleccionada ? (
                    proformasFiltradas.length > 0 ? (
                        <div className="flex flex-col gap-6 w-full">
                            {proformasFiltradas.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => setSelectedProformas(f)}
                                    className="flex justify-between items-center bg-white shadow-md hover:shadow-lg px-6 py-5 border border-gray-250 rounded-xl transition cursor-pointer"
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
                                        <p className="font-extrabold text-blue-700 text-xl">
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
                                alt="Sin Proformas"
                                className="mx-auto mb-4 w-48"
                            />
                            <p className="text-gray-600">
                                No se encontraron proformas realizados en esta fecha
                            </p>
                        </div>
                    )
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-gray-600">
                            Seleccione una fecha para ver las proformas.
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL PROFORMA */}
            {selectedProformas && (
                <ProformasModal
                    f={selectedProformas}
                    onClose={() => setSelectedProformas(null)}
                />
            )}
        </div>
    );
}

export default ProformasView;