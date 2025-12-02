import { Usuario, ImpresionConfig, Cliente, Producto } from "../models";

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

export interface DetalleVentaItem extends Producto {
  cantidadVenta: number;
  totalVenta: number; // precio * cantidad
}

export interface VentaState {
  // --- Datos Principales ---
  clienteVenta: Cliente | null;
  productosVenta: DetalleVentaItem[];

  // --- Metadatos (Lo que ya tenías) ---
  placa: string;
  ordenCompra: string;
  observaciones: string;
  condicionPago: CondicionPago;
  datosAdicionales: DatoAdicional[];
  guiasRemision: StoreGuiaRemision[];

  // --- Acciones ---
  setClienteVenta: (cliente: Cliente | null) => void;
  agregarProducto: (producto: Producto, cantidad: number) => void;
  removerProducto: (codigoProducto: string) => void;
  actualizarCantidad: (codigoProducto: string, cantidad: number) => void;

  setPlaca: (nuevaPlaca: string) => void;
  setOrdenCompra: (nuevaOrden: string) => void;
  setObservaciones: (nuevasObservaciones: string) => void;
  setCondicionPago: (nuevosDatos: CondicionPago) => void;
  setDatosAdicionales: (nuevosDatos: DatoAdicional[]) => void;
  setGuiasRemision: (nuevosDatos: StoreGuiaRemision[]) => void;

  limpiarFormularioVenta: () => void;

  // Getters computados (opcional, pero útil para totales)
  calcularTotales: () => { subtotal: number; igv: number; total: number };
}

// ... (ImpresionState y AuthState se quedan igual) ...
// --- IMPRESION ---
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

// --- AUTH STORE ---
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: Usuario | null;
  isAuthenticated: boolean;
  logout: () => void;
}
