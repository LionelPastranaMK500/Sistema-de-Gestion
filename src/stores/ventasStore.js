import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useVentaStore = create(
    persist(
        (set) => ({
            // Estado inicial de los campos que quieres guardar
            placa: '',
            ordenCompra: '',
            observaciones: '',

            // Funciones para actualizar cada campo
            setPlaca: (nuevaPlaca) => set({ placa: nuevaPlaca }),
            setOrdenCompra: (nuevaOrden) => set({ ordenCompra: nuevaOrden }),
            setObservaciones: (nuevasObservaciones) => set({ observaciones: nuevasObservaciones }),

            // Función extra para limpiar los campos si es necesario
            limpiarFormularioVenta: () => set({ placa: '', ordenCompra: '', observaciones: '' }),
        }),
        {
            name: 'venta-form-storage', // Nombre único para el guardado en localStorage
        }
    )
);

export default useVentaStore;