// src/modules/reportes/items/ReporteVentasGeneral.jsx
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
        ...getMonthRange(),
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
        { label: "PROFORMAS", value: "proformas" },
    ];

    const monedaOptions = [
        { label: "TODAS LAS MONEDAS", value: "all" },
        { label: "PEN", value: "PEN" },
    ];

    const sucursalOptions = useMemo(
        () => [
            { label: "TODAS LAS SUCURSALES", value: "all" },
            ...(initialCompany?.sucursales?.length > 0
                ? initialCompany.sucursales.map((suc) => ({ label: suc, value: suc }))
                : initialCompany?.sucursal
                    ? [{ label: initialCompany.sucursal, value: initialCompany.sucursal }]
                    : [{ label: "Lubricantes Claudia", value: "Lubricantes Claudia" }]),
        ],
        [initialCompany]
    );

    const usuarioOptions = useMemo(
        () => [
            { label: "TODOS LOS USUARIOS", value: "all" },
            ...(initialUser?.nombres
                ? [
                    {
                        label: `${initialUser.nombres} ${initialUser.apellidoPaterno || ""}`,
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
                label: cliente.nombre || cliente.razonSocial || cliente.toString(),
                value: cliente.nombre || cliente.razonSocial || cliente.toString(),
            })),
        ],
        [clientes]
    );

    useEffect(() => {
        setSheetsData({});
        setError(null);
        setFilter((prev) => ({
            ...prev,
            sucursal: prev.sucursal ?? (initialCompany?.sucursal || "Lubricantes Claudia"),
            usuario: prev.usuario ?? (initialUser?.correo || "juan@example.com"),
        }));
    }, [location.pathname]);

    const generateReport = async () => {
        const { tipo, moneda, sucursal, usuario, cliente, fechaInicio, fechaFin } = filter;
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
                fechaInicio: fechaInicio.toISOString().split("T")[0],
                fechaFin: fechaFin.toISOString().split("T")[0],
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
            ...getMonthRange(),
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
                        {/* Header Filtros */}
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h3 className="text-slate-800 font-semibold text-lg">Filtros</h3>
                        </div>

                        {/* Body Filtros */}
                        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Tipo */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Tipo de comprobante
                                </label>
                                <Dropdown
                                    value={filter.tipo}
                                    options={tipoOptions}
                                    onChange={(e) => setFilter({ ...filter, tipo: e.value })}
                                    placeholder="Selecciona tipo"
                                    className="
                    w-full
                    [&_.p-dropdown]:rounded-lg
                    [&_.p-dropdown]:border-blue-500
                    [&_.p-dropdown-label]:py-3 [&_.p-dropdown-label]:px-4
                    [&_.p-dropdown-label]:text-slate-700
                    [&_.p-dropdown-trigger]:text-slate-500
                  "
                                    panelClassName="rounded-lg overflow-hidden"
                                />
                            </div>

                            {/* Moneda */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Moneda
                                </label>
                                <Dropdown
                                    value={filter.moneda}
                                    options={monedaOptions}
                                    onChange={(e) => setFilter({ ...filter, moneda: e.value })}
                                    placeholder="Selecciona moneda"
                                    className="
                    w-full
                    [&_.p-dropdown]:rounded-lg
                    [&_.p-dropdown]:border-blue-500
                    [&_.p-dropdown-label]:py-3 [&_.p-dropdown-label]:px-4
                    [&_.p-dropdown-label]:text-slate-700
                    [&_.p-dropdown-trigger]:text-slate-500
                  "
                                    panelClassName="rounded-lg overflow-hidden"
                                />
                            </div>

                            {/* Sucursal */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Sucursal
                                </label>
                                <Dropdown
                                    value={filter.sucursal}
                                    options={sucursalOptions}
                                    onChange={(e) => setFilter({ ...filter, sucursal: e.value })}
                                    placeholder="Selecciona sucursal"
                                    className="
                    w-full
                    [&_.p-dropdown]:rounded-lg
                    [&_.p-dropdown]:border-blue-500
                    [&_.p-dropdown-label]:py-3 [&_.p-dropdown-label]:px-4
                    [&_.p-dropdown-label]:text-slate-700
                    [&_.p-dropdown-trigger]:text-slate-500
                  "
                                    panelClassName="rounded-lg overflow-hidden"
                                />
                            </div>

                            {/* Usuario */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Usuario
                                </label>
                                <Dropdown
                                    value={filter.usuario}
                                    options={usuarioOptions}
                                    onChange={(e) => setFilter({ ...filter, usuario: e.value })}
                                    placeholder="Selecciona usuario"
                                    className="
                    w-full
                    [&_.p-dropdown]:rounded-lg
                    [&_.p-dropdown]:border-blue-500
                    [&_.p-dropdown-label]:py-3 [&_.p-dropdown-label]:px-4
                    [&_.p-dropdown-label]:text-slate-700
                    [&_.p-dropdown-trigger]:text-slate-500
                  "
                                    panelClassName="rounded-lg overflow-hidden"
                                />
                            </div>

                            {/* Cliente - toda la fila */}
                            <div className="md:col-span-2">
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Cliente
                                </label>
                                <Dropdown
                                    value={filter.cliente}
                                    options={clienteOptions}
                                    onChange={(e) => setFilter({ ...filter, cliente: e.value })}
                                    placeholder="Selecciona cliente"
                                    filter
                                    showClear
                                    className="
                    w-full
                    [&_.p-dropdown]:rounded-lg
                    [&_.p-dropdown]:border-blue-500
                    [&_.p-dropdown-label]:py-3 [&_.p-dropdown-label]:px-4
                    [&_.p-dropdown-label]:text-slate-700
                    [&_.p-dropdown-trigger]:text-slate-500
                  "
                                    panelClassName="rounded-lg overflow-hidden max-h-[320px]"
                                />
                            </div>

                            {/* Fechas */}
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Fecha inicio
                                </label>
                                <Calendar
                                    value={filter.fechaInicio}
                                    onChange={(e) => setFilter({ ...filter, fechaInicio: e.value })}
                                    placeholder="Fecha inicio"
                                    dateFormat="dd/mm/yy"
                                    maxDate={today}
                                    showIcon
                                    className="
                    w-full
                    [&_.p-inputtext]:py-3 [&_.p-inputtext]:px-4
                    [&_.p-inputtext]:text-slate-700
                    [&_.p-inputtext]:rounded-lg
                    [&_.p-inputtext]:border-blue-500
                  "
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                                    Fecha fin
                                </label>
                                <Calendar
                                    value={filter.fechaFin}
                                    onChange={(e) => setFilter({ ...filter, fechaFin: e.value })}
                                    placeholder="Fecha fin"
                                    dateFormat="dd/mm/yy"
                                    maxDate={today}
                                    showIcon
                                    className="
                    w-full
                    [&_.p-inputtext]:py-3 [&_.p-inputtext]:px-4
                    [&_.p-inputtext]:text-slate-700
                    [&_.p-inputtext]:rounded-lg
                    [&_.p-inputtext]:border-blue-500
                  "
                                />
                            </div>

                            {/* Botón */}
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
                                    className="
                    bg-[#1e40af] hover:bg-[#1b3a9c] border-[#1e40af]
                    px-5 py-3 rounded-md font-semibold tracking-wide
                    text-white
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
                        onClick={() => setMode("filter")}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
                    >
                        <i className="pi pi-arrow-left text-base" />
                        Volver a filtros
                    </button>

                    <div className="min-h-[calc(100vh-220px)] flex items-center justify-center gap-10">
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
