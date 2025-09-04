import { generarDataFalsa } from "@services/generadorData";
import {
  MoreVertIcon,
  PermIdentityTwoToneIcon,
  AccessTimeTwoToneIcon,
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon
} from "@constants/iconsConstants";
import { useState, useEffect, useRef } from "react";
import { configCalendar } from "@utils/configCalendar";
import { Calendar } from "primereact/calendar";
import FacturaModal from "./FacturaModal";
import { menuItemsFactura } from "@constants/menuItemsConstants";


export default function FacturasView() {
  const [facturas, setFacturas] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  
  const calendarRef = useRef(null); // 👉 referencia al Calendar de PrimeReact

  const getTituloFecha = (fechaISO) => {
    if (!fechaISO) return "Ventas Realizadas";
    const fecha = new Date(fechaISO);
    const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString("es-ES", { month: "long" });
    return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} » ${dia}° ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
  };

  const facturasFiltradas = fechaSeleccionada
    ? facturas.filter((f) => {
      const fechaFactura = new Date(f.fecha);
      return (
        fechaFactura.getDate() === fechaSeleccionada.getDate() &&
        fechaFactura.getMonth() === fechaSeleccionada.getMonth() &&
        fechaFactura.getFullYear() === fechaSeleccionada.getFullYear()
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
    const datos = generarDataFalsa(50);
    setFacturas(datos);
    configCalendar();
  }, []);

  const moverDia = (cantidad) => {
    setFechaSeleccionada((prev) => {
      const fechaBase = prev ? new Date(prev) : new Date();
      fechaBase.setDate(fechaBase.getDate() + cantidad);
      return fechaBase;
    });
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="font-bold text-gray-800 text-2xl">
          {getTituloFecha(fechaSeleccionada)}
        </h2>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <button className="hover:bg-gray-200 p-2 rounded">
            <KeyboardArrowLeftIcon onClick={() => moverDia(-1)} />
          </button>

          {/* 👉 Calendar ocultando el input de fecha */}
          <Calendar
            ref={calendarRef}
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
            className="hidden"
          />

          {/* Botón con ícono de calendario */}

          <button
            className="hover:bg-gray-200 p-2 rounded"
            onClick={() => calendarRef.current.show()}
          >
            <i className="text-gray-700 pi pi-calendar"></i>
          </button>

          <button className="hover:bg-gray-200 p-2 rounded">
            <KeyboardArrowRightIcon onClick={() => moverDia(1)} />
          </button>

          <MoreVertIcon
            className="hover:bg-gray-200 cursor-pointer"
            onClick={() => setShowConfig(!showConfig)}
          />
          {showConfig && (
            <div className="top-14 right-6 absolute bg-white shadow-lg p-2 rounded-md">
              {menuItemsFactura.map((item, index) => (
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
      <div className="flex-1 px-6 py-6 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
        {fechaSeleccionada ? (
          facturasFiltradas.length > 0 ? (
            <div className="flex flex-col gap-6 w-full">
              {facturasFiltradas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFactura(f)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-6 py-5 shadow-md transition hover:shadow-lg bg-white ${f.tDocumento.toLowerCase().includes("nota de crédito")
                    ? "border-red-300 bg-red-50"
                    : "border-gray-250"
                    }`}
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
                    <p
                      className={`text-xl font-extrabold ${f.monto < 0 ? "text-red-600" : "text-green-600"
                        }`}
                    >
                      {f.monto < 0 ? "- " : ""}S/ {Math.abs(f.monto).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <img
                src="/assets/personaje.png"
                alt="Sin ventas"
                className="mx-auto mb-4 w-48"
              />
              <p className="text-gray-600">
                No se encontraron comprobantes realizados en esta fecha
              </p>
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-600">
              Seleccione una fecha para ver las ventas.
            </p>
          </div>
        )}
      </div>

      {/* MODAL FACTURA */}
      {selectedFactura && (
        <FacturaModal
          f={selectedFactura}
          onClose={() => setSelectedFactura(null)}
        />
      )}
    </div>
  );
}
