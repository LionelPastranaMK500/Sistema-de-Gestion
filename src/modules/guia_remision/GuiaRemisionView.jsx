import {
    MoreVertIcon,
    PermIdentityTwoToneIcon,
    AccessTimeTwoToneIcon
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
        return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} » ${dia}° ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
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
                <h2>{getTituloFecha(fechaSeleccionada)}</h2>

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

                    <button onClick={() => setMostrarNuevo(true)}>
                        Registrar Nuevo
                    </button>

                </div>
            </div>

            <div>
                {fechaSeleccionada ? (
                    guiaRemisionFiltradas.length > 0 ? (
                        <div>
                            {guiaRemisionFiltradas.map((f) => (
                                <div
                                    key={f.id}
                                    onClick={() => setSelectedGuiaRemision(f)}
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
                                alt="Sin Guia de Remision"
                            />
                            <p>No se encontraron Guia de Remision realizadas en esta fecha</p>
                        </div>
                    )
                ) : (
                    <div>
                        <p>Seleccione una fecha para ver las Guias de Remision.</p>
                    </div>
                )}
            </div>

            {selectedGuiaRemision && (
                <GuiaRemisionModal
                    f={selectedGuiaRemision}
                    onClose={() => setSelectedGuiaRemision(false)}
                />
            )}

            {mostrarNuevo && (
                <div>
                    <GuiaRemisionNuevo onClose={() => setMostrarNuevo(false)} />
                </div>
            )}
        </div>
    )
}