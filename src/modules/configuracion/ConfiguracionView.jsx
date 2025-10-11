import { useState } from "react";
import { Outlet, useOutlet } from "react-router-dom";
import ConfiguracionButtons from "./ConfiguracionButtons";

const ConfiguracionView = () => {
    const [query, setQuery] = useState("");
    const outlet = useOutlet(); 

    return (
        <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="ml-16 font-bold text-gray-800 text-3xl">Configuración</h2>

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
            {outlet ? <Outlet /> : <ConfiguracionButtons query={query} />}
        </div>
    );
};

export default ConfiguracionView;