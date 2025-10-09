import { useMemo } from "react";
import { menuItemsConfig } from "@constants/menuItemsConstants";
import { menuActionsConfig } from "@utils/menuActions";
import { useNavigate } from "react-router-dom";

const ConfiguracionButtons = ({ query }) => {
    const navigate = useNavigate();

    const items = useMemo(() => {
        const q = (query || "").trim().toLowerCase();
        if (!q) return menuItemsConfig;
        return menuItemsConfig.filter(
            (it) =>
                it?.name?.toLowerCase().includes(q) ||
                it?.description?.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <div className="flex-1 px-6 py-6 w-full overflow-y-auto">
            <div className="gap-5 grid sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, idx) => {
                    const Icon = item.icon;
                    const handleClick = () => menuActionsConfig[item.action]?.({ navigate });

                    return (
                        <button
                            key={idx}
                            onClick={handleClick}
                            className="group flex flex-col justify-center items-center bg-white shadow-sm hover:shadow-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 w-full h-40 text-left transition"
                        >
                            <div className="flex justify-center items-center bg-emerald-50 mb-3 rounded-full ring-1 ring-emerald-100 group-hover:ring-emerald-200 w-14 h-14">
                                {Icon ? <Icon className="!text-[28px] text-emerald-500" /> : <i className="text-emerald-500 text-xl pi pi-cog" />}
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-800 text-base">{item.name}</div>
                                {item.description && <div className="mt-0.5 text-gray-500 text-sm">{item.description}</div>}
                            </div>
                        </button>
                    );
                })}
            </div>

            {items.length === 0 && (
                <div className="flex flex-col justify-center items-center mt-12 text-gray-500">
                    <i className="mb-3 text-3xl pi pi-inbox" />
                    <p>No se encontraron opciones para “{query}”.</p>
                </div>
            )}
        </div>
    );
};

export default ConfiguracionButtons;