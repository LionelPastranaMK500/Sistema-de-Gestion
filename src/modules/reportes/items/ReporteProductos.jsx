// src/modules/reportes/items/ReporteProductos.jsx
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import * as FileSaver from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";

import { handleReportes } from "@services/reportes/reportesLogic";
import { buildExcel } from "@services/reportes/excelBuilder";

const ReporteProductos = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [visible, setVisible] = useState(true);
    const [mode, setMode] = useState(null); // null | "visualize"
    const [sheetsData, setSheetsData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Si cambian de ruta (entran otra vez a este reporte) limpiamos y reabrimos
    useEffect(() => {
        setVisible(true);
        setSheetsData({});
        setError(null);
        setMode(null);
    }, [location.pathname]);

    // Carga de datos (solo si está visible y AÚN no tenemos datos)
    useEffect(() => {
        if (!visible) return;
        if (Object.keys(sheetsData).length > 0) return; // evita recargas innecesarias

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

    const getTableData = (rows) => {
        if (!rows || rows.length < 3) return [];
        const headers = rows[2] || [];
        return rows.slice(3).map((row, rowIndex) =>
            row.reduce((acc, cell, index) => {
                acc[headers[index] || `col${index}`] = cell ?? "-";
                return acc;
            }, { id: rowIndex })
        );
    };

    const handleExportExcel = async () => {
        if (isLoading || Object.keys(sheetsData).length === 0) return;
        try {
            const blob = await buildExcel(sheetsData, "reporte_Listadoproductos.xlsx");
            FileSaver.saveAs(blob);
        } catch (err) {
            console.error("Error al exportar Excel:", err);
        }
    };

    const onHide = () => {
        // Al cerrar el diálogo sí limpiamos todo y volvemos a /reportes
        setVisible(false);
        setMode(null);
        setSheetsData({});
        setError(null);
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
                    <Button label="Reintentar" onClick={() => setSheetsData({})} />
                </div>
            );
        }

        // Pantalla inicial (tarjetas)
        if (!mode) {
            return (
                <div className="min-h-[calc(100vh-180px)] flex items-center justify-center gap-10">
                    {/* VISTA PREVIA */}
                    <button
                        type="button"
                        onClick={() => setMode("visualize")}
                        className="w-[240px] h-[120px] bg-white border border-blue-400 rounded-lg shadow-sm hover:shadow-lg transition-all duration-150 hover:-translate-y-0.5 flex flex-col items-center justify-center gap-2 text-blue-600"
                    >
                        <i className="pi pi-eye text-[28px]" />
                        <span className="font-semibold tracking-wide">VISTA PREVIA</span>
                    </button>

                    {/* DESCARGAR */}
                    <button
                        type="button"
                        onClick={handleExportExcel}
                        disabled={isLoading || Object.keys(sheetsData).length === 0}
                        className="w-[240px] h-[120px] bg-white border border-blue-400 rounded-lg shadow-sm hover:shadow-lg transition-all duration-150 hover:-translate-y-0.5 flex flex-col items-center justify-center gap-2 text-blue-600 disabled:opacity-60 disabled:hover:shadow-sm disabled:hover:translate-y-0"
                    >
                        <i className="pi pi-download text-[28px]" />
                        <span className="font-semibold tracking-wide">DESCARGAR</span>
                    </button>
                </div>
            );
        }

        // Modo visualización
        if (mode === "visualize") {
            return (
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setMode(null)} // 👈 ya NO borramos sheetsData
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
                    >
                        <i className="pi pi-arrow-left text-base" />
                        Volver
                    </button>

                    {Object.keys(sheetsData).length === 0 ? (
                        <div className="min-h-[calc(100vh-180px)] grid place-items-center">
                            <Message severity="info" text="No hay datos disponibles para mostrar." />
                        </div>
                    ) : (
                        <TabView
                            activeIndex={activeIndex}
                            onTabChange={(e) => setActiveIndex(e.index)}
                            className="[&_.p-tabview-nav]:bg-transparent [&_.p-tabview-nav]:border-0"
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
                                            className="
                        [&_.p-datatable-thead>tr>th]:bg-[#1857C3]
                        [&_.p-datatable-thead>tr>th]:text-white
                        [&_.p-datatable-thead>tr>th]:font-bold
                        [&_.p-datatable-thead>tr>th]:text-[15px]
                        [&_.p-datatable-thead>tr>th]:py-3
                        [&_.p-sortable-column-icon]:text-white
                        [&_.p-sortable-column]:text-white
                        [&_.p-datatable-tbody>tr>td]:border-b
                        [&_.p-datatable-tbody>tr>td]:border-slate-200
                        [&_.p-datatable-tbody>tr:hover]:bg-slate-50
                        [&_.p-paginator]:rounded-b-lg [&_.p-paginator]:border-0 [&_.p-paginator]:bg-white
                      "
                                        >
                                            {(sheetsData[tipo][2] || []).map((header, colIndex) => (
                                                <Column
                                                    key={colIndex}
                                                    field={header || `col${colIndex}`}
                                                    header={header || `Columna ${colIndex + 1}`}
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
