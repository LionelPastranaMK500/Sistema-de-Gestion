import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CondicionPago {
  condicion: string;
  metodo: string;
  referencia: string;
}

interface DatoAdicional {
  titulo: string;
  descripcion: string;
  [key: string]: any;
}

interface GuiaRemision {
  tipo: string;
  serie: string;
  numero: string;
  [key: string]: any;
}

interface VentaState {
  placa: string;
  ordenCompra: string;
  observaciones: string;
  condicionPago: CondicionPago;
  datosAdicionales: DatoAdicional[];
  guiasRemision: GuiaRemision[];

  setPlaca: (nuevaPlaca: string) => void;
  setOrdenCompra: (nuevaOrden: string) => void;
  setObservaciones: (nuevasObservaciones: string) => void;
  setCondicionPago: (nuevosDatos: CondicionPago) => void;
  setDatosAdicionales: (nuevosDatos: DatoAdicional[]) => void;
  setGuiasRemision: (nuevosDatos: GuiaRemision[]) => void;
  limpiarFormularioVenta: () => void;
}

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
      setGuiasRemision: (nuevosDatos: GuiaRemision[]) =>
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
