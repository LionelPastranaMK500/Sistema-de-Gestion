import { useState, useRef } from "react";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteChangeEvent,
} from "primereact/autocomplete";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Skeleton } from "primereact/skeleton";
import { Menu } from "primereact/menu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

// Imports de nuestra arquitectura
import { useClientesQueries } from "@/hooks/clientes/useClientesQueries";
import { useClientesMutations } from "@/hooks/clientes/useClientesMutations";
import { ClienteDto } from "@/types/models/cliente";
import { ClienteCardProps } from "@/types/ui/modules";

import {
  MoreVertIcon,
  SearchIcon,
  KeyboardArrowLeftIcon,
  KeyboardArrowRightIcon,
} from "@/constants/icons";

import ClienteNuevo from "./ClienteNuevo";

// --- Componente de Tarjeta (Con Menú Funcional) ---
const ClienteCard = ({ cliente, onEdit, onDelete }: ClienteCardProps) => {
  const menu = useRef<Menu>(null);

  const items = [
    {
      label: "Opciones",
      items: [
        {
          label: "Editar",
          icon: "pi pi-pencil",
          command: () => onEdit && onEdit(cliente),
        },
        {
          label: "Eliminar",
          icon: "pi pi-trash",
          className: "text-red-600",
          command: () => onDelete && onDelete(cliente.clienteID),
        },
      ],
    },
  ];

  return (
    <div className="bg-white shadow-sm hover:shadow-md px-4 py-4 border border-gray-300 rounded-md text-sm transition">
      <div className="flex items-center gap-4">
        {/* Avatar con iniciales */}
        <Avatar
          label={(cliente.nombreRazonSocial || "-").charAt(0)}
          size="large"
          shape="circle"
          className="!bg-gray-100 !text-gray-600"
        />

        {/* Info Principal */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 truncate">
            {cliente.nombreRazonSocial || "-"}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-blue-100 px-2 py-[2px] rounded-full font-semibold text-[11px] text-blue-700">
              {cliente.numeroRuc ? "RUC" : "DNI/OTRO"}
            </span>
            <small className="text-gray-500">{cliente.numeroRuc || "-"}</small>
          </div>
          <div className="mt-1 text-gray-400 text-xs">
            {cliente.email && <span>{cliente.email}</span>}
          </div>
        </div>

        {/* Botón de Menú */}
        <Menu model={items} popup ref={menu} id={`menu_${cliente.clienteID}`} />
        <Button
          className="!bg-transparent hover:!bg-gray-100 !border-0 !rounded-full !w-9 !h-9"
          text
          aria-label="Más acciones"
          icon={<MoreVertIcon className="text-gray-500" />}
          onClick={(event) => menu.current?.toggle(event)}
          aria-controls={`menu_${cliente.clienteID}`}
          aria-haspopup
        />
      </div>
    </div>
  );
};

// --- Componente Principal ---
const ClientesView = () => {
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 0, size: 15 });

  // 1. Hooks de Lectura
  const { useClientes } = useClientesQueries();
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useClientes(searchQuery, pagination);

  // 2. Hooks de Escritura (Mutaciones)
  const { deleteCliente } = useClientesMutations();

  // Desestructuración de datos paginados
  const pageData = apiResponse?.data;
  const clientes = pageData?.content || [];
  const totalPages = pageData?.totalPages || 0;
  const isLastPage = pageData?.last || false;
  const isFirstPage = pageData?.first || false;

  // --- Handlers de Acción ---

  const handleDelete = (id: number) => {
    confirmDialog({
      message: "¿Está seguro de eliminar este cliente?",
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      acceptLabel: "Sí, eliminar",
      rejectLabel: "Cancelar",
      accept: () => {
        deleteCliente.mutate(id);
      },
    });
  };

  const handleEdit = (cliente: ClienteDto) => {
    // Aquí implementaremos la lógica de edición más adelante
    console.log("Editar cliente:", cliente);
    // setClienteAEditar(cliente);
    // setMostrarNuevo(true);
  };

  // --- Handlers de Paginación y Búsqueda ---
  const handleNextPage = () => {
    if (!isLastPage)
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handlePrevPage = () => {
    if (!isFirstPage)
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  // --- Templates ---
  const listTemplate = (items: ClienteDto[]) => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-md bg-white">
              <div className="flex gap-4">
                <Skeleton shape="circle" size="3rem" />
                <div className="flex-1 space-y-2">
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isError || !items || items.length === 0) {
      return (
        <div className="flex justify-center items-center bg-white border border-gray-300 border-dashed rounded-md h-40 text-gray-500 text-sm">
          {isError
            ? "Error al cargar clientes"
            : "No hay Clientes o Proveedores"}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {items.map((cliente) => (
          <ClienteCard
            key={cliente.clienteID}
            cliente={cliente}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-screen overflow-hidden">
      {/* Componente de Diálogo para confirmaciones */}
      <ConfirmDialog />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-5 font-bold text-gray-800 text-xl">
          Clientes / Proveedores
        </h2>
        <div className="flex items-center gap-2">
          <Button
            label="REGISTRAR NUEVO"
            className="!bg-indigo-600 hover:!bg-indigo-700 !px-4 !py-2 !rounded-md !font-semibold !text-sm"
            onClick={() => setMostrarNuevo(true)}
          />
          <Button
            className="!bg-white hover:!bg-gray-50 !border !border-gray-300 !rounded-full !w-10 !h-10"
            icon={<MoreVertIcon className="text-gray-600" />}
            aria-label="Opciones"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center gap-3 mb-4">
          <div className="relative w-full max-w-xl">
            <SearchIcon className="top-1/2 left-3 z-10 absolute !w-5 !h-5 text-gray-400 -translate-y-1/2 pointer-events-none" />
            <AutoComplete
              value={searchQuery}
              completeMethod={(e: AutoCompleteCompleteEvent) =>
                handleSearch(e.query)
              }
              suggestions={[]}
              dropdown={false}
              placeholder="Buscar por Razón Social o RUC..."
              className="w-full"
              inputClassName="w-full rounded-md border border-gray-300 px-3 py-4 pl-10 text-sm focus:ring-2 focus:ring-blue-400"
              onChange={(e: AutoCompleteChangeEvent) => handleSearch(e.value)}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className="bg-white hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePrevPage}
              disabled={isFirstPage || isLoading}
            >
              <KeyboardArrowLeftIcon />
            </button>
            <span className="text-sm text-gray-600 min-w-[80px] text-center">
              Página {pagination.page + 1} de {totalPages || 1}
            </span>
            <button
              className="bg-white hover:bg-gray-50 px-3 py-2 border border-gray-300 rounded-md text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNextPage}
              disabled={isLastPage || isLoading}
            >
              <KeyboardArrowRightIcon />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-4 border border-gray-300 rounded-md min-h-0 overflow-y-auto">
          <DataView
            value={clientes}
            listTemplate={listTemplate}
            layout="list"
          />
        </div>
      </div>

      {mostrarNuevo && <ClienteNuevo onClose={() => setMostrarNuevo(false)} />}
    </div>
  );
};

export default ClientesView;
