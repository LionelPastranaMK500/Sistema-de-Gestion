import {
    MoreVertIcon,
    PermIdentityTwoToneIcon,
    AccessTimeTwoToneIcon
} from "@constants/iconsConstants";
import { useState, useEffect, useRef } from "react";
import { configCalendar } from "@utils/configCalendar";
import { Calendar } from "primereact/calendar";
import ProformasModal from "./ProformasModal";
import { menuItemsProformas } from "@constants/menuItemsConstants";

export default function ProformasView() {
    const [proformas] = useState([]);
    const [showConfig, setShowConfig] = useState(false);
    const [selectedProformas, setSelectedProformas] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

    const calendarRef = useRef(null);

    const getTituloFecha = (fecha) => {
        if (!fecha) return "Proformas";
        const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
        const dia = fecha.getDate();
        const mes = fecha.toLocaleDateString("es-ES", { month: "long" });
        return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} » ${dia}° ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
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
        const fechaFormateada = fecha.toLocaleDateString("es-ES", opcionesFecha).replace(/\b\w/, c => c.toUpperCase());
        const horaFormateada = fecha.toLocaleTimeString("es-ES", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
        return `${fechaFormateada}, ${horaFormateada}`;
    };

    useEffect(() => {
        configCalendar();
    }, []);

    return (
        <div>
            <div>
                <h2>
                    {getTituloFecha(fechaSeleccionada)}
                </h2>

                <div>
                    <Calendar
                        ref={calendarRef}
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                    />

                    <button onClick={() => calendarRef.current.show()}>
                        <i></i>
                    </button>

                    <MoreVertIcon onClick={() => setShowConfig(!showConfig)} />
                    {showConfig && (
                        <div>
                            {menuItemsProformas.map((item, index) => (
                                <div key={index}>
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div>
                {fechaSeleccionada ? (
                    proformasFiltradas.length > 0 ? (
                        <div>
                            {proformasFiltradas.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => setSelectedProformas(f)}
                                >
                                    <div>
                                        <p>
                                            {f.tDocumento} » {f.numero}
                                        </p>
                                        <p>
                                            <PermIdentityTwoToneIcon fontSize="small" />
                                            <span>
                                                {f.cliente} ({f.ruc})
                                            </span>
                                        </p>
                                        <p>
                                            <AccessTimeTwoToneIcon fontSize="small" />
                                            {formatoFechaHora(f.fecha)}
                                        </p>
                                    </div>

                                    <div>
                                        <p>
                                            S/ {Math.abs(f.monto).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <img
                                src="/assets/personaje.png"
                                alt="Sin Proformas"
                            />
                            <p>No se encontraron proformas realizados en esta fecha</p>
                        </div>
                    )
                ) : (
                    <div>
                        <p>Seleccione una fecha para ver las proformas.</p>
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
