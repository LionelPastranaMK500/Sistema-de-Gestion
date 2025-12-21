// src/types/models/almacen.ts
import { ProductoDto } from "./producto";

export interface AlmacenDto {
  almacenID: number;
  nombre: string;
  direccion: string;
}

export interface AlmacenCreateDto {
  nombre: string;
  direccion: string;
}

export interface AlmacenConProductosDto {
  almacenID: number;
  nombre: string;
  direccion: string;
  productos: ProductoDto[];
}

export interface AlmacenSummaryDto {
  id: number;
  nombre: string;
}
