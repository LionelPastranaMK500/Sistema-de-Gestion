import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { MoreVertIcon } from "@constants/iconsConstants";
import { DataView } from "primereact/dataview";
import { clientes } from "@services/generadorData";

export default function ClientesView() {
    const [search, setSearch] = useState("");
    const [filteredClientes, setFilteredClientes] = useState([]);

    useEffect(() => {
        setFilteredClientes(clientes);
    }, []);

    // PrimeReact: trabaja con completeMethod(e.query)
    const searchClientes = (e) => {
        const query = (e.query ?? "").toLowerCase();
        setSearch(query);
        const results = clientes.filter(
            (c) =>
                (c.razonSocial || "").toLowerCase().includes(query) ||
                (c.documento || "").toLowerCase().includes(query)
        );
        setFilteredClientes(results);
    };

    const clienteCard = (c, i) => (
        <div
            key={`${c.documento || c.razonSocial}-${i}`}
            className="rounded-md border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm transition hover:shadow-md"
        >
            <div className="flex items-center gap-4">
                <Avatar
                    label={(c.razonSocial || "-").charAt(0)}
                    size="large"
                    shape="circle"
                    className="!bg-gray-100 !text-gray-600"
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800">
                        {c.razonSocial || "-"}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                        <span className="rounded-full bg-blue-100 px-2 py-[2px] text-[11px] font-semibold text-blue-700">
                            RUC
                        </span>
                        <small className="text-gray-500">{c.documento}</small>
                    </div>
                </div>
                <Button
                    className="!h-9 !w-9 !rounded-full !border-0 !bg-transparent hover:!bg-gray-100"
                    text
                    aria-label="Más acciones"
                    icon={<MoreVertIcon className="text-gray-500" />}
                />
            </div>
        </div>
    );

    const listTemplate = (items) => {
        if (!items || items.length === 0) {
            return (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white text-sm text-gray-500">
                    No hay Clientes o Proveedores
                </div>
            );
        }
        return <div className="space-y-3">{items.map((c, i) => clienteCard(c, i))}</div>;
    };

    return (
        <div className="flex h-screen w-full flex-col rounded-lg bg-white p-6 shadow-md overflow-hidden">
            {/* HEADER (mismo patrón que Ventas) */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="ml-5 text-xl font-bold text-gray-800">
                    Clientes / Proveedores
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        label="REGISTRAR NUEVO"
                        className="!rounded-md !bg-indigo-600 !px-4 !py-2 !text-sm !font-semibold hover:!bg-indigo-700"
                    />
                    <Button
                        className="!h-10 !w-10 !rounded-full !border !border-gray-300 !bg-white hover:!bg-gray-50"
                        icon={<MoreVertIcon className="text-gray-600" />}
                        aria-label="Opciones"
                    />
                </div>
            </div>

            {/* CONTENEDOR SCROLLABLE */}
            <div className="flex-1 min-h-0 flex flex-col">
                {/* Fila: buscador + chevrons a la misma altura */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="relative w-full max-w-xl">
                        <i className="pi pi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <AutoComplete
                            value={search}
                            completeMethod={searchClientes}
                            suggestions={[]}
                            dropdown={false}
                            placeholder="Buscar..."
                            className="w-full"
                            emptyMessage="No se encontraron Clientes o Proveedores"
                            inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => {
                                const val = e.value || "";
                                setSearch(val);
                                searchClientes({ query: val });
                            }}
                        />
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                        <button
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
                            aria-label="Anterior"
                            title="Anterior"
                        >
                            &lt;
                        </button>
                        <button
                            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
                            aria-label="Siguiente"
                            title="Siguiente"
                        >
                            &gt;
                        </button>
                    </div>
                </div>

                {/* Lista con scroll interno que afecta las cards */}
                <div className="flex-1 min-h-0 overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-4">
                    <DataView value={filteredClientes} listTemplate={listTemplate} layout="list" />
                </div>
            </div>
        </div>
    );
}
