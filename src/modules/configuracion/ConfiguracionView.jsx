import { useState } from "react";
import { Outlet, useOutlet } from "react-router-dom";
import ConfiguracionButtons from "./ConfiguracionButtons"; // Importamos el componente de botones

const ConfiguracionView = () => {
    const [query, setQuery] = useState("");
    const outlet = useOutlet(); // Hook para detectar si hay una ruta hija activa

    return (
        <div className="flex flex-col w-full h-full">
            {/* HEADER */}
            <div className="flex justify-between items-center bg-gray-50/60 px-6 py-5 border-b">
                <h2 className="ml-16 font-bold text-gray-800 text-3xl">Configuración</h2>

                {/* El buscador solo se muestra si NO estamos en una sub-ruta */}
                {!outlet && (
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            placeholder="Buscar…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-white px-4 py-2 pr-9 border border-gray-300 focus:border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 w-full text-gray-700 placeholder:text-gray-400 text-sm"
                            aria-label="Buscar en configuración"
                        />
                        <span className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2 pointer-events-none">
                            <i className="text-sm pi pi-search" />
                        </span>
                    </div>
                )}
            </div>

            {/*
              AQUÍ ESTÁ LA LÓGICA CLAVE:
              - Si 'outlet' tiene un componente (ej. <ConfigurarEmpresa />), lo renderiza.
              - Si 'outlet' es null (estamos en /configuracion), renderiza <ConfiguracionButtons />.
            */}
            {outlet ? <Outlet /> : <ConfiguracionButtons query={query} />}
        </div>
    );
};

export default ConfiguracionView;