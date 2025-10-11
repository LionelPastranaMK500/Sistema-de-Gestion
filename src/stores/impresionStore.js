// src/stores/impresionStore.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
    // Configuración Básica
    formatoDefecto: 'A4',
    decimales: 2,
    infoCabecera: '',
    cuentasBancarias: '',
    infoPiePagina: '',
    // Configuración de Columnas
    formatos: {
        A4: { disponibles: [], visibles: [] },
        A5: { disponibles: [], visibles: [] },
    }
};

const useImpresionStore = create(
    persist(
        (set) => ({
            ...initialState,

            /**
             * Carga la configuración inicial (simula la respuesta de la API).
             */
            loadInitialConfig: (configFromApi) => set({
                formatoDefecto: configFromApi.basica.formatoDefecto,
                decimales: configFromApi.basica.decimales,
                infoCabecera: configFromApi.basica.infoCabecera,
                cuentasBancarias: configFromApi.basica.cuentasBancarias,
                infoPiePagina: configFromApi.basica.infoPiePagina,
                formatos: configFromApi.formatos,
            }),

            /**
             * Actualiza solo la configuración básica (Dropdowns y Textareas).
             */
            updateBasica: (newBasica) => set((state) => ({ 
                ...state,
                ...newBasica 
            })),
            
            /**
             * Actualiza la configuración de columnas de un formato específico.
             */
            updateFormato: (formatoKey, newColumns) => set((state) => ({
                formatos: {
                    ...state.formatos,
                    [formatoKey]: newColumns,
                }
            })),
        }),
        {
            name: 'impresion-config-storage', 
            partialize: (state) => ({
                formatoDefecto: state.formatoDefecto,
                decimales: state.decimales,
                infoCabecera: state.infoCabecera,
                cuentasBancarias: state.cuentasBancarias,
                infoPiePagina: state.infoPiePagina,
                formatos: state.formatos,
            }),
        }
    )
);

export default useImpresionStore;