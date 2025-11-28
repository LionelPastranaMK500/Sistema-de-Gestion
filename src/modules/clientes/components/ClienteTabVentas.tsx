import {
  TabHeader,
  EmptyTabContent,
} from "@/components/data-display/TabHelpers";

interface VentaCliente {
  id: number | string;
  comprobante: string;
  sucursal: string;
  vendedor: string;
  total: string | number;
  fecha: string;
}

const columns = [
  { label: "Comprobante", className: "col-span-3" },
  { label: "Sucursal", className: "col-span-2" },
  { label: "Vendedor", className: "col-span-3" },
  { label: "Total", className: "col-span-2" },
  { label: "Fecha de registro", className: "col-span-2" },
];

const ClienteTabVentas = () => {
  // Tipamos el array aunque esté vacío para evitar errores de 'any' implícito
  const data: VentaCliente[] = [];

  return (
    <div className="border rounded-md overflow-hidden">
      <TabHeader columns={columns} />
      {data.length === 0 ? (
        <EmptyTabContent />
      ) : (
        <div className="divide-y divide-gray-200">
          {data.map((item) => (
            <div
              key={item.id}
              className="items-center grid grid-cols-12 hover:bg-gray-50 px-4 py-3 text-sm transition-colors"
            >
              <div className="col-span-3 font-medium text-gray-800">
                {item.comprobante}
              </div>
              <div className="col-span-2 text-gray-600">{item.sucursal}</div>
              <div className="col-span-3 text-gray-600">{item.vendedor}</div>
              <div className="col-span-2 font-semibold text-gray-800">
                {item.total}
              </div>
              <div className="flex justify-between items-center col-span-2 text-gray-600">
                <span>{item.fecha}</span>
                <button
                  className="p-1 rounded-full text-gray-400 hover:text-blue-600"
                  title="Visualizar"
                >
                  <i className="pi pi-eye"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClienteTabVentas;
