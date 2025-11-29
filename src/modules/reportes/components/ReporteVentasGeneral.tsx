import { useState, useEffect, useMemo } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useLocation, useNavigate } from "react-router-dom";

import { getActiveCompany, getActiveUser } from "@/services/auth/authServices";
import { handleReportes } from "@/services/reportes/reportesLogic";
import { getClientes } from "@/services/generadorData";
import { buildExcel } from "@/services/reportes/excelBuilder";
import { SheetsData } from "@/types/services/reportes";
import { useFilterState } from "@/hooks/data";
import { ReportViewMode, VentasFilterState } from "@/types/modules/reportes";

const ReporteVentasGeneral = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<ReportViewMode>("filter");
  const [sheetsData, setSheetsData] = useState<SheetsData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  };

  const initialRange = getMonthRange();

  const {
    filters: filter,
    updateFilter,
    setFilters: setFilter,
  } = useFilterState<VentasFilterState>({
    tipo: "all",
    moneda: "all",
    sucursal: "all",
    usuario: "all",
    cliente: "all",
    start: initialRange.start,
    end: initialRange.end,
    fechaInicio: initialRange.start,
    fechaFin: initialRange.end,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const clientes = useMemo(() => getClientes(), []);
  const initialCompany = getActiveCompany();
  const initialUser = getActiveUser();

  const companySucursales = (initialCompany as any)?.sucursales || [];

  const tipoOptions = [
    { label: "TODOS LOS COMPROBANTES", value: "all" },
    { label: "FACTURAS ELECTRÓNICAS", value: "facturas_electronicas" },
    {
      label: "BOLETAS DE VENTA ELECTRÓNICAS",
      value: "boletas_venta_electronicas",
    },
    {
      label: "NOTAS DE CRÉDITO ELECTRÓNICAS",
      value: "notas_credito_electronicas",
    },
    {
      label: "NOTAS DE DÉBITO ELECTRÓNICAS",
      value: "notas_debito_electronicas",
    },
    { label: "NOTAS DE VENTA", value: "notas_venta" },
    { label: "PROFORMAS", value: "proformas" },
  ];

  const monedaOptions = [
    { label: "TODAS LAS MONEDAS", value: "all" },
    { label: "PEN", value: "PEN" },
  ];

  const sucursalOptions = useMemo(
    () => [
      { label: "TODAS LAS SUCURSALES", value: "all" },
      ...(companySucursales.length > 0
        ? companySucursales.map((suc: string) => ({ label: suc, value: suc }))
        : initialCompany?.sucursal
        ? [{ label: initialCompany.sucursal, value: initialCompany.sucursal }]
        : [{ label: "Lubricantes Claudia", value: "Lubricantes Claudia" }]),
    ],
    [initialCompany, companySucursales]
  );

  const usuarioOptions = useMemo(
    () => [
      { label: "TODOS LOS USUARIOS", value: "all" },
      ...(initialUser?.nombres
        ? [
            {
              label: `${initialUser.nombres} ${
                initialUser.apellidoPaterno || ""
              }`,
              value: initialUser.correo,
            },
          ]
        : [{ label: "Juan Santos", value: "juan@example.com" }]),
    ],
    [initialUser]
  );

  const clienteOptions = useMemo(
    () => [
      { label: "TODOS LOS CLIENTES", value: "all" },
      ...clientes.map((cliente) => ({
        label: cliente.nombre || cliente.razonSocial || String(cliente),
        value: cliente.nombre || cliente.razonSocial || String(cliente),
      })),
    ],
    [clientes]
  );

  useEffect(() => {
    setSheetsData({});
    setError(null);
    const range = getMonthRange();
    setFilter((prev) => ({
      ...prev,
      sucursal:
        prev.sucursal ?? (initialCompany?.sucursal || "Lubricantes Claudia"),
      usuario: prev.usuario ?? (initialUser?.correo || "juan@example.com"),
      fechaInicio: range.start,
      fechaFin: range.end,
    }));
  }, [location.pathname, initialCompany, initialUser, setFilter]);

  const generateReport = async () => {
    const { tipo, moneda, sucursal, usuario, cliente, fechaInicio, fechaFin } =
      filter;
    if (
      !tipo ||
      !moneda ||
      !sucursal ||
      !usuario ||
      !cliente ||
      !fechaInicio ||
      !fechaFin
    ) {
      setError("Debes completar todos los campos antes de continuar.");
      return;
    }
    if (fechaFin < fechaInicio || fechaFin > today) {
      setError(
        "La fecha fin no puede ser anterior a la fecha inicio ni superar el día de hoy."
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await handleReportes("venta_reporte", {
        type: tipo,
        moneda,
        sucursal,
        usuario,
        cliente,
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaFin: fechaFin.toISOString().split("T")[0],
      });
      if (data && Object.keys(data).length > 0) {
        setSheetsData(data);
        setMode("generated");
      } else {
        setError(
          "No se encontraron datos para el reporte de ventas seleccionado."
        );
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Error al generar el reporte de ventas. Intenta de nuevo."
      );
      console.error("Error en handleReportes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTableData = (rows: (string | number | null | undefined)[][]) => {
    if (!rows || rows.length < 3) return [];
    const headers = rows[2] || [];
    return rows.slice(3, -1).map((row, rowIndex) =>
      row.reduce(
        (acc: any, cell, index) => {
          acc[String(headers[index]) || `col${index}`] =
            cell !== undefined ? cell : "-";
          return acc;
        },
        { id: rowIndex }
      )
    );
  };

  const handleExportExcel = async () => {
    if (Object.keys(sheetsData).length > 0) {
      try {
        await buildExcel(sheetsData, "reporte_ventas.xlsx");
      } catch (err) {
        console.error("Error al exportar Excel:", err);
      }
    }
  };

  const onHide = () => {
    setVisible(false);
    setMode("filter");
    setSheetsData({});
    setError(null);
    const range = getMonthRange();
    setFilter({
      tipo: "all",
      moneda: "all",
      sucursal: "all",
      usuario: "all",
      cliente: "all",
      start: range.start,
      end: range.end,
      fechaInicio: range.start,
      fechaFin: range.end,
    });
    navigate("/reportes");
  };

  const dialogContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-[calc(100vh-140px)] grid place-items-center">
          <ProgressSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-[calc(100vh-140px)] grid place-items-center gap-3">
          <Message severity="error" text={error} />
          <Button
            label="Volver a intentar"
            icon="pi pi-refresh"
            onClick={() => {
              setError(null);
              setMode("filter");
            }}
            className="p-button-primary"
          />
        </div>
      );
    }

    if (mode === "filter") {
      return (
        <div className="p-5">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-slate-800 font-semibold text-lg">Filtros</h3>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Tipo de comprobante
                </label>
                <Dropdown
                  value={filter.tipo}
                  options={tipoOptions}
                  onChange={(e) => updateFilter("tipo", e.value)}
                  placeholder="Selecciona tipo"
                  className="w-full [&_.p-dropdown]:rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Moneda
                </label>
                <Dropdown
                  value={filter.moneda}
                  options={monedaOptions}
                  onChange={(e) => updateFilter("moneda", e.value)}
                  placeholder="Selecciona moneda"
                  className="w-full [&_.p-dropdown]:rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Sucursal
                </label>
                <Dropdown
                  value={filter.sucursal}
                  options={sucursalOptions}
                  onChange={(e) => updateFilter("sucursal", e.value)}
                  placeholder="Selecciona sucursal"
                  className="w-full [&_.p-dropdown]:rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Usuario
                </label>
                <Dropdown
                  value={filter.usuario}
                  options={usuarioOptions}
                  onChange={(e) => updateFilter("usuario", e.value)}
                  placeholder="Selecciona usuario"
                  className="w-full [&_.p-dropdown]:rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Cliente
                </label>
                <Dropdown
                  value={filter.cliente}
                  options={clienteOptions}
                  onChange={(e) => updateFilter("cliente", e.value)}
                  placeholder="Selecciona cliente"
                  filter
                  showClear
                  className="w-full [&_.p-dropdown]:rounded-lg"
                  panelClassName="rounded-lg overflow-hidden max-h-[320px]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Fecha inicio
                </label>
                <Calendar
                  value={filter.fechaInicio}
                  onChange={(e) => updateFilter("fechaInicio", e.value)}
                  placeholder="Fecha inicio"
                  dateFormat="dd/mm/yy"
                  maxDate={today}
                  showIcon
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Fecha fin
                </label>
                <Calendar
                  value={filter.fechaFin}
                  onChange={(e) => updateFilter("fechaFin", e.value)}
                  placeholder="Fecha fin"
                  dateFormat="dd/mm/yy"
                  maxDate={today}
                  showIcon
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2 pt-1">
                <Button
                  label="GENERAR REPORTE"
                  icon="pi pi-refresh"
                  onClick={generateReport}
                  disabled={
                    !filter.tipo ||
                    !filter.moneda ||
                    !filter.sucursal ||
                    !filter.usuario ||
                    !filter.cliente ||
                    !filter.fechaInicio ||
                    !filter.fechaFin
                  }
                  className="bg-[#1e40af] hover:bg-[#1b3a9c] px-5 py-3 rounded-md font-semibold text-white"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (mode === "generated") {
      return (
        <div className="p-6">
          <button
            type="button"
            onClick={() => setMode("filter")}
            className="inline-flex items-center gap-2 mb-6 font-semibold text-blue-600 hover:text-blue-700"
          >
            <i className="pi pi-arrow-left text-base" />
            Volver a filtros
          </button>

          <div className="min-h-[calc(100vh-220px)] flex items-center justify-center gap-10">
            <button
              type="button"
              onClick={() => setMode("visualize")}
              disabled={Object.keys(sheetsData).length === 0}
              className="w-[240px] h-[120px] bg-white border border-blue-400 rounded-lg shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-2 text-blue-600"
            >
              <i className="pi pi-eye text-[28px]" />
              <span className="font-semibold tracking-wide">VISTA PREVIA</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              disabled={Object.keys(sheetsData).length === 0}
              className="w-[240px] h-[120px] bg-white border border-blue-400 rounded-lg shadow-sm hover:shadow-lg flex flex-col items-center justify-center gap-2 text-blue-600"
            >
              <i className="pi pi-download text-[28px]" />
              <span className="font-semibold tracking-wide">DESCARGAR</span>
            </button>
          </div>
        </div>
      );
    }

    if (mode === "visualize") {
      return (
        <div className="p-5">
          <button
            type="button"
            onClick={() => setMode("generated")}
            className="inline-flex items-center gap-2 mb-4 font-semibold text-blue-600 hover:text-blue-700"
          >
            <i className="pi pi-arrow-left text-base" />
            Volver
          </button>

          {Object.keys(sheetsData).length === 0 ? (
            <div className="min-h-[calc(100vh-220px)] grid place-items-center">
              <Message
                severity="info"
                text="No hay datos disponibles para mostrar."
              />
            </div>
          ) : (
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
            >
              {Object.keys(sheetsData).map((tipo, index) => (
                <TabPanel header={tipo} key={index}>
                  <div className="bg-white rounded-lg shadow-sm">
                    <DataTable
                      value={getTableData(sheetsData[tipo])}
                      paginator
                      rows={10}
                      scrollable
                      emptyMessage="No hay datos para mostrar."
                      className="[&_.p-datatable-thead>tr>th]:bg-[#1857C3] [&_.p-datatable-thead>tr>th]:text-white"
                    >
                      {(sheetsData[tipo][2] || []).map((header, colIndex) => (
                        <Column
                          key={colIndex}
                          field={String(header) || `col${colIndex}`}
                          header={String(header) || `Columna ${colIndex + 1}`}
                          sortable
                        />
                      ))}
                    </DataTable>
                  </div>
                </TabPanel>
              ))}
            </TabView>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog
      key={location.pathname}
      header="Reporte de ventas"
      visible={visible}
      onHide={onHide}
      maximized
      className="[&_.p-dialog-content]:bg-[#f5f6f8] [&_.p-dialog-content]:p-6"
    >
      {dialogContent()}
    </Dialog>
  );
};

export default ReporteVentasGeneral;
