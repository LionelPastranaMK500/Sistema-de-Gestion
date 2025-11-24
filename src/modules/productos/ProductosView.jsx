import { useState } from 'react';
import { DataView } from 'primereact/dataview';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import { productos } from '@services/generadorData';
import {
  MoreVertIcon,
  SearchIcon,
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
} from '@constants/icons';
import { useSearch, usePagination } from '@hooks/data';

const ProductosView = () => {
  const { searchQuery, filteredItems, handleSearch } = useSearch(
    productos,
    ['descripcion', 'codigo']
  );

  const { paginatedItems, currentPage, totalPages, nextPage, prevPage, hasNext, hasPrev } = usePagination(
    filteredItems,
    20
  );

  const defaultImage =
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';

  const itemTemplate = (p, i) => {
    if (!p) return null;
    return (
      <div
        key={`${p.codigo}-${i}`}
        className="bg-white shadow-sm hover:shadow-md px-4 py-2.5 border border-gray-200 rounded-xl transition"
      >
        <div className="flex items-center gap-4 min-h-[65px]">
          <img
            src={defaultImage}
            alt={p.descripcion}
            className="rounded-md ring-1 ring-gray-200 w-14 h-14 object-cover"
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[13px] text-gray-800 truncate">
              {p.descripcion}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1 text-[10.5px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block bg-gray-400 rounded-full w-1.5 h-1.5" />
                {(p.codigo ?? '').toString().padStart(3, '0')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block bg-gray-400 rounded-full w-1.5 h-1.5" />
                {p.categoria ? p.categoria : 'SIN CATEGORÍA'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block bg-gray-400 rounded-full w-1.5 h-1.5" />
                SIN CÓDIGO DE BARRAS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block bg-gray-400 rounded-full w-1.5 h-1.5" />
                UNIDADES: {p.unidad}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1">
              <span className="bg-green-50 px-2 py-0.5 rounded-md font-extrabold text-[11px] text-emerald-600">
                S/ {Number(p.precio ?? 0).toFixed(2)}
              </span>
              <Button
                label="VER STOCK"
                className="!bg-blue-600 hover:!bg-blue-700 !px-2.5 !py-1.5 !rounded-md !font-semibold !text-[11px] !text-white"
              />
            </div>

            <Button
              className="!bg-transparent hover:!bg-gray-100 !border-0 !rounded-full !w-8 !h-8 shrink-0"
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
        <div className="flex justify-center items-center bg-white border border-gray-300 border-dashed rounded-xl h-40 text-gray-500">
          No hay productos
        </div>
      );
    }
    return <div className="space-y-3">{items.map(itemTemplate)}</div>;
  };

  return (
    <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-screen overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-5 font-bold text-gray-800 text-xl">Productos / Servicios</h2>
        <div className="flex items-center gap-2">
          <Button
            label="REGISTRAR NUEVO"
            className="!bg-indigo-600 hover:!bg-indigo-700 !px-4 !py-2 !rounded-lg !font-semibold !text-sm"
          />
          <Button
            className="!bg-white hover:!bg-gray-50 !border !border-gray-300 !rounded-full !w-10 !h-10"
            icon={<MoreVertIcon className="text-gray-600" />}
            aria-label="Opciones"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="relative w-full max-w-xl">
            <SearchIcon className="top-1/2 left-3 z-10 absolute !w-5 !h-5 text-gray-400 -translate-y-1/2 pointer-events-none" />
            <AutoComplete
              value={searchQuery}
              onChange={handleSearch}
              suggestions={[]}
              dropdown={false}
              placeholder="Buscar..."
              emptyMessage="No se encontraron productos"
              className="w-full"
              inputClassName="w-full rounded-md border border-gray-300 px-3 py-4 pl-10 text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="bg-white hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Anterior"
              title="Anterior"
              onClick={prevPage}
              disabled={!hasPrev}
            >
              <KeyboardArrowLeftIcon />
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              Página {currentPage} de {totalPages}
            </span>
            <button
              className="bg-white hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Siguiente"
              title="Siguiente"
              onClick={nextPage}
              disabled={!hasNext}
            >
              <KeyboardArrowRightIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-4 border border-gray-300 rounded-md min-h-0 overflow-y-auto">
          <DataView value={paginatedItems} listTemplate={listTemplate} layout="list" />
        </div>
      </div>
    </div>
  );
}

export default ProductosView;