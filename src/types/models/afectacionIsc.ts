// src/types/models/afectacionIsc.ts

export interface AfectacionISCDto {
  tipoAfectacionISCID: number; // Long en Java
  descripcion: string; //
  codigoSUNAT: string; //
  porcentajeISC: number; // double en Java
}

export interface AfectacionISCCreateDto {
  descripcion: string; //
  codigoSUNAT: string; //
  porcentajeISC: number; // double en Java
}
