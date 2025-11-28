import { useState, useRef } from "react";
import { getClientes } from "@/services/generadorData";
import { AutoComplete } from "primereact/autocomplete";

interface Cliente {
  razonSocial?: string;
  nombre?: string;
  direccion?: string;
  documento?: string;
  documentoTipo?: string;
  email?: string;
  [key: string]: any;
}

interface SpecialItem {
  __type: "header" | "tips";
  razonSocial?: never;
  documento?: never;
}

type SuggestionItem = Cliente | SpecialItem;

export const useClienteSeleccionado = () => {
  const clientes = getClientes();

  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [clientesFiltrados, setClientesFiltrados] = useState<SuggestionItem[]>(
    []
  );

  const acClienteRef = useRef<AutoComplete>(null);

  const HEADER: SpecialItem = { __type: "header" };
  const TIPS: SpecialItem = { __type: "tips" };

  const buildClienteSuggestions = (query: string): SuggestionItem[] => {
    const q = (query ?? "").toLowerCase().trim();
    if (!q) return [HEADER, TIPS];

    const matches = clientes.filter(
      (c: Cliente) =>
        (c.razonSocial || "").toLowerCase().includes(q) ||
        (c.direccion || "").toLowerCase().includes(q) ||
        (c.documento || "").toString().toLowerCase().includes(q)
    );

    return [HEADER, ...(matches ?? []), TIPS];
  };

  const buscarClientes = (event: { query: string }) => {
    setClientesFiltrados(buildClienteSuggestions(event.query));
  };

  const clienteItemTemplate = (opt: SuggestionItem) => {
    if ("__type" in opt) {
      if (opt.__type === "header") {
        return (
          <div
            className="top-0 z-10 sticky flex justify-between items-center bg-white px-4 py-3 border-b"
            onMouseDown={(e) => e.preventDefault()}
          >
            <span className="font-semibold text-[13px] text-gray-600 uppercase tracking-wide">
              Resultados de la búsqueda
            </span>
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-bold text-[12px] text-white"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => console.log("REGISTRAR NUEVO")}
            >
              REGISTRAR NUEVO
            </button>
          </div>
        );
      }

      if (opt.__type === "tips") {
        return (
          <div
            className="bottom-0 sticky bg-white px-4 py-3 border-t text-[12px] text-gray-600 leading-5"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div>
              <strong>TIP:</strong> Escribe <strong>3 o más caracteres</strong>{" "}
              para comenzar a buscar
            </div>
            <div>
              <strong>TIP:</strong> Para un <strong>DNI o RUC</strong>, escribe
              el número y presiona <strong>ENTER</strong>
            </div>
            <div>
              <strong>TIP:</strong> ¿Sin documentos? Escribe el nombre y
              presiona <strong>ENTER</strong>
            </div>
            <div>
              <strong>TIP:</strong> Para una venta sin datos, puedes dejar el
              campo vacío
            </div>
          </div>
        );
      }
    }

    const clienteData = opt as Cliente;

    return (
      <div className="hover:bg-gray-50 px-3 py-2">
        <div className="text-[12px] text-gray-500">{clienteData.documento}</div>
        <div className="font-semibold text-[13px] text-gray-800">
          {clienteData.razonSocial || clienteData.nombre}
        </div>
      </div>
    );
  };

  return {
    cliente,
    setCliente,
    clientesFiltrados,
    setClientesFiltrados,
    buscarClientes,
    clienteItemTemplate,
    acClienteRef,
    HEADER,
    TIPS,
  };
};
