// Tipos visuales para los reportes

export type ReportViewMode = "filter" | "generated" | "visualize" | null;

export interface ReporteItem {
  name: string;
  action: string;
  icon: any;
  description?: string;
}

// Filtros específicos por reporte
export interface VentasFilterState {
  tipo: string;
  moneda: string;
  sucursal: string;
  usuario: string;
  cliente: string;
  start: Date;
  end: Date;
  fechaInicio?: Date | null;
  fechaFin?: Date | null;
  [key: string]: any;
}

export interface GuiasFilterState {
  sucursal: string | null;
  usuario: string | null;
  fechaInicio: Date | null;
  fechaFin: Date | null;
  [key: string]: any;
}
