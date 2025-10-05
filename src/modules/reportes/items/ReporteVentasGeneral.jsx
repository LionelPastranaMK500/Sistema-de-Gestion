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
import * as FileSaver from "file-saver";
import { useLocation, useNavigate } from "react-router-dom";

import { getActiveCompany, getActiveUser } from "@services/auth/authServices";
import { handleReportes } from "@services/reportes/reportesLogic";
import { getClientes } from "@services/generadorData";
import { buildExcel } from "@services/reportes/excelBuilder";

const ReporteVentasGeneral = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [mode, setMode] = useState("filter");
    const [sheetsData, setSheetsData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const getMonthRange = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start, end };
    };

    const [filter, setFilter] = useState({
        tipo: "all",
        moneda: "all",
        sucursal: "all",
        usuario: "all",
        cliente: "all",
        ...getMonthRange()
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const clientes = useMemo(() => getClientes(), []);
    const initialCompany = getActiveCompany();
    const initialUser = getActiveUser();

    const tipoOptions = [
        { label: "TODOS LOS COMPROBANTES", value: "all" },
        { label: "FACTURAS ELECTRÓNICAS", value: "facturas_electronicas" },
        { label: "BOLETAS DE VENTA ELECTRÓNICAS", value: "boletas_venta_electronicas" },
        { label: "NOTAS DE CRÉDITO ELECTRÓNICAS", value: "notas_credito_electronicas" },
        { label: "NOTAS DE DÉBITO ELECTRÓNICAS", value: "notas_debito_electronicas" },
        { label: "NOTAS DE VENTA", value: "notas_venta" },
        { label: "PROFORMAS", value: "proformas" }
    ];

    const monedaOptions = [
        { label: "TODAS LAS MONEDAS", value: "all" },
        { label: "PEN", value: "PEN" }
    ];

    const sucursalOptions = useMemo(() => [
        { label: "TODAS LAS SUCURSALES", value: "all" },
        ...(initialCompany?.sucursales?.length > 0
            ? initialCompany.sucursales.map(suc => ({ label: suc, value: suc }))
            : initialCompany?.sucursal
                ? [{ label: initialCompany.sucursal, value: initialCompany.sucursal }]
                : [{ label: "Lubricantes Claudia", value: "Lubricantes Claudia" }])
    ], [initialCompany]);

    const usuarioOptions = useMemo(() => [
        { label: "TODOS LOS USUARIOS", value: "all" },
        ...(initialUser?.nombres
            ? [{ label: `${initialUser.nombres} ${initialUser.apellidoPaterno || ''}`, value: initialUser.correo }]
            : [{ label: "Juan Santos", value: "juan@example.com" }])
    ], [initialUser]);

    const clienteOptions = useMemo(() => [
        { label: "TODOS LOS CLIENTES", value: "all" },
        ...clientes.map(cliente => ({
            label: cliente.nombre || cliente.razonSocial || cliente.toString(),
            value: cliente.nombre || cliente.razonSocial || cliente.toString()
        })),
    ], [clientes]);

    useEffect(() => {
        setSheetsData({});
        setError(null);
        setFilter((prev) => ({
            ...prev,
            sucursal: prev.sucursal ?? (initialCompany?.sucursal || "Lubricantes Claudia"),
            usuario: prev.usuario ?? (initialUser?.correo || "juan@example.com"),
        }));
        console.log("Filter actualizado:", filter); // Depuración
    }, [location.pathname]);

    const generateReport = async () => {
        const { tipo, moneda, sucursal, usuario, cliente, fechaInicio, fechaFin } = filter;
        console.log("Filtros enviados a handleReportes:", { tipo, moneda, sucursal, usuario, cliente, fechaInicio, fechaFin }); // Depuración
        if (!tipo || !moneda || !sucursal || !usuario || !cliente || !fechaInicio || !fechaFin) {
            setError("Debes completar todos los campos antes de continuar.");
            return;
        }
        if (fechaFin < fechaInicio || fechaFin > today) {
            setError("La fecha fin no puede ser anterior a la fecha inicio ni superar el día de hoy.");
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
                fechaInicio: fechaInicio.toISOString().split('T')[0],
                fechaFin: fechaFin.toISOString().split('T')[0]
            });
            if (data && Object.keys(data).length > 0) {
                setSheetsData(data);
                setMode("generated");
            } else {
                setError("No se encontraron datos para el reporte de ventas seleccionado.");
            }
        } catch (err) {
            setError(err.message || "Error al generar el reporte de ventas. Intenta de nuevo.");
            console.error("Error en handleReportes:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const getTableData = (rows) => {
        if (!rows || rows.length < 3) return [];
        const headers = rows[2] || [];
        return rows.slice(3, -1).map((row, rowIndex) =>
            row.reduce((acc, cell, index) => {
                acc[headers[index] || `col${index}`] = cell !== undefined ? cell : "-";
                return acc;
            }, { id: rowIndex })
        );
    };

    const handleExportExcel = async () => {
        if (Object.keys(sheetsData).length > 0) {
            try {
                const blob = await buildExcel(sheetsData, "reporte_ventas.xlsx");
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
            tipo: "all",
            moneda: "all",
            sucursal: "all",
            usuario: "all",
            cliente: "all",
            ...getMonthRange()
        });
        navigate("/reportes");
    };

    const dialogContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center">
                    <ProgressSpinner />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col gap-2">
                    <Message severity="error" text={error} />
                    <Button
                        label="Volver a intentar"
                        icon="pi pi-refresh"
                        onClick={() => {
                            setError(null);
                            setMode("filter");
                        }}
                    />
                </div>
            );
        }

        if (mode === "filter") {
            return (
                <div>
                    <div>
                        <label>Tipo</label>
                        <Dropdown
                            value={filter.tipo}
                            options={tipoOptions}
                            onChange={(e) => setFilter({ ...filter, tipo: e.value })}
                            placeholder="Selecciona tipo"
                        />
                    </div>
                    <div>
                        <label>Moneda</label>
                        <Dropdown
                            value={filter.moneda}
                            options={monedaOptions}
                            onChange={(e) => setFilter({ ...filter, moneda: e.value })}
                            placeholder="Selecciona moneda"
                        />
                    </div>
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
                        <label>Cliente</label>
                        <Dropdown
                            value={filter.cliente}
                            options={clienteOptions}
                            onChange={(e) => setFilter({ ...filter, cliente: e.value })}
                            placeholder="Selecciona cliente"
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
                            hourFormat="24"
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
                            hourFormat="24"
                        />
                    </div>
                    <div className="flex justify-end col-span-2">
                        <Button
                            label="Generar Reporte"
                            icon="pi pi-refresh"
                            onClick={generateReport}
                            disabled={!filter.tipo || !filter.moneda || !filter.sucursal || !filter.usuario || !filter.cliente || !filter.fechaInicio || !filter.fechaFin}
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
                <div className="p-4">
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
            header="Reporte de Ventas General"
            visible={visible}
            onHide={onHide}
            maximized
            className="bg-white"
        >
            {dialogContent()}
        </Dialog>
    );
};

export default ReporteVentasGeneral;