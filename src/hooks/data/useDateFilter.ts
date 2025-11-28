import { useState, useRef } from "react";
import { Calendar } from "primereact/calendar";

export const useDateFilter = <T extends Record<string, any>>(
  items: T[] = [],
  dateField: keyof T = "fecha"
) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const calendarRef = useRef<Calendar>(null);

  const filteredItems = fechaSeleccionada
    ? items.filter((item) => {
        const val = item[dateField];
        const itemDate = new Date(
          typeof val === "string" || typeof val === "number" ? val : String(val)
        );

        return (
          itemDate.getDate() === fechaSeleccionada.getDate() &&
          itemDate.getMonth() === fechaSeleccionada.getMonth() &&
          itemDate.getFullYear() === fechaSeleccionada.getFullYear()
        );
      })
    : [];

  const moverDia = (cantidad: number) => {
    setFechaSeleccionada((prev: Date | null) => {
      const fechaBase = prev ? new Date(prev) : new Date();
      fechaBase.setDate(fechaBase.getDate() + cantidad);
      return fechaBase;
    });
  };

  const getTituloFecha = (defaultTitle: string = "Items") => {
    if (!fechaSeleccionada) return defaultTitle;
    const d = new Date(fechaSeleccionada);
    const diaSemana = d.toLocaleDateString("es-ES", { weekday: "long" });
    const dia = d.getDate();
    const mes = d.toLocaleDateString("es-ES", { month: "long" });
    const anio = d.getFullYear();

    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    return `${cap(diaSemana)} » ${dia} ${cap(mes)} ${anio}`;
  };

  return {
    fechaSeleccionada,
    setFechaSeleccionada,
    filteredItems,
    moverDia,
    getTituloFecha,
    calendarRef,
  };
};
