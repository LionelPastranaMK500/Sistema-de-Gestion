import React, { useState, useEffect } from 'react';
import { DataView } from 'primereact/dataview';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { productos } from '@services/generadorData';
import {
  MoreVertIcon,
  SearchIcon,
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
} from '@constants/iconsConstants';

export default function ProductosView() {
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [search, setSearch] = useState('');

  const defaultImage =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'; // tu base64 intacto

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
        {/* Buscador + chevrons (MISMO ESTILO) */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-xl">
             <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 !h-5 !w-5 text-gray-400" />
            <AutoComplete
              value={search}
              onChange={onSearchChange}
              suggestions={[]}
              dropdown={false}
              placeholder="Buscar..."
              emptyMessage="No se encontraron productos"
              className="w-full"
              // altura aumentada + espacio para la lupa
              inputClassName="w-full rounded-md border border-gray-300 px-3 py-4 pl-10 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
              aria-label="Anterior"
              title="Anterior"
            >
              <KeyboardArrowLeftIcon />
            </button>
            <button
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-600 hover:bg-gray-50"
              aria-label="Siguiente"
              title="Siguiente"
            >
              <KeyboardArrowRightIcon />
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
