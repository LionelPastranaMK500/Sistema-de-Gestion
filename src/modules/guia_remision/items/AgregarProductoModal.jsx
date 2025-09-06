import { productosDesdeFacturas } from "@/data/dataFalsa";
import { useEffect, useState } from "react";
import { CloseIcon } from "@constants/iconsConstants";

export default function AgregarProducoModal({ onSelect, onClose }) {
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtrados, setFiltrados] = useState([]);

    useEffect(() => {
        setProductos(productosDesdeFacturas);
    }, []);

    useEffect(() => {
        const query = busqueda.toLowerCase().trim();
        if (!query) {
            setFiltrados([]);
            return;
        }
        const resultado = productos.filter(
            (prod) =>
                prod.descripcion.toLowerCase().includes(query) ||
                (prod.codigo && String(prod.codigo).toLowerCase().includes(query))
        );
        setFiltrados(resultado);
    }, [busqueda, productos]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* modal */}
            <div
                className="relative z-10 w-[min(820px,94vw)] max-h-[88vh] overflow-hidden rounded-xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* header */}
                <div className="flex items-center justify-between border-b px-5 py-4">
                    <h3 className="text-base font-semibold text-gray-800">
                        Buscar producto / servicio
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label="Cerrar"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* search bar */}
                <div className="border-b bg-gray-50/60 px-5 py-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Escribe descripción, código, etc."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                            autoFocus
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <i className="pi pi-search text-sm" />
                        </span>
                    </div>
                </div>

                {/* body */}
                <div className="max-h-[62vh] overflow-y-auto px-5 py-4">
                    {/* estado vacío */}
                    {busqueda.trim() === "" && (
                        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <i className="pi pi-box text-2xl" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Busca un producto o servicio por su descripción o código.
                            </p>
                        </div>
                    )}

                    {/* resultados */}
                    {busqueda.trim() !== "" && (
                        <>
                            {filtrados.length > 0 ? (
                                <ul className="space-y-2">
                                    {filtrados.map((prod) => (
                                        <li key={prod.codigo || prod.descripcion}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onSelect?.(prod);
                                                    onClose?.();
                                                }}
                                                className="group flex w-full items-start justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {prod.descripcion}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        {prod.unidad}
                                                        {prod.codigo ? ` • Código: ${prod.codigo}` : ""}
                                                    </p>
                                                </div>
                                                <i className="pi pi-plus text-gray-400 transition group-hover:text-blue-600" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-600">
                                    No se encontraron resultados para “{busqueda}”.
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* footer (opcional) */}
                <div className="border-t bg-white px-5 py-3 text-right">
                    <button
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
