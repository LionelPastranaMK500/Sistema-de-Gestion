import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Configuración y UI
import { configCalendar } from "@/utils/calendar/configCalendar";
import { guiaTabsClienteProveedor } from "@/constants/menuItems";
import { CloseIcon } from "@/constants/icons";
import { ClienteNuevoProps } from "@/types/ui/modules";

// Lógica y Schemas
import {
  clienteSchema,
  ClienteSchemaType,
} from "@/schemas/clientes/ClienteView.schema";
import { useClientesMutations } from "@/hooks/clientes/useClientesMutations";

// Componentes de Pestañas
import ClienteTabInfoBasica from "./components/ClienteTabInfoBasica";
import ClienteTabVentas from "./components/ClienteTabVentas";
import ClienteTabProformas from "./components/ClienteTabProformas";
import ClienteTabGuias from "./components/ClienteTabGuias";

const ClienteNuevo = ({ onClose }: ClienteNuevoProps) => {
  const [activeTab, setActiveTab] = useState("infoBasica");

  // 1. Inicializamos el formulario
  const methods = useForm<ClienteSchemaType>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      numeroRuc: "",
      nombreRazonSocial: "",
      telefonoCelular: "",
      email: "",
      direccionPrincipal: "",
      observaciones: "",
      tipoClienteID: 0,
      ubigeoID: 0,
    },
    mode: "onChange",
  });

  // 2. Mutaciones
  const { createCliente } = useClientesMutations();
  const isPending = createCliente.isPending;

  useEffect(() => {
    configCalendar();
  }, []);

  // 3. Handler del Envío (Sanitizado)
  const onSubmit = (data: ClienteSchemaType) => {
    // Solución al error de TypeScript (undefined vs string):
    // Convertimos explícitamente los opcionales a strings vacíos antes de enviar.
    createCliente.mutate(
      {
        ...data,
        observaciones: data.observaciones || "",
        telefonoCelular: data.telefonoCelular || "",
        email: data.email || "",
      },
      {
        onSuccess: () => {
          onClose(); // Solo cerramos si el backend responde OK (200/201)
        },
      }
    );
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "infoBasica":
        return <ClienteTabInfoBasica />; // Aquí es donde conectaremos los inputs reales
      case "ventas":
        return <ClienteTabVentas />;
      case "proformas":
        return <ClienteTabProformas />;
      case "guias":
        return <ClienteTabGuias />;
      default:
        return null;
    }
  };

  return (
    // 4. FormProvider: Pasa el contexto del formulario a todos los hijos (Tabs)
    <FormProvider {...methods}>
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm">
        {/* Click fuera para cerrar (opcional, cuidado con perder datos) */}
        {/* <div className="absolute inset-0" onClick={onClose} /> */}

        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="relative flex flex-col bg-white shadow-2xl rounded-xl w-[min(980px,95vw)] max-h-[92vh] overflow-hidden animate-fade-in-down"
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-700 px-5 py-4 text-white">
            <h3 className="font-bold text-lg">Cliente / Proveedor</h3>
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-blue-700 px-3 shadow-md z-10">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {guiaTabsClienteProveedor.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.action;
                return (
                  <button
                    key={tab.action}
                    type="button"
                    onClick={() => setActiveTab(tab.action)}
                    className={`relative flex items-center gap-2 px-4 py-3 text-sm uppercase tracking-wide text-white/90
                                      hover:text-white transition-all ${
                                        active
                                          ? "font-bold text-white bg-white/10 rounded-t-lg"
                                          : ""
                                      }`}
                  >
                    <Icon />
                    {tab.name}
                    {active && (
                      <span className="right-0 bottom-0 left-0 absolute bg-white h-[3px]"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 bg-gray-50 px-6 py-6 overflow-y-auto">
            {renderActiveTabContent()}
          </div>

          {/* Footer Actions */}
          <div className="bottom-0 sticky flex justify-end items-center gap-3 bg-white px-5 py-3 border-t z-20">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-6 py-2 rounded-lg font-semibold text-white text-sm transition flex items-center gap-2 ${
                isPending
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? (
                <>
                  <i className="pi pi-spin pi-spinner"></i> Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default ClienteNuevo;
