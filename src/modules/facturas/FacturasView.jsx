import { dataFalsa } from "./dataFalsa";
import { MoreVertIcon,PermIdentityTwoToneIcon,AccessTimeTwoToneIcon} from "@constants/iconsConstants";
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
      <div className="flex justify-between items-center px-6 py-4 border-b">
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
            className="hover:bg-gray-200 p-2 rounded"
            onClick={() => moverDia(-1)}
          >
            {"<"}
          </button>
          <button
            className="hover:bg-gray-200 p-2 rounded"
            onClick={() => moverDia(1)}
          >
            {">"}
          </button>
          <MoreVertIcon
            className="cursor-pointer"
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
      <div className="flex-1 px-6 py-4 w-full overflow-auto">
        {fechaSeleccionada ? (
          facturasFiltradas.length > 0 ? (
            <div className="flex flex-col gap-4 w-full">
              {facturasFiltradas.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFactura(f)}
                  className="bg-white shadow hover:shadow-md p-6 rounded-lg w-full transition cursor-pointer"
                >
                  <p><strong>{f.tDocumento} &gt;&gt; {f.numero}</strong></p>
                  <p><PermIdentityTwoToneIcon/>{f.cliente}({f.ruc})</p>
                  <p><AccessTimeTwoToneIcon/>{formatoFechaHora(f.fecha)}</p>
                  <p><strong>S/ {f.monto}</strong></p>
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
          factura={selectedFactura}
          onClose={() => setSelectedFactura(null)}
        />
      )}
    </div>
  );
}
