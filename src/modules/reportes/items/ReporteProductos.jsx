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
    const [mode, setMode] = useState(null);
    const [sheetsData, setSheetsData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    
    useEffect(() => {
        setVisible(true);
        setSheetsData({});
        setError(null);
    }, [location.pathname]);

    useEffect(() => {
        if (visible) {
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
                    setError("Error al cargar los datos del reporte.");
                    console.error("Error en handleReportes:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            loadData();
        }
    }, [visible]);

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
                const blob = await buildExcel(sheetsData,"reporte_Listadoproductos.xlsx");
                FileSaver.saveAs(blob);
            } catch (err) {
                console.error("Error al exportar Excel:", err);
            }
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
                <div>
                    <ProgressSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div>
                    <Message severity="error" text={error} />
                    <Button label="Reintentar" onClick={() => setMode(null)} />
                </div>
            );
        }

        if (!mode) {
            return (
                <div>
                    <div>
                        <Button
                            icon="pi pi-eye"
                            label="VISTA PREVIA"
                            onClick={() => setMode("visualize")}
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
                            onClick={() => {
                                setMode(null);
                                setSheetsData({});
                            }}
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
            header="Listado de productos"
            visible={visible}
            onHide={onHide}
            maximized
        >
            {dialogContent()}
        </Dialog>
    );
};

export default ReporteProductos;