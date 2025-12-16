// src/types/models/afectacionIgv.ts

export interface AfectacionIGVDto {
  tipoAfectacionIGVID: number;
  descripcion: string;
  codigoSUNAT: string;
  porcentajeIGV: number;
}

export interface AfectacionIGVCreateDto {
  descripcion: string;
  codigoSUNAT: string;
  porcentajeIGV: number;
}
