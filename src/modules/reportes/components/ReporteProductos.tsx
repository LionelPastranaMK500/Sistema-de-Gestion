import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";

import { handleReportes } from "@/services/reportes/reportesLogic";
import { buildExcel, SheetsData } from "@/services/reportes/excelBuilder";

type ViewMode = "visualize" | null;

const ReporteProductos = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(true);
  const [mode, setMode] = useState<ViewMode>(null);
  const [sheetsData, setSheetsData] = useState<SheetsData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setVisible(true);
    setSheetsData({});
    setError(null);
    setMode(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!visible) return;
    if (Object.keys(sheetsData).length > 0) return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await handleReportes("producto_listado");
        if (data && Object.keys(data).length > 0) {
          setSheetsData(data);
        } else {
          setError("No se encontraron datos para el reporte de productos");
        }
      } catch (err) {
        console.error("Error en handleReportes:", err);
        setError("Error al cargar los datos del reporte.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [visible, sheetsData]);

  const getTableData = (rows: (string | number | null | undefined)[][]) => {
    if (!rows || rows.length < 3) return [];
    const headers = rows[2] || [];
    return rows.slice(3).map((row, rowIndex) =>
      row.reduce(
        (acc: any, cell, index) => {
          acc[String(headers[index]) || `col${index}`] = cell ?? "-";
          return acc;
        },
        { id: rowIndex }
      )
    );
  };

  const handleExportExcel = async () => {
    if (isLoading || Object.keys(sheetsData).length === 0) return;
    try {
      await buildExcel(sheetsData, "reporte_Listadoproductos.xlsx");
    } catch (err) {
      console.error("Error al exportar Excel:", err);
    }
  };

  const onHide = () => {
    setVisible(false);
    setMode(null);
    setSheetsData({});
    setError(null);
    navigate("/reportes");
  };

  const dialogContent = () => {
    if (isLoading) {
      return (
        <div className="place-items-center grid min-h-[calc(100vh-140px)]">
          <ProgressSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="place-items-center gap-3 grid min-h-[calc(100vh-140px)]">
          <Message severity="error" text={error} />
          <Button label="Reintentar" onClick={() => setSheetsData({})} />
        </div>
      );
    }

    if (!mode) {
      return (
        <div className="flex justify-center items-center gap-10 min-h-[calc(100vh-180px)]">
          <button
            type="button"
            onClick={() => setMode("visualize")}
            className="flex flex-col justify-center items-center gap-2 bg-white shadow-sm hover:shadow-lg border border-blue-400 rounded-lg w-[240px] h-[120px] text-blue-600 transition-all hover:-translate-y-0.5 duration-150"
          >
            <i className="text-[28px] pi pi-eye" />
            <span className="font-semibold tracking-wide">VISTA PREVIA</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={isLoading || Object.keys(sheetsData).length === 0}
            className="flex flex-col justify-center items-center gap-2 bg-white disabled:opacity-60 shadow-sm hover:shadow-lg disabled:hover:shadow-sm border border-blue-400 rounded-lg w-[240px] h-[120px] text-blue-600 transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0 duration-150"
          >
            <i className="text-[28px] pi pi-download" />
            <span className="font-semibold tracking-wide">DESCARGAR</span>
          </button>
        </div>
      );
    }

    if (mode === "visualize") {
      return (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setMode(null)}
            className="inline-flex items-center gap-2 mb-4 font-semibold text-blue-600 hover:text-blue-700"
          >
            <i className="pi-arrow-left text-base pi" />
            Volver
          </button>

          {Object.keys(sheetsData).length === 0 ? (
            <div className="place-items-center grid min-h-[calc(100vh-180px)]">
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
                  <div className="bg-white shadow-sm rounded-lg">
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
      header="Listado de productos"
      visible={visible}
      onHide={onHide}
      maximized
      className="[&_.p-dialog-content]:bg-[#f5f6f8] [&_.p-dialog-content]:p-10"
    >
      {dialogContent()}
    </Dialog>
  );
};

export default ReporteProductos;
