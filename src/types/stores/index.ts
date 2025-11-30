import { Usuario, ImpresionConfig } from "../models";
import { LoginRequest } from "../auth";

// --- Ventas Store ---
export interface CondicionPago {
  condicion: string;
  metodo: string;
  referencia: string;
}

export interface DatoAdicional {
  titulo: string;
  descripcion: string;
  [key: string]: any;
}

export interface StoreGuiaRemision {
  tipo: string;
  serie: string;
  numero: string;
  [key: string]: any;
}

export interface VentaState {
  placa: string;
  ordenCompra: string;
  observaciones: string;
  condicionPago: CondicionPago;
  datosAdicionales: DatoAdicional[];
  guiasRemision: StoreGuiaRemision[];

  setPlaca: (nuevaPlaca: string) => void;
  setOrdenCompra: (nuevaOrden: string) => void;
  setObservaciones: (nuevasObservaciones: string) => void;
  setCondicionPago: (nuevosDatos: CondicionPago) => void;
  setDatosAdicionales: (nuevosDatos: DatoAdicional[]) => void;
  setGuiasRemision: (nuevosDatos: StoreGuiaRemision[]) => void;
  limpiarFormularioVenta: () => void;
}

// --- Impresion Store ---
export interface ImpresionState {
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

  // Ahora usa la interfaz correcta que vive en models
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

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  isAuthenticated: boolean;

  // Acciones
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}
