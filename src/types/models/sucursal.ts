// src/types/models/sucursal.ts
import { UsuarioSummaryDto } from "./comunes";
import { AlmacenSummaryDto } from "./almacen";
import { SerieSummaryDto, TipoDocumentoSummaryDto } from "./maestras";

export interface SucursalDto {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  codigoAnexo: string;
  esPrincipal: boolean;
}

export interface SucursalCreateDto {
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  codigoAnexo: string;
  esPrincipal: boolean;
}

export interface SucursalUpdateDto extends SucursalCreateDto {
  id: number;
}

export interface Sucursal_ComprobanteDto {
  id: number;
  tipoDocumento: string;
  serie: string;
  usarComoDefecto: boolean;
}

export interface ConfigOptionsDto {
  availableDocumentTypes: TipoDocumentoSummaryDto[];
  availableSeries: SerieSummaryDto[];
}

export interface SucursalDetailDto {
  id: number;
  nombre: string;
  direccion: string;

  // Aquí es donde se usa UsuarioSummaryDto. Si tu Java no lo tiene, bórralo.
  vendedores: UsuarioSummaryDto[];

  almacenes: AlmacenSummaryDto[];
  comprobantes: Sucursal_ComprobanteDto[];
  configOptions: ConfigOptionsDto;
}

export interface SucursalComprobanteConfigCommandDto {
  id?: number;
  sucursalId: number;
  tipoDocumentoId: number;
  serieId: number;
  usarComoDefecto: boolean;
}
