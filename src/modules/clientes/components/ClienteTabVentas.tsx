import {
  TabHeader,
  EmptyTabContent,
} from "@/components/data-display/TabHelpers";
import { VentaReporteDto } from "@/types/models";

const columns = [
  { label: "Comprobante", className: "col-span-3" },
  { label: "Sucursal", className: "col-span-2" },
  { label: "Vendedor", className: "col-span-3" },
  { label: "Total", className: "col-span-2" },
  { label: "Fecha de registro", className: "col-span-2" },
];

const ClienteTabVentas = () => {
  // Usamos el DTO espejo del backend
  const data: VentaReporteDto[] = [];

  return (
    <div className="border rounded-md overflow-hidden">
      <TabHeader columns={columns} />
      {data.length === 0 ? (
        <EmptyTabContent />
      ) : (
        <div className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <div
              key={index}
              className="items-center grid grid-cols-12 hover:bg-gray-50 px-4 py-3 text-sm transition-colors"
            >
              <div className="col-span-3 font-medium text-gray-800">
                {`${item.serie}-${item.numero}`}
              </div>
              <div className="col-span-2 text-gray-600">{item.sucursal}</div>
              <div className="col-span-3 text-gray-600">{item.usuario}</div>
              <div className="col-span-2 font-semibold text-gray-800">
                {item.moneda} {item.total.toFixed(2)}
              </div>
              <div className="flex justify-between items-center col-span-2 text-gray-600">
                <span>{new Date(item.fechaEmision).toLocaleDateString()}</span>
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
