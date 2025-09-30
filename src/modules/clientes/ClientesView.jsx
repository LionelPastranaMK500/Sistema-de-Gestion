import React, { useEffect, useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { clientes } from "@services/generadorData";
import {
    MoreVertIcon,
    SearchIcon,
    KeyboardArrowLeftIcon,
    KeyboardArrowRightIcon,
} from "@constants/iconsConstants";
import ClienteNuevo from "./ClienteNuevo";

const ClientesView = () => {
    const [search, setSearch] = useState("");
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [mostrarNuevo, setMostrarNuevo] = useState(false);

    useEffect(() => {
        setFilteredClientes(clientes);
    }, []);

    // búsqueda
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
            className="bg-white shadow-sm hover:shadow-md px-4 py-4 border border-gray-300 rounded-md text-sm transition"
        >
            <div className="flex items-center gap-4">
                <Avatar
                    label={(c.razonSocial || "-").charAt(0)}
                    size="large"
                    shape="circle"
                    className="!bg-gray-100 !text-gray-600"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                        {c.razonSocial || "-"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="bg-blue-100 px-2 py-[2px] rounded-full font-semibold text-[11px] text-blue-700">
                            RUC
                        </span>
                        <small className="text-gray-500">{c.documento}</small>
                    </div>
                </div>
                <Button
                    className="!bg-transparent hover:!bg-gray-100 !border-0 !rounded-full !w-9 !h-9"
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
                <div className="flex justify-center items-center bg-white border border-gray-300 border-dashed rounded-md h-40 text-gray-500 text-sm">
                    No hay Clientes o Proveedores
                </div>
            );
        }
        return <div className="space-y-3">{items.map((c, i) => clienteCard(c, i))}</div>;
    };

    return (
        <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-screen overflow-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="ml-5 font-bold text-gray-800 text-xl">
                    Clientes / Proveedores
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        label="REGISTRAR NUEVO"
                        className="!bg-indigo-600 hover:!bg-indigo-700 !px-4 !py-2 !rounded-md !font-semibold !text-sm"
                        onClick={() => setMostrarNuevo(true)}
                    />
                    <Button
                        className="!bg-white hover:!bg-gray-50 !border !border-gray-300 !rounded-full !w-10 !h-10"
                        icon={<MoreVertIcon className="text-gray-600" />}
                        aria-label="Opciones"
                    />
                </div>
            </div>

            {/* CONTENEDOR SCROLLABLE */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Fila buscador + chevrons */}
                <div className="flex justify-between items-center gap-3 mb-4">
                    {/* contenedor relativo para posicionar el icono */}
                    <div className="relative w-full max-w-xl">
                        {/* Ícono de lupa (de tu set) */}
                        <SearchIcon className="top-1/2 left-3 z-10 absolute !w-5 !h-5 text-gray-400 -translate-y-1/2 pointer-events-none" />

                        <AutoComplete
                            value={search}
                            completeMethod={searchClientes}
                            suggestions={[]}
                            dropdown={false}
                            placeholder="Buscar..."
                            className="w-full"
                            emptyMessage="No se encontraron Clientes o Proveedores"
                            inputClassName="w-full rounded-md border border-gray-300 px-3 py-4 pl-10 text-sm focus:ring-2 focus:ring-blue-400"
                            onChange={(e) => {
                                const val = e.value || "";
                                setSearch(val);
                                searchClientes({ query: val });
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            className="bg-white hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-gray-600"
                            aria-label="Anterior"
                            title="Anterior"
                        >
                            <KeyboardArrowLeftIcon />
                        </button>
                        <button
                            className="bg-white hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-gray-600"
                            aria-label="Siguiente"
                            title="Siguiente"
                        >
                            <KeyboardArrowRightIcon />
                        </button>
                    </div>
                </div>

                {/* Lista con scroll interno */}
                <div className="flex-1 bg-gray-50 p-4 border border-gray-300 rounded-md min-h-0 overflow-y-auto">
                    <DataView value={filteredClientes} listTemplate={listTemplate} layout="list" />
                </div>
            </div>

            {mostrarNuevo && (
                <div>
                    <ClienteNuevo onClose={() => setMostrarNuevo(false)} />
                </div>
            )}
        </div>
    );
}
export default ClientesView;
