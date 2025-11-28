import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ImpresionConfig } from "@/services/generadorData";

interface ImpresionState {
  formatoDefecto: string;
  decimales: number;
  infoCabecera: string;
  cuentasBancarias: string;
  infoPiePagina: string;
  formatos: {
    [key: string]: {
      disponibles: string[];
      visibles: string[];
    };
  };

  loadInitialConfig: (configFromApi: ImpresionConfig) => void;

  updateBasica: (
    newBasica: Partial<
      Omit<
        ImpresionState,
        "formatos" | "loadInitialConfig" | "updateBasica" | "updateFormato"
      >
    >
  ) => void;

  updateFormato: (
    formatoKey: string,
    newColumns: { disponibles: string[]; visibles: string[] }
  ) => void;
}

const initialState = {
  formatoDefecto: "A4",
  decimales: 2,
  infoCabecera: "",
  cuentasBancarias: "",
  infoPiePagina: "",
  formatos: {
    A4: { disponibles: [], visibles: [] },
    A5: { disponibles: [], visibles: [] },
  },
};

const useImpresionStore = create<ImpresionState>()(
  persist(
    (set) => ({
      ...initialState,

      loadInitialConfig: (configFromApi: ImpresionConfig) =>
        set({
          formatoDefecto: configFromApi.basica.formatoDefecto,
          decimales: configFromApi.basica.decimales,
          infoCabecera: configFromApi.basica.infoCabecera,
          cuentasBancarias: configFromApi.basica.cuentasBancarias,
          infoPiePagina: configFromApi.basica.infoPiePagina,
          formatos: configFromApi.formatos,
        }),

      updateBasica: (newBasica) =>
        set((state) => ({
          ...state,
          ...newBasica,
        })),

      updateFormato: (formatoKey, newColumns) =>
        set((state) => ({
          formatos: {
            ...state.formatos,
            [formatoKey]: newColumns,
          },
        })),
    }),
    {
      name: "impresion-config-storage",
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
