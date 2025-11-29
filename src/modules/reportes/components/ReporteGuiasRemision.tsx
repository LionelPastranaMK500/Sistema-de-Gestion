import { useState, useEffect } from "react";
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
import { buildExcel } from "@/services/reportes/excelBuilder";
import { SheetsData } from "@/types/services/reportes";
import { useFilterState } from "@/hooks/data";
import { ReportViewMode, GuiasFilterState } from "@/types/modules/reportes";

const ReporteGuiasRemision = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<ReportViewMode>("filter");
  const [sheetsData, setSheetsData] = useState<SheetsData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    filters: filter,
    updateFilter,
    setFilters: setFilter,
  } = useFilterState<GuiasFilterState>({
    sucursal: "all",
    usuario: "all",
    fechaInicio: null,
    fechaFin: null,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeCompany = getActiveCompany();
  const activeUser = getActiveUser();

  const companySucursales = (activeCompany as any)?.sucursales || [];

  const sucursalOptions = [
    { label: "TODAS LAS SUCURSALES", value: "all" },
    ...(companySucursales.length > 0
      ? companySucursales.map((suc: string) => ({ label: suc, value: suc }))
      : activeCompany?.sucursal
      ? [{ label: activeCompany.sucursal, value: activeCompany.sucursal }]
      : []),
  ];

  const usuarioOptions = [
    { label: "TODOS LOS USUARIOS", value: "all" },
    ...(activeUser?.nombres
      ? [
          {
            label: `${activeUser.nombres} ${activeUser.apellidoPaterno || ""}`,
            value: activeUser.correo,
          },
        ]
      : []),
  ];

  useEffect(() => {
    setVisible(true);
    setMode("filter");
    setSheetsData({});
    setError(null);
    setFilter({
      sucursal: "all",
      usuario: "all",
      fechaInicio: null,
      fechaFin: null,
    });
  }, [location.pathname]);

  const generateReport = async () => {
    const { sucursal, usuario, fechaInicio, fechaFin } = filter;
    if (!sucursal || !usuario || !fechaInicio || !fechaFin) {
      setError("Complete los campos requeridos");
      return;
    }
    if (fechaFin < fechaInicio || fechaFin > today) {
      setError(
        "La fecha fin no puede ser anterior a la fecha inicio ni superar el día de hoy"
      );
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await handleReportes("guia_remision", {
        sucursal,
        usuario,
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaFin: fechaFin.toISOString().split("T")[0],
      });
      if (data && Object.keys(data).length > 0) {
        setSheetsData(data);
        setMode("generated");
      } else {
        setError(
          "No se encontraron datos para el reporte de guías de remisión seleccionado."
        );
      }
    } catch (err) {
      setError(
        "Error al generar el reporte de guías de remisión. Intenta de nuevo."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTableData = (rows: (string | number | null | undefined)[][]) => {
    if (!rows || rows.length < 3) return [];
    const headers = rows[2] || [];
    return rows.slice(3).map((row, rowIndex) =>
      row.reduce(
        (acc: any, cell, index) => {
          const headerKey = String(headers[index] || `col${index}`);
          acc[headerKey] = cell !== undefined && cell !== null ? cell : "-";
          return acc;
        },
        { id: rowIndex }
      )
    );
  };

  const handleExportExcel = async () => {
    if (Object.keys(sheetsData).length > 0) {
      try {
        await buildExcel(sheetsData, "reporte_guias_remision.xlsx");
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
    setFilter({
      sucursal: null,
      usuario: null,
      fechaInicio: null,
      fechaFin: null,
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
            onClick={() => setMode("filter")}
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
                    !filter.sucursal ||
                    !filter.usuario ||
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
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => setMode("filter")}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <i className="pi pi-arrow-left text-base" />
              Volver a filtros
            </button>
          </div>

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
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
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
      header="Reporte de guías de remisión"
      visible={visible}
      onHide={onHide}
      maximized
      className="[&_.p-dialog-content]:bg-[#f5f6f8] [&_.p-dialog-content]:p-6"
    >
      {dialogContent()}
    </Dialog>
  );
};

export default ReporteGuiasRemision;
