import { useState, useRef } from "react";

/**
 * Hook personalizado para filtrar items por fecha
 * @param {Array} items - Array de items a filtrar
 * @param {string} dateField - Nombre del campo de fecha (default: 'fecha')
 * @returns {Object} Estado y funciones para manejar filtro por fecha
 */
export const useDateFilter = (items = [], dateField = 'fecha') => {
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const calendarRef = useRef(null);

    const filteredItems = fechaSeleccionada
        ? items.filter((item) => {
            const itemDate = new Date(item[dateField]);
            return (
                itemDate.getDate() === fechaSeleccionada.getDate() &&
                itemDate.getMonth() === fechaSeleccionada.getMonth() &&
                itemDate.getFullYear() === fechaSeleccionada.getFullYear()
            );
        })
        : [];

    const moverDia = (cantidad) => {
        setFechaSeleccionada((prev) => {
            const fechaBase = prev ? new Date(prev) : new Date();
            fechaBase.setDate(fechaBase.getDate() + cantidad);
            return fechaBase;
        });
    };

    const getTituloFecha = (defaultTitle = "Items") => {
        if (!fechaSeleccionada) return defaultTitle;
        const d = new Date(fechaSeleccionada);
        const diaSemana = d.toLocaleDateString("es-ES", { weekday: "long" });
        const dia = d.getDate();
        const mes = d.toLocaleDateString("es-ES", { month: "long" });
        const anio = d.getFullYear();
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return `${cap(diaSemana)} » ${dia} ${cap(mes)} ${anio}`;
    };

    return {
        fechaSeleccionada,
        setFechaSeleccionada,
        filteredItems,
        moverDia,
        getTituloFecha,
        calendarRef
    };
};
