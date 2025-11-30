// Tipos genéricos para mantenedores simples (Tablas maestras)

export interface TipoDocumento {
  id: number;
  codigo: string; // ej. "01", "03"
  descripcion: string; // ej. "FACTURA"
  abreviatura: string;
}

export interface TipoCliente {
  id: number;
  codigo: string; // ej. "1", "6"
  descripcion: string; // ej. "DNI", "RUC"
}

export interface TipoEnvio {
  id: number;
  codigo: string;
  descripcion: string;
}

export interface TipoDocNota {
  id: number;
  codigo: string;
  descripcion: string;
  tipoAsociado: "CREDITO" | "DEBITO"; // Para saber si es NC o ND
}

// Payloads genéricos (casi siempre son solo descripción y código)
export interface MaestraPayload {
  codigo: string;
  descripcion: string;
  abreviatura?: string;
}
