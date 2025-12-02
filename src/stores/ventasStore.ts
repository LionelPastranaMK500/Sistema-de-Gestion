import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  VentaState,
  CondicionPago,
  DatoAdicional,
  StoreGuiaRemision,
  DetalleVentaItem,
} from "@/types/stores";
import { Producto, Cliente } from "@/types/models";

const useVentaStore = create(
  persist<VentaState>(
    (set, get) => ({
      // --- ESTADO INICIAL ---
      clienteVenta: null,
      productosVenta: [],
      placa: "",
      ordenCompra: "",
      observaciones: "",
      condicionPago: { condicion: "", metodo: "", referencia: "" },
      datosAdicionales: [],
      guiasRemision: [],

      // --- ACCIONES CORE (Cliente y Productos) ---

      setClienteVenta: (cliente: Cliente | null) =>
        set({ clienteVenta: cliente }),

      agregarProducto: (producto: Producto, cantidad: number) => {
        const { productosVenta } = get();
        const existe = productosVenta.find(
          (p) => p.codigoProducto === producto.codigoProducto
        );

        if (existe) {
          // Si ya existe, sumamos la cantidad
          const actualizados = productosVenta.map((p) =>
            p.codigoProducto === producto.codigoProducto
              ? {
                  ...p,
                  cantidadVenta: p.cantidadVenta + cantidad,
                  totalVenta: (p.cantidadVenta + cantidad) * p.precioVenta,
                }
              : p
          );
          set({ productosVenta: actualizados });
        } else {
          const nuevoItem: DetalleVentaItem = {
            ...producto,
            cantidadVenta: cantidad,
            totalVenta: cantidad * producto.precioVenta,
          };
          set({ productosVenta: [...productosVenta, nuevoItem] });
        }
      },

      removerProducto: (codigoProducto: string) => {
        set((state) => ({
          productosVenta: state.productosVenta.filter(
            (p) => p.codigoProducto !== codigoProducto
          ),
        }));
      },

      actualizarCantidad: (codigoProducto: string, cantidad: number) => {
        set((state) => ({
          productosVenta: state.productosVenta.map((p) => {
            if (p.codigoProducto === codigoProducto) {
              return {
                ...p,
                cantidadVenta: cantidad,
                totalVenta: cantidad * p.precioVenta,
              };
            }
            return p;
          }),
        }));
      },

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

      // --- UTILIDADES ---

      limpiarFormularioVenta: () =>
        set({
          clienteVenta: null,
          productosVenta: [],
          placa: "",
          ordenCompra: "",
          observaciones: "",
          condicionPago: { condicion: "", metodo: "", referencia: "" },
          datosAdicionales: [],
          guiasRemision: [],
        }),

      calcularTotales: () => {
        const { productosVenta } = get();
        const subtotal = productosVenta.reduce(
          (acc, item) => acc + item.totalVenta,
          0
        );
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        return { subtotal, igv, total };
      },
    }),
    {
      name: "venta-form-storage",
    }
  )
);

export default useVentaStore;
