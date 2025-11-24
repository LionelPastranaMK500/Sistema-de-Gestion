import { getProductos } from "@services/generadorData";
import { useEffect, useState } from "react";
import { CloseIcon } from "@constants/icons";
import { useSearch } from "@hooks/data";

const AgregarProducoModal = ({ onSelect, onClose }) => {
    const [productos, setProductos] = useState([]);

    const { query, setQuery, filteredItems: filtrados } = useSearch(productos, {
        searchFields: ['descripcion', 'codigo'],
        emptyQuery: []
    });

    useEffect(() => {
        const cargarProductos = async () => {
            const data = await getProductos();
            setProductos(data);
        };
        cargarProductos();
    }, []);

    return (
        <div
            className="z-50 fixed inset-0 flex justify-center items-center"
            role="dialog"
            aria-modal="true"
        >
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div
                className="z-10 relative bg-white shadow-2xl rounded-xl w-[min(820px,94vw)] max-h-[88vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-5 py-4 border-b">
                    <h3 className="font-semibold text-gray-800 text-base">
                        Buscar producto / servicio
                    </h3>
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-100 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-500 hover:text-gray-700"
                        aria-label="Cerrar"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="bg-gray-50/60 px-5 py-4 border-b">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Escribe descripción, código, etc."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-white px-4 py-2.5 pr-10 border border-gray-300 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 w-full text-gray-800 placeholder:text-gray-400 text-sm"
                            autoFocus
                        />
                        <span className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2 pointer-events-none">
                            <i className="text-sm pi pi-search" />
                        </span>
                    </div>
                </div>

                <div className="px-5 py-4 max-h-[62vh] overflow-y-auto">
                    {query.trim() === "" && (
                        <div className="flex flex-col justify-center items-center bg-white px-6 py-10 border border-gray-300 border-dashed rounded-lg text-center">
                            <div className="flex justify-center items-center bg-gray-100 mb-3 rounded-full w-16 h-16 text-gray-400">
                                <i className="text-2xl pi pi-box" />
                            </div>
                            <p className="text-gray-600 text-sm">
                                Busca un producto o servicio por su descripción o código.
                            </p>
                        </div>
                    )}

                    {query.trim() !== "" && (
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
                                                className="group flex justify-between items-start bg-white shadow-sm hover:shadow-md px-4 py-3 border border-gray-200 hover:border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full text-left transition"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">
                                                        {prod.descripcion}
                                                    </p>
                                                    <p className="mt-0.5 text-gray-500 text-xs">
                                                        {prod.unidad}
                                                        {prod.codigo ? ` • Código: ${prod.codigo}` : ""}
                                                    </p>
                                                </div>
                                                <i className="text-gray-400 group-hover:text-blue-600 transition pi pi-plus" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="bg-white px-4 py-8 border border-gray-200 rounded-lg text-gray-600 text-sm text-center">
                                    No se encontraron resultados para "{query}".
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-white px-5 py-3 border-t text-right">
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AgregarProducoModal;