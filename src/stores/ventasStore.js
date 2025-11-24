import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVentaStore = create(
    persist(
        (set) => ({
            placa: '',
            ordenCompra: '',
            observaciones: '',
            condicionPago: { condicion: '', metodo: '', referencia: '' },
            datosAdicionales: [],
            guiasRemision: [],

            setPlaca: (nuevaPlaca) => set({ placa: nuevaPlaca }),
            setOrdenCompra: (nuevaOrden) => set({ ordenCompra: nuevaOrden }),
            setObservaciones: (nuevasObservaciones) => set({ observaciones: nuevasObservaciones }),
            setCondicionPago: (nuevosDatos) => set({ condicionPago: nuevosDatos }),
            setDatosAdicionales: (nuevosDatos) => set({ datosAdicionales: nuevosDatos }),
            setGuiasRemision: (nuevosDatos) => set({ guiasRemision: nuevosDatos }),

            limpiarFormularioVenta: () => set({
                placa: '',
                ordenCompra: '',
                observaciones: '',
                condicionPago: { condicion: '', metodo: '', referencia: '' },
                datosAdicionales: [],
                guiasRemision: []
            }),
        }),
        {
            name: 'venta-form-storage',
        }
    )
);

export default useVentaStore;