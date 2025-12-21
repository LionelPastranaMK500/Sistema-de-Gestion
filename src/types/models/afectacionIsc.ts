// src/types/models/afectacionIsc.ts

export interface AfectacionISCDto {
  tipoAfectacionISCID: number; // Long en Java
  descripcion: string; //
  codigoSUNAT: string; //
}

export interface AfectacionISCCreateDto {
  descripcion: string; //
  codigoSUNAT: string; //
}
