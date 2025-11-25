import {
    MoreVertIcon,
    PermIdentityTwoToneIcon,
    AccessTimeTwoToneIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
} from "@constants/icons";
import { useState, useEffect } from "react";
import { configCalendar } from "@/utils/calendar/configCalendar";
import { Calendar } from "primereact/calendar";
import ProformasModal from "./ProformasModal";
import { menuItemsProformas } from "@constants/menuItems";
import { useDateFilter } from "@hooks/data";

const ProformasView = () => {
    const [proformas] = useState([]);
    const [showConfig, setShowConfig] = useState(false);
    const [selectedProformas, setSelectedProformas] = useState(null);

    const {
        fechaSeleccionada,
        setFechaSeleccionada,
        filteredItems: proformasFiltradas,
        moverDia,
        getTituloFecha,
        calendarRef
    } = useDateFilter(proformas);

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

    return (
        <div className="flex flex-col w-full h-screen">
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="font-bold text-gray-800 text-2xl">
                    {getTituloFecha("Proformas")}
                </h2>

                <div className="flex items-center gap-4">
                    <button
                        className="hover:bg-gray-200 p-2 rounded"
                        onClick={() => moverDia(-1)}
                        aria-label="Día anterior"
                    >
                        <KeyboardArrowLeftIcon />
                    </button>

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