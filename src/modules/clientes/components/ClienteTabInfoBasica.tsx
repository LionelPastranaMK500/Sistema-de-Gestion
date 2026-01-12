import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";

// Hooks y Iconos
import { useClientesQueries } from "@/hooks/clientes/useClientesQueries";
import { SearchIcon } from "@/constants/icons";
import ErrorText from "@/components/common/ErrorText"; // Asegúrate de tener este componente o usa un <small> rojo
import { ClienteSchemaType } from "@/schemas/clientes/ClienteView.schema";

const ClienteTabInfoBasica = () => {
  // 1. Conexión con el Formulario Padre
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger, // Para disparar validaciones manuales
  } = useFormContext<ClienteSchemaType>();

  // Observamos el valor del RUC para la búsqueda
  const rucValue = watch("numeroRuc");

  // 2. Hook de Consulta RUC (Fase 3)
  const { useConsultaRuc } = useClientesQueries();
  // Inicialmente enabled: false para que no busque solo al escribir, sino al click
  const {
    data: sunatData,
    refetch,
    isFetching,
  } = useConsultaRuc(rucValue, false);

  // 3. Efecto: Cuando llega data de SUNAT, llenamos el formulario
  useEffect(() => {
    if (sunatData) {
      // Mapeo inteligente de los datos de tu API de consulta
      setValue("nombreRazonSocial", sunatData.nombre || "");
      setValue("direccionPrincipal", sunatData.direccion || "");
      setValue("email", sunatData.email || ""); // Si la API lo trae
      // setValue("telefonoCelular", sunatData.telefono || ""); // Si la API lo trae

      // Feedback visual
      toast.success("Datos encontrados en SUNAT");

      // Re-validar los campos llenados para quitar errores visuales
      trigger(["nombreRazonSocial", "direccionPrincipal"]);
    }
  }, [sunatData, setValue, trigger]);

  // Handler para el botón de búsqueda
  const handleBuscarSunat = async () => {
    if (!rucValue || rucValue.length < 8) {
      toast.warning("Ingrese un documento válido para buscar");
      return;
    }
    await refetch();
  };

  return (
    <div className="gap-4 grid grid-cols-12 animate-fade-in">
      {/* --- TIPO DOCUMENTO --- */}
      <div className="col-span-12 md:col-span-6">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Tipo Documento <span className="text-red-500">*</span>
        </label>
        <select
          {...register("tipoClienteID", { valueAsNumber: true })}
          className={`px-3 py-2 border rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
            errors.tipoClienteID
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        >
          <option value={0} disabled>
            Seleccione...
          </option>
          {/* Aquí idealmente cargarías tipos desde una API. Hardcodeamos por ahora para cumplir el diseño */}
          <option value={1}>DNI</option>
          <option value={2}>RUC</option>
          <option value={3}>CARNET EXT.</option>
        </select>
        {errors.tipoClienteID && (
          <ErrorText>{errors.tipoClienteID.message}</ErrorText>
        )}
      </div>

      {/* --- NÚMERO DOCUMENTO (Con Buscador) --- */}
      <div className="col-span-12 md:col-span-6">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Número Documento <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ingrese número"
            {...register("numeroRuc")}
            maxLength={11}
            className={`px-3 py-2 border rounded-md w-full text-sm pr-10 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
              errors.numeroRuc
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
          />

          {/* Botón de Lupa dentro del input */}
          <button
            type="button"
            onClick={handleBuscarSunat}
            disabled={isFetching}
            className="top-1/2 right-2 absolute text-gray-400 hover:text-blue-600 -translate-y-1/2 disabled:opacity-50 transition-colors"
            title="Buscar en SUNAT/RENIEC"
          >
            {isFetching ? (
              <i className="pi pi-spin pi-spinner text-blue-500"></i>
            ) : (
              <SearchIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.numeroRuc && <ErrorText>{errors.numeroRuc.message}</ErrorText>}
      </div>

      {/* --- RAZÓN SOCIAL --- */}
      <div className="col-span-12">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Nombre o Razón Social <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Nombre completo o Razón Social"
          {...register("nombreRazonSocial")}
          className={`px-3 py-2 border rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
            errors.nombreRazonSocial
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        />
        {errors.nombreRazonSocial && (
          <ErrorText>{errors.nombreRazonSocial.message}</ErrorText>
        )}
      </div>

      {/* --- EMAIL --- */}
      <div className="col-span-12 md:col-span-6">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Email
        </label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          {...register("email")}
          className={`px-3 py-2 border rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
            errors.email
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </div>

      {/* --- TELÉFONO --- */}
      <div className="col-span-12 md:col-span-6">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Teléfono
        </label>
        <input
          type="text"
          placeholder="+51 999 999 999"
          {...register("telefonoCelular")}
          className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
        />
      </div>

      {/* --- DIRECCIÓN --- */}
      <div className="col-span-12">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Dirección Principal <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Av. Principal 123..."
          {...register("direccionPrincipal")}
          className={`px-3 py-2 border rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
            errors.direccionPrincipal
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        />
        {errors.direccionPrincipal && (
          <ErrorText>{errors.direccionPrincipal.message}</ErrorText>
        )}
      </div>

      {/* --- UBIGEO (Requerido por Schema) --- */}
      <div className="col-span-12 md:col-span-6">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Ubigeo (Distrito) <span className="text-red-500">*</span>
        </label>
        <select
          {...register("ubigeoID", { valueAsNumber: true })}
          className={`px-3 py-2 border rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
            errors.ubigeoID
              ? "border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }`}
        >
          <option value={0} disabled>
            Seleccione Ubigeo...
          </option>
          {/* Mock temporal, aquí usaríamos un hook de Ubigeos */}
          <option value={1}>LIMA / LIMA / LIMA</option>
          <option value={2}>AREQUIPA / AREQUIPA / AREQUIPA</option>
        </select>
        {errors.ubigeoID && <ErrorText>{errors.ubigeoID.message}</ErrorText>}
      </div>

      {/* --- OBSERVACIONES --- */}
      <div className="col-span-12">
        <label className="block mb-1 font-medium text-gray-500 text-xs">
          Observaciones
        </label>
        <textarea
          placeholder="Información adicional..."
          {...register("observaciones")}
          rows={3}
          className="px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md w-full text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors resize-none"
        ></textarea>
      </div>
    </div>
  );
};

export default ClienteTabInfoBasica;
