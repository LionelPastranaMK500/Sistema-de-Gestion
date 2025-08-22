import { dataFalsa } from "./dataFalsa";
import { MoreVertIcon } from "@constants/iconsConstants";
import { useState, useEffect } from "react";
import { configCalendar } from "@utils/configCalendar";
import { Calendar } from "primereact/calendar";
import FacturaModal from "./FacturaModal";
import { menuItemsFactura } from "@constants/menuItemsConstants";

export default function FacturasView() {
  const [facturas] = useState(dataFalsa);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const parseFecha = (str) => {
    if (!str) return null;
    const [dia, mes, anio] = str.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
  };

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
        const fechaFactura = parseFecha(f.fecha);
        return (
          fechaFactura.getDate() === fechaSeleccionada.getDate() &&
          fechaFactura.getMonth() === fechaSeleccionada.getMonth() &&
          fechaFactura.getFullYear() === fechaSeleccionada.getFullYear()
        );
      })
    : [];

  useEffect(() => {
    configCalendar();
  }, []);

  // 🔹 Funciones para mover fechas
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
      <div className="flex justify-between items-center border-b px-6 py-4">
        {/* Título */}
        <h2 className="font-bold text-gray-800 text-xl">
          {getTituloFecha(fechaSeleccionada)}
        </h2>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <Calendar
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
          />
          <button
            className="p-2 hover:bg-gray-200 rounded"
            onClick={() => moverDia(-1)}
          >
            {"<"}
          </button>
          <button
            className="p-2 hover:bg-gray-200 rounded"
            onClick={() => moverDia(1)}
          >
            {">"}
          </button>
          <MoreVertIcon
            className="cursor-pointer"
            onClick={() => setShowConfig(!showConfig)}
          />
          {showConfig && (
            <div className="absolute top-14 right-6 bg-white shadow-lg rounded-md p-2">
              {menuItemsFactura.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
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
      <div className="flex-1 w-full px-6 py-4 overflow-auto">
        {fechaSeleccionada ? (
          facturasFiltradas.length > 0 ? (
            <div className="flex flex-col gap-4 w-full">
              {facturasFiltradas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFactura(f)}
                  className="p-6 bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition w-full"
                >
                  <p><strong>Número:</strong> {f.numero}</p>
                  <p><strong>Cliente:</strong> {f.cliente}</p>
                  <p><strong>Monto:</strong> S/ {f.monto}</p>
                  <p><strong>Estado:</strong> {f.estado}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src="/assets/personaje.png"
                alt="Sin ventas"
                className="w-48 mx-auto mb-4"
              />
              <p className="text-gray-600">
                No se encontraron comprobantes realizados en esta fecha
              </p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">
              Seleccione una fecha para ver las ventas.
            </p>
          </div>
        )}
      </div>

      {/* MODAL FACTURA */}
      {selectedFactura && (
        <FacturaModal
          factura={selectedFactura}
          onClose={() => setSelectedFactura(null)}
        />
      )}
    </div>
  );
}
