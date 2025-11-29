// --- API Responses ---

export interface CdrResponse {
  cdrBase64: string;
  numero: string;
  estado: string;
}

export interface EstadoResponse {
  estado: string;
  motivo?: string;
}

// --- Logic & Calculations ---

// Datos del formulario antes de enviar
export interface VentaFormData {
  cliente?: {
    documento?: string;
    tipoDocumento?: string;
    razonSocial?: string;
    direccion?: string;
  };
  items?: any[];
  total?: number;
  tipoComprobante?: string;
  serie?: string;
  fechaEmision?: Date | string;
  fechaVencimiento?: Date | string;
  placa?: string;
  ordenCompra?: string;
  observaciones?: string;
  condicionPago?: any;
  [key: string]: any;
}

export interface LogicResult {
  success: boolean;
  data?: any;
  error?: string;
  errors?: string[];
}

// Interfaces para cálculos
export interface ItemCalculo {
  total: number;
  [key: string]: any;
}

export interface ItemVenta extends ItemCalculo {
  cantidad: number;
  precio?: number;
}
