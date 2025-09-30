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
                const blob = await buildExcel(sheetsData,"reporte_clientes.xlsx");
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
                <div>
                    <ProgressSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div>
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
                <div>
                    <div >
                        <label htmlFor="filter">
                            Tipo:
                        </label>
                        <Dropdown
                            id="filter"
                            value={filter}
                            options={filterOptions}
                            onChange={(e) => setFilter(e.value)}
                            placeholder="Selecciona una opción"
                        />
                    </div>
                    <Button
                        label="Generar reporte"
                        icon="pi pi-refresh"
                        onClick={generateReport}
                        disabled={!filter || filter === null}
                        className="mt-4"
                    />
                </div>
            );
        }

        if (mode === "generated") {
            return (
                <div className="p-4">
                    <Button
                            label="Volver a filtros"
                            icon="pi pi-arrow-left"
                            onClick={() => {
                                setMode("filter");
                                setFilter(null);
                            }}
                            className="mt-4"
                        />
                    <div>
                        <Button
                            icon="pi pi-eye"
                            label="VISTA PREVIA"
                            onClick={() => setMode("visualize")}
                            disabled={Object.keys(sheetsData).length === 0}
                        />
                        <Button
                            icon="pi pi-download"
                            label="DESCARGAR"
                            onClick={handleExportExcel}
                            disabled={Object.keys(sheetsData).length === 0}
                        />
                    </div>
                </div>
            );
        }

        if (mode === "visualize") {
            return (
                <div>
                    <div>
                        <Button
                            label="Volver"
                            onClick={() => { setMode("generated"); }}
                        />
                    </div>
                    {Object.keys(sheetsData).length === 0 ? (
                        <Message severity="info" text="No hay datos disponibles para mostrar." />
                    ) : (
                        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                            {Object.keys(sheetsData).map((tipo, index) => (
                                <TabPanel header={tipo} key={index}>
                                    <DataTable
                                        value={getTableData(sheetsData[tipo])}
                                        paginator
                                        rows={10}
                                        scrollable
                                        emptyMessage="No hay datos para mostrar."
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
        >
            {dialogContent()}
        </Dialog>
    );
};

export default ReporteClientesProveedores;