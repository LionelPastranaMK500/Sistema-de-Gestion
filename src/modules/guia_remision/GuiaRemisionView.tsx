import {
  PermIdentityTwoToneIcon,
  AccessTimeTwoToneIcon,
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
} from "@/constants/icons";
import { useState, useEffect } from "react";
import { configCalendar } from "@/utils/calendar/configCalendar";
import { Calendar } from "primereact/calendar";
// CORRECCIÓN: Importación correcta desde la carpeta components
import GuiaRemisionModal from "./components/GuiaRemisionModal";
import GuiaRemisionNuevo from "./GuiaRemisionNuevo";
import { useDateFilter } from "@/hooks/data";
import { VentaGenerada } from "@/services/generadorData";

const GuiaRemision = () => {
  const [guia_remision] = useState<VentaGenerada[]>([]);
  const [selectedGuiaRemision, setSelectedGuiaRemision] =
    useState<VentaGenerada | null>(null);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);

  const {
    fechaSeleccionada,
    setFechaSeleccionada,
    filteredItems: guiaRemisionFiltradas,
    moverDia,
    getTituloFecha,
    calendarRef,
  } = useDateFilter<VentaGenerada>(guia_remision);

  const formatoFechaHora = (fechaISO: string | Date | null | undefined) => {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    const opcionesFecha = { day: "numeric", month: "long" } as const;
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
          {getTituloFecha("Guias de Remision")}
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
              onChange={(e) => setFechaSeleccionada(e.value as Date | null)}
              dateFormat="dd/mm/yy"
              appendTo={document.body}
              panelClassName="z-50"
              className="absolute inset-0 opacity-0 pointer-events-none"
            />
            <button
              className="hover:bg-gray-200 p-2 rounded"
              onClick={() => calendarRef.current?.show()}
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

          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
            onClick={() => setMostrarNuevo(true)}
          >
            + NUEVO
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-6 w-full min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        {fechaSeleccionada ? (
          guiaRemisionFiltradas.length > 0 ? (
            <div className="flex flex-col gap-6 w-full">
              {guiaRemisionFiltradas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedGuiaRemision(f)}
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
                        {f.cliente} ({(f as any).ruc})
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-500 text-sm">
                      <AccessTimeTwoToneIcon fontSize="small" />
                      {formatoFechaHora(f.fecha)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-extrabold text-blue-700 text-xl">
                      S/ {Math.abs(f.monto?.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <img
                src="/assets/personaje.png"
                alt="Sin Guias de Remision"
                className="mx-auto mb-4 w-48"
              />
              <p className="text-gray-600">
                No se encontraron guias de remision en esta fecha
              </p>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">
              Seleccione una fecha para ver las guias de remision.
            </p>
          </div>
        )}
      </div>

      {selectedGuiaRemision && (
        <GuiaRemisionModal
          f={selectedGuiaRemision}
          onClose={() => setSelectedGuiaRemision(null)}
        />
      )}

      {mostrarNuevo && (
        <GuiaRemisionNuevo onClose={() => setMostrarNuevo(false)} />
      )}
    </div>
  );
};

export default GuiaRemision;
