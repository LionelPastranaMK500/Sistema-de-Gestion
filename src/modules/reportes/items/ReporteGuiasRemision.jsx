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
import * as FileSaver from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";

import { getActiveCompany, getActiveUser } from "@services/auth/authServices";
import { handleReportes } from "@services/reportes/reportesLogic";
import { buildExcel } from "@services/reportes/excelBuilder";

const ReporteGuiasRemision = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [mode, setMode] = useState("filter");
    const [sheetsData, setSheetsData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filter, setFilter] = useState({
        sucursal: "all",
        usuario: "all",
        fechaInicio: null,
        fechaFin: null
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeCompany = getActiveCompany();
    const activeUser = getActiveUser();

    const sucursalOptions = [
        { label: "TODAS LAS SUCURSALES", value: "all" },
        ...(activeCompany?.sucursales?.length > 0
            ? activeCompany.sucursales.map(suc => ({ label: suc, value: suc }))
            : activeCompany?.sucursal
            ? [{ label: activeCompany.sucursal, value: activeCompany.sucursal }]
            : [])
    ];

    const usuarioOptions = [
        { label: "TODOS LOS USUARIOS", value: "all" },
        ...(activeUser?.nombres
            ? [{ label: `${activeUser.nombres} ${activeUser.apellidoPaterno || ''}`, value: activeUser.correo }]
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
            fechaFin: null
        });
    }, [location.pathname]);

    const generateReport = async () => {
        const { sucursal, usuario, fechaInicio, fechaFin } = filter;
        if (!sucursal || !usuario || !fechaInicio || !fechaFin) {
            setError("Complete los campos requeridos");
            return;
        }
        if (fechaFin < fechaInicio || fechaFin > today) {
            setError("La fecha fin no puede ser anterior a la fecha inicio ni superar el día de hoy");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await handleReportes("guia_remision", {
                sucursal,
                usuario,
                fechaInicio: fechaInicio.toISOString().split('T')[0],
                fechaFin: fechaFin.toISOString().split('T')[0]
            });
            if (data && Object.keys(data).length > 0) {
                setSheetsData(data);
                setMode("generated");
            } else {
                setError("No se encontraron datos para el reporte de guías de remisión seleccionado.");
            }
        } catch (err) {
            setError("Error al generar el reporte de guías de remisión. Intenta de nuevo.");
            console.error(err);
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
                const blob = await buildExcel(sheetsData, "reporte_guias_remision.xlsx");
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
        setFilter({
            sucursal: null,
            usuario: null,
            fechaInicio: null,
            fechaFin: null
        });
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
                    <Button label="Volver a intentar" icon="pi pi-refresh" onClick={() => setMode("filter")} />
                </div>
            );
        }

        if (mode === "filter") {
            return (
                <div >
                    <div>
                        <label>Sucursal</label>
                        <Dropdown
                            value={filter.sucursal}
                            options={sucursalOptions}
                            onChange={(e) => setFilter({ ...filter, sucursal: e.value })}
                            placeholder="Selecciona sucursal"
                        />
                    </div>
                    <div>
                        <label>Usuario</label>
                        <Dropdown
                            value={filter.usuario}
                            options={usuarioOptions}
                            onChange={(e) => setFilter({ ...filter, usuario: e.value })}
                            placeholder="Selecciona usuario"
                        />
                    </div>
                    <div>
                        <label>Fecha Inicio</label>
                        <Calendar
                            value={filter.fechaInicio}
                            onChange={(e) => setFilter({ ...filter, fechaInicio: e.value })}
                            placeholder="Fecha Inicio"
                            dateFormat="dd/mm/yy"
                            maxDate={today}
                        />
                    </div>
                    <div>
                        <label>Fecha Fin</label>
                        <Calendar
                            value={filter.fechaFin}
                            onChange={(e) => setFilter({ ...filter, fechaFin: e.value })}
                            placeholder="Fecha Fin"
                            dateFormat="dd/mm/yy"
                            maxDate={today}
                        />
                    </div>
                    <div>
                        <Button
                            label="Generar Reporte"
                            icon="pi pi-refresh"
                            onClick={generateReport}
                            disabled={!filter.sucursal || !filter.usuario || !filter.fechaInicio || !filter.fechaFin}
                        />
                    </div>
                </div>
            );
        }

        if (mode === "generated") {
            return (
                <div>
                    <Button label="Volver" icon="pi pi-arrow-left" onClick={() => setMode("filter")} />
                    <Button
                        label="Vista Previa"
                        icon="pi pi-eye"
                        onClick={() => setMode("visualize")}
                        disabled={Object.keys(sheetsData).length === 0}
                    />
                    <Button
                        label="Descargar"
                        icon="pi pi-download"
                        onClick={handleExportExcel}
                        disabled={Object.keys(sheetsData).length === 0}
                    />
                </div>
            );
        }

        if (mode === "visualize") {
            return (
                <div>
                    <Button label="Volver" icon="pi pi-arrow-left" onClick={() => setMode("generated")} />
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
            header="Reporte de Guías de Remisión"
            visible={visible}
            onHide={onHide}
            maximized
            className="bg-white"
        >
            {dialogContent()}
        </Dialog>
    );
};

export default ReporteGuiasRemision;