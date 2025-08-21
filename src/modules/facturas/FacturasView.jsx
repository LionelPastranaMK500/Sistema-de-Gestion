import { dataFalsa } from "./dataFalsa";
import {MoreVertIcon} from "@constants/iconsConstants";
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
    return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} >> ${dia} ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
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
  
  return (
    <div>
      <h2>{getTituloFecha(fechaSeleccionada)}</h2>

      <div>
        <Calendar
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.value)}
          dateFormat="dd/mm/yy"
          showIcon showWeek />
        <MoreVertIcon onClick={() => setShowConfig(!showConfig)}/>
          {showConfig && (
            <div>
              {menuItemsFactura.map((item,index)=>(
                <div key={index}>
                  {item.name && <item.icon/>}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          )}
      </div>

      {fechaSeleccionada ? (
        facturasFiltradas.length > 0 ? (
          <div>
            {facturasFiltradas.map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFactura(f)}
              >
                <p><strong>Número:</strong> {f.numero}</p>
                <p><strong>Cliente:</strong> {f.cliente}</p>
                <p><strong>Monto:</strong> S/ {f.monto}</p>
                <p><strong>Estado:</strong> {f.estado}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3>Sin Ventas</h3>
            <p>No se registraron ventas en esta fecha.</p>
          </div>
        )
      ) : (
        <p>Seleccione una fecha para ver las ventas.</p>
      )}

      {selectedFactura && (
        <FacturaModal
          factura={selectedFactura}
          onClose={() => setSelectedFactura(null)}
        />
      )}
    </div>
  );
}
