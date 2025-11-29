import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  VentaState,
  CondicionPago,
  DatoAdicional,
  StoreGuiaRemision,
} from "@/types/stores";

const useVentaStore = create<VentaState>()(
  persist(
    (set) => ({
      placa: "",
      ordenCompra: "",
      observaciones: "",
      condicionPago: { condicion: "", metodo: "", referencia: "" },
      datosAdicionales: [],
      guiasRemision: [],

      setPlaca: (nuevaPlaca: string) => set({ placa: nuevaPlaca }),
      setOrdenCompra: (nuevaOrden: string) => set({ ordenCompra: nuevaOrden }),
      setObservaciones: (nuevasObservaciones: string) =>
        set({ observaciones: nuevasObservaciones }),
      setCondicionPago: (nuevosDatos: CondicionPago) =>
        set({ condicionPago: nuevosDatos }),
      setDatosAdicionales: (nuevosDatos: DatoAdicional[]) =>
        set({ datosAdicionales: nuevosDatos }),
      setGuiasRemision: (nuevosDatos: StoreGuiaRemision[]) =>
        set({ guiasRemision: nuevosDatos }),

      limpiarFormularioVenta: () =>
        set({
          placa: "",
          ordenCompra: "",
          observaciones: "",
          condicionPago: { condicion: "", metodo: "", referencia: "" },
          datosAdicionales: [],
          guiasRemision: [],
        }),
    }),
    {
      name: "venta-form-storage",
    }
  )
);

export default useVentaStore;
