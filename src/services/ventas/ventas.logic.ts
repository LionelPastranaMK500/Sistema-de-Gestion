import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useVentaStore from "@/stores/ventasStore";
import { useAuthStore } from "@/stores/authStore";

// Servicios
import {
  documentosService,
  seriesService,
  monedasService,
  tiposDocumentoService,
} from "@/services/api";

// Modelos
import {
  VentaPayload,
  TipoDocumentoCodigo,
  MonedaCodigo,
} from "@/types/models/ventas";

// --- 1. UTILIDADES ---
const calcularDesgloseFiscal = (productos: any[]) => {
  const opGravada = productos.reduce(
    (acc: number, p: any) => acc + p.totalVenta,
    0
  );
  const igv = opGravada * 0.18;
  const total = opGravada + igv;

  return {
    opGravada: Number(opGravada.toFixed(2)),
    igv: Number(igv.toFixed(2)),
    total: Number(total.toFixed(2)),
    opExonerada: 0,
    opInafecta: 0,
  };
};

// --- 2. HOOK DE DATOS (AQUÍ ESTABA EL ERROR DE TIPOS) ---
export const useVentaData = () => {
  const { user } = useAuthStore() as any;
  const sucursalId = user?.sucursalId || user?.sucursal?.id;

  const monedasQuery = useQuery({
    queryKey: ["maestros", "monedas"],
    // CORRECCIÓN: Extraemos .data para que retorne el array limpio, no el objeto Axios
    queryFn: async () => (await monedasService.getAll()).data,
    staleTime: Infinity,
  });

  const tiposDocQuery = useQuery({
    queryKey: ["maestros", "tiposDocumento"],
    // CORRECCIÓN: Extraemos .data
    queryFn: async () => (await tiposDocumentoService.getAll()).data,
    staleTime: Infinity,
  });

  const seriesQuery = useQuery({
    queryKey: ["maestros", "series", sucursalId ? String(sucursalId) : "0"],
    queryFn: async () => {
      if (!sucursalId) return [];
      // CORRECCIÓN: Extraemos .data
      const res = await seriesService.getAll();
      return res.data;
    },
    enabled: Boolean(sucursalId),
  });

  return {
    // Ahora .data SÍ es un array, por lo que .map y .length funcionarán en la vista
    monedas: monedasQuery.data || [],
    tiposDocumento: tiposDocQuery.data || [],
    series: seriesQuery.data || [],
    isLoadingMaestros:
      monedasQuery.isLoading ||
      tiposDocQuery.isLoading ||
      seriesQuery.isLoading,
  };
};

// --- 3. HOOK DE MUTACIONES ---
export const useVentaMutations = () => {
  const queryClient = useQueryClient();

  const {
    productosVenta,
    clienteVenta,
    condicionPago,
    observaciones,
    ordenCompra,
    placa,
    limpiarFormularioVenta,
  } = useVentaStore();

  const { user } = useAuthStore() as any;
  const sucursalId = user?.sucursalId || user?.sucursal?.id;

  const crearVentaMutation = useMutation({
    mutationFn: async () => {
      // Validaciones
      if (!user?.id) throw new Error("Sesión no válida.");
      if (!sucursalId) throw new Error("No hay sucursal activa.");
      const clienteId =
        (clienteVenta as any)?.id || (clienteVenta as any)?.codigoCliente;
      if (!clienteId) throw new Error("Falta seleccionar el cliente.");
      if (productosVenta.length === 0)
        throw new Error("El carrito está vacío.");

      const totales = calcularDesgloseFiscal(productosVenta);

      // Payload
      const payload: VentaPayload = {
        usuarioId: Number(user.id),
        sucursalId: Number(sucursalId),
        clienteId: Number(clienteId),

        tipoDocumentoId: TipoDocumentoCodigo.FACTURA,
        monedaId: MonedaCodigo.SOLES,
        fechaEmision: new Date().toISOString().split("T")[0],

        opGravada: totales.opGravada,
        opExonerada: totales.opExonerada,
        opInafecta: totales.opInafecta,
        igv: totales.igv,
        total: totales.total,
        totalDescuentos: 0,

        detalles: productosVenta.map((item: any) => ({
          productoId: item.id || item.codigoProducto || 0,
          cantidad: item.cantidadVenta,
          precioUnitario: item.precioVenta,
          subtotal: item.totalVenta,
          igv: item.totalVenta * 0.18,
          total: item.totalVenta * 1.18,
          observacion: "",
        })),

        observaciones: observaciones || "",
        ordenCompra: ordenCompra || "",
        placaVehiculo: placa || "",

        condicionPagoId: (condicionPago as any)?.id
          ? Number((condicionPago as any).id)
          : undefined,
      };

      // CORRECCIÓN: En POST también devolvemos .data para que onSuccess reciba el objeto limpio
      const res = await documentosService.emitir(payload);
      return res.data;
    },
    onSuccess: (data: any) => {
      // data ya viene limpio
      toast.success(
        `Venta Generada: ${data.serie || "F001"}-${data.correlativo || "0"}`
      );
      limpiarFormularioVenta();
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Error al procesar la venta";
      toast.error(msg);
    },
  });

  return {
    crearVenta: crearVentaMutation.mutate,
    isCrearVentaLoading: crearVentaMutation.isPending,
    crearVentaError: crearVentaMutation.error,
  };
};
