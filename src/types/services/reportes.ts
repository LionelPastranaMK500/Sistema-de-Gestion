export interface ReporteParams {
  type?: string;
  moneda?: string;
  sucursal?: string;
  usuario?: string;
  cliente?: string;
  fechaInicio?: string;
  fechaFin?: string;
  [key: string]: any;
}

export type SheetsData = Record<
  string,
  (string | number | null | undefined)[][]
>;
