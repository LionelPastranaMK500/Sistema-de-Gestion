// src/modules/reportes/items/ReporteClientesProveedores.jsx
import { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";
import { Message } from "primereact/message";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import * as FileSaver from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";

import { handleReportes } from "@services/reportes/reportesLogic";
import { buildExcel } from "@services/reportes/excelBuilder";

const ReporteClientesProveedores = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [mode, setMode] = useState("filter");
    const [sheetsData, setSheetsData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filter, setFilter] = useState(null);

    const filterOptions = [
        { label: "", value: null },
        { label: "TODOS LOS TIPOS", value: "all" },
        { label: "NO DOMICILIADO, SIN RUC(EXPORTACIÓN)", value: "clientes" },
        { label: "DNI", value: "dni" },
        { label: "CARNET DE EXTRANJERÍA", value: "ce" },
        { label: "RUC", value: "ruc" },
        { label: "PASAPORTE", value: "pasaportes" },
    ];

    useEffect(() => {
        setVisible(true);
        setMode("filter");
        setSheetsData({});
        setError(null);
        setFilter(null);
    }, [location.pathname]);

    const generateReport = async () => {
        if (!filter) {
            setError("Debes seleccionar un tipo de reporte antes de continuar.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await handleReportes("cliente_proveedor_listado", { type: filter });
            if (data && Object.keys(data).length > 0) {
                setSheetsData(data);
                setMode("generated");
            } else {
                setError("No se encontraron datos para el reporte seleccionado.");
            }
        } catch (err) {
            setError("Error al generar el reporte. Intenta de nuevo.");
            console.error("Error en handleReportes:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const getTableData = (rows) => {
        if (!rows || rows.length < 3) return [];
        const headers = rows[2] || [];
        return rows.slice(3).map((row, rowIndex) =>
            row.reduce((acc, cell, index) => {
                acc[headers[index] || `col${index}`] = cell !== undefined ? cell : "-";
                return acc;
            }, { id: rowIndex })
        );
    };

    const handleExportExcel = async () => {
        if (Object.keys(sheetsData).length > 0) {
            try {
                const blob = await buildExcel(sheetsData, "reporte_clientes.xlsx");
                FileSaver.saveAs(blob);
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
        setFilter(null);
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
                            if (mode === "generated") setMode("generated");
                            else setMode("filter");
                        }}
                    />
                </div>
            );
        }

        if (mode === "filter") {
            return (
                <div className="p-5">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        {/* Header Filtros */}
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h3 className="text-slate-800 font-semibold text-lg">Filtros</h3>
                        </div>

                        {/* Body Filtros */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="w-full">
                                <label htmlFor="filter" className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Tipo
                                </label>
                                <Dropdown
                                    id="filter"
                                    value={filter}
                                    options={filterOptions}
                                    onChange={(e) => setFilter(e.value)}
                                    placeholder="Selecciona una opción"
                                    className="
                    w-full
                    [&_.p-dropdown-label]:py-3
                    [&_.p-dropdown-label]:px-4
                    [&_.p-dropdown-label]:text-slate-700
                    [&_.p-dropdown]:border-blue-500
                    [&_.p-dropdown]:rounded-lg
                    [&_.p-dropdown]:shadow-[0_0_0_1px_rgba(59,130,246,0.15)]
                    [&_.p-dropdown-trigger]:text-slate-500
                  "
                                    panelClassName="rounded-lg overflow-hidden"
                                />
                            </div>

                            <div className="pt-2">
                                <Button
                                    label="GENERAR REPORTE"
                                    icon="pi pi-refresh"
                                    onClick={generateReport}
                                    disabled={!filter || filter === null}
                                    className="
    bg-[#1e40af] hover:bg-[#1b3a9c] border-[#1e40af]
    px-5 py-3 rounded-md font-semibold tracking-wide
    text-white
    [&_.p-button-label]:text-white
    [&_.p-button-icon]:text-white
    disabled:opacity-60 disabled:hover:bg-[#1e40af]
  "
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
                        onClick={() => {
                            setMode("filter");
                            setFilter(null);
                        }}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
                    >
                        <i className="pi pi-arrow-left text-base" />
                        Volver a filtros
                    </button>

                    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center gap-10">
                        {/* VISTA PREVIA */}
                        <button
                            type="button"
                            onClick={() => setMode("visualize")}
                            disabled={Object.keys(sheetsData).length === 0}
                            className="
                w-[240px] h-[120px] bg-white border border-blue-400 rounded-lg shadow-sm
                hover:shadow-lg transition-all duration-150 hover:-translate-y-0.5
                flex flex-col items-center justify-center gap-2 text-blue-600
                disabled:opacity-60 disabled:hover:shadow-sm disabled:hover:translate-y-0
              "
                        >
                            <i className="pi pi-eye text-[28px]" />
                            <span className="font-semibold tracking-wide">VISTA PREVIA</span>
                        </button>

                        {/* DESCARGAR */}
                        <button
                            type="button"
                            onClick={handleExportExcel}
                            disabled={Object.keys(sheetsData).length === 0}
                            className="
                w-[240px] h-[120px] bg-white border border-blue-400 rounded-lg shadow-sm
                hover:shadow-lg transition-all duration-150 hover:-translate-y-0.5
                flex flex-col items-center justify-center gap-2 text-blue-600
                disabled:opacity-60 disabled:hover:shadow-sm disabled:hover:translate-y-0
              "
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
            key={location.pathname}
            header="Listado de clientes/proveedores"
            visible={visible}
            onHide={onHide}
            maximized
            className="[&_.p-dialog-content]:bg-[#f5f6f8] [&_.p-dialog-content]:p-6"
        >
            {dialogContent()}
        </Dialog>
    );
};

export default ReporteClientesProveedores;
