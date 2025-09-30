import { useMemo, useState } from "react";
import { menuItemsConfig } from "@constants/menuItemsConstants";
import { menuActionsConfig } from "@utils/menuActions";
import { useNavigate } from "react-router-dom";

const ConfiguracionView = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menuItemsConfig;
    return menuItemsConfig.filter(
      (it) =>
        it?.name?.toLowerCase().includes(q) ||
        it?.description?.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col w-full h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-gray-50/60 px-6 py-5 border-b">
        <h2 className="font-semibold text-gray-800 text-2xl">Configuración</h2>

        {/* Buscador */}
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
      </div>

      {/* GRID */}
      <div className="flex-1 px-6 py-6 w-full overflow-y-auto">
        <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const handleClick = () =>
              menuActionsConfig[item.action]?.({ navigate });

            return (
              <button
                key={idx}
                onClick={handleClick}
                className="group flex flex-col justify-center items-center bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 w-full h-40 text-left transition"
              >
                {/* Ícono grande */}
                <div className="flex justify-center items-center bg-emerald-50 mb-3 rounded-full ring-1 ring-emerald-100 group-hover:ring-emerald-200 w-14 h-14">
                  {Icon ? (
                    <Icon className="!text-[28px] text-emerald-500" />
                  ) : (
                    <i className="text-emerald-500 text-xl pi pi-cog" />
                  )}
                </div>

                {/* Título + opcional descripción */}
                <div className="text-center">
                  <div className="font-semibold text-gray-800 text-base">
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="mt-0.5 text-gray-500 text-sm">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Estado vacío del filtro */}
        {items.length === 0 && (
          <div className="flex flex-col justify-center items-center mt-12 text-gray-500">
            <i className="mb-3 text-3xl pi pi-inbox" />
            <p>No se encontraron opciones para “{query}”.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConfiguracionView;