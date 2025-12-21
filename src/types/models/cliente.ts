import { TipoClienteDto, TipoDocumentoDto } from "./maestras";

// Espejo de: studios.tkoh.billing.dto.simple.ClienteDireccionDto
export interface ClienteDireccionDto {
  id?: number;
  direccion: string;
  codigoUbigeo: string;
  codLocal?: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.simple.ClienteDto
 */
export interface ClienteDto {
  id: number;
  tipoCliente: TipoClienteDto;
  tipoDocumento: TipoDocumentoDto;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial: string;
  email: string;
  telefono: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.detail.ClienteDetailDto
 */
export interface ClienteDetailDto extends ClienteDto {
  direcciones: ClienteDireccionDto[];
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.ClienteCreateDto
 */
export interface ClienteCreateDto {
  tipoClienteID: number;
  tipoDocumentoID: number;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  email?: string;
  telefono?: string;

  // Lista de direcciones para crear junto con el cliente
  direcciones: ClienteDireccionDto[];
}

/**
 * Espejo de: studios.tkoh.billing.dto.update.ClienteUpdateDto
 */
export interface ClienteUpdateDto {
  id: number;
  tipoClienteID: number;
  tipoDocumentoID: number;
  numeroDocumento: string;
  razonSocial: string;
  nombreComercial?: string;
  email?: string;
  telefono?: string;

  // Lista de direcciones para actualizar
  direcciones: ClienteDireccionDto[];
}

/**
 * Espejo de: studios.tkoh.billing.dto.simple.ClienteLookupResult
 */
export interface ClienteLookupResult {
  razonSocial: string;
  numeroDocumento: string;
  direccion: string;
  estado: string;
  condicion: string;
  ubigeo: string;
}
