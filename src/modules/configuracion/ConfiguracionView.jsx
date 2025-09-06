import { useMemo, useState } from "react";
import { menuItemsConfig } from "@constants/menuItemsConstants";
import { menuActionsConfig } from "@utils/menuActions";
import { useNavigate } from "react-router-dom";

export default function ConfiguracionView() {
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
      <div className="flex items-center justify-between px-6 py-5 border-b bg-gray-50/60">
        <h2 className="text-2xl font-semibold text-gray-800">Configuración</h2>

        {/* Buscador */}
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 pr-9 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Buscar en configuración"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i className="pi pi-search text-sm" />
          </span>
        </div>
      </div>

      {/* GRID */}
      <div className="w-full flex-1 overflow-y-auto px-6 py-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => {
            const Icon = item.icon;
            const handleClick = () =>
              menuActionsConfig[item.action]?.({ navigate });

            return (
              <button
                key={idx}
                onClick={handleClick}
                className="group flex h-40 w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-left shadow-sm transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {/* Ícono grande */}
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 group-hover:ring-emerald-200">
                  {Icon ? (
                    <Icon className="!text-[28px] text-emerald-500" />
                  ) : (
                    <i className="pi pi-cog text-xl text-emerald-500" />
                  )}
                </div>

                {/* Título + opcional descripción */}
                <div className="text-center">
                  <div className="text-base font-semibold text-gray-800">
                    {item.name}
                  </div>
                  {item.description && (
                    <div className="mt-0.5 text-sm text-gray-500">
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
          <div className="mt-12 flex flex-col items-center justify-center text-gray-500">
            <i className="pi pi-inbox mb-3 text-3xl" />
            <p>No se encontraron opciones para “{query}”.</p>
          </div>
        )}
      </div>
    </div>
  );
}
