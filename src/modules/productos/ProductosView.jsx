import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { MoreVertIcon } from '@constants/iconsConstants';
import { productos } from '@services/generadorData';

export default function ProductosView() {
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [search, setSearch] = useState('');

    const defaultImage =
        'data:image/jpeg;base64,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'; // (tu base64 intacto)

    useEffect(() => {
        setFilteredProductos(productos);
    }, []);

    const onSearchChange = (e) => {
        const query = e.value || '';
        setSearch(query);
        const filtered = productos.filter((p) =>
            (p.descripcion || '').toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProductos(filtered);
    };

    const itemTemplate = (p, i) => {
        if (!p) return null;
        return (
            <div
                key={`${p.codigo}-${i}`}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition hover:shadow-md"
            >
                {/* fila principal (altura contenida) */}
                <div className="flex min-h-[65px] items-center gap-4">
                    {/* imagen (un poco más grande) */}
                    <img
                        src={defaultImage}
                        alt={p.descripcion}
                        className="h-14 w-14 rounded-md object-cover ring-1 ring-gray-200"
                    />

                    {/* info centro */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-gray-800">
                            {p.descripcion}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-1 text-[10.5px] text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                                {(p.codigo ?? '').toString().padStart(3, '0')}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                                {p.categoria ? p.categoria : 'SIN CATEGORÍA'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                                SIN CÓDIGO DE BARRAS
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-400" />
                                UNIDADES: {p.unidad}
                            </span>
                        </div>
                    </div>

                    {/* acciones derecha: precio + stock (columna) y more aparte */}
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1">
                            <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-extrabold text-emerald-600">
                                S/ {Number(p.precio ?? 0).toFixed(2)}
                            </span>
                            <Button
                                label="VER STOCK"
                                className="!rounded-md !bg-blue-600 !px-2.5 !py-1.5 !text-[11px] !font-semibold !text-white hover:!bg-blue-700"
                            />
                        </div>

                        <Button
                            className="shrink-0 !h-8 !w-8 !rounded-full !border-0 !bg-transparent hover:!bg-gray-100"
                            text
                            aria-label="Más"
                            icon={<MoreVertIcon className="text-gray-500" />}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) {
            return (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-gray-500">
                    No hay productos
                </div>
            );
        }
        return <div className="space-y-3">{items.map(itemTemplate)}</div>;
    };

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden rounded-lg bg-white p-6 shadow-md">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="ml-5 text-xl font-bold text-gray-800">Productos / Servicios</h2>
                <div className="flex items-center gap-2">
                    <Button
                        label="REGISTRAR NUEVO"
                        className="!rounded-lg !bg-indigo-600 !px-4 !py-2 !text-sm !font-semibold hover:!bg-indigo-700"
                    />
                    <Button
                        className="!h-10 !w-10 !rounded-full !border !border-gray-300 !bg-white hover:!bg-gray-50"
                        icon={<MoreVertIcon className="text-gray-600" />}
                        aria-label="Opciones"
                    />
                </div>
            </div>

            {/* Contenido scrollable */}
            <div className="flex min-h-0 flex-1 flex-col">
                {/* Buscador + chevrons */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="relative w-full max-w-xl">
                        <i className="pi pi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <AutoComplete
                            value={search}
                            onChange={onSearchChange}
                            suggestions={[]}
                            dropdown={false}
                            placeholder="Buscar..."
                            emptyMessage="No se encontraron productos"
                            className="w-full"
                            inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 pl-9 text-sm focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
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

                {/* Lista con scroll */}
                <div className="min-h-0 flex-1 overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-4">
                    <DataView value={filteredProductos} listTemplate={listTemplate} layout="list" />
                </div>
            </div>
        </div>
    );
}
