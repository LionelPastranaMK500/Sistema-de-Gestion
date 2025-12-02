import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";
import useVentaStore from "@/stores/ventasStore";
import { ventasService } from "@/services/api/ventas.service";
import { VentaPayload } from "@/types/models/ventas";
import { validarVenta } from "./validations";

/**
 * Hook para procesar la creación de una venta
 */
export const useCrearVentaLogic = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const store = useVentaStore();

  return useMutation({
    mutationFn: async () => {
      const errors = validarVenta(store);
      if (Object.keys(errors).length > 0) {
        throw new Error(Object.values(errors)[0]);
      }

      const payload: VentaPayload = {
        fechaVenta: new Date().toISOString(),
        montoTotal: store.calcularTotales().total,
        estado: "COMPLETADO",
        doc_cliente: {
          numeroRuc: store.clienteVenta?.numeroRuc || "",
        },
        listadetalles: store.productosVenta.map((p) => ({
          descripcion: p.nombreProducto,
          cantidad: p.cantidadVenta,
          precioUnitario: p.precioVenta,
          total: p.totalVenta,
          productoId: undefined,
        })),
      };

      return await ventasService.create(payload);
    },
    onSuccess: () => {
      notifySuccess("Venta registrada con éxito");

      store.limpiarFormularioVenta();

      queryClient.invalidateQueries({ queryKey: ["ventas"] });

      navigate("/ventas");
    },
    onError: (error: any) => {
      const msg =
        error.message ||
        error.response?.data?.message ||
        "Error al procesar la venta";
      notifyError(msg);
    },
  });
};
