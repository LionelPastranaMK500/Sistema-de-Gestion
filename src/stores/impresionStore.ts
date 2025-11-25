import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
    formatoDefecto: 'A4',
    decimales: 2,
    infoCabecera: '',
    cuentasBancarias: '',
    infoPiePagina: '',
    formatos: {
        A4: { disponibles: [], visibles: [] },
        A5: { disponibles: [], visibles: [] },
    }
};

const useImpresionStore = create(
    persist(
        (set) => ({
            ...initialState,
            loadInitialConfig: (configFromApi) => set({
                formatoDefecto: configFromApi.basica.formatoDefecto,
                decimales: configFromApi.basica.decimales,
                infoCabecera: configFromApi.basica.infoCabecera,
                cuentasBancarias: configFromApi.basica.cuentasBancarias,
                infoPiePagina: configFromApi.basica.infoPiePagina,
                formatos: configFromApi.formatos,
            }),
            updateBasica: (newBasica) => set((state) => ({
                ...state,
                ...newBasica
            })),
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