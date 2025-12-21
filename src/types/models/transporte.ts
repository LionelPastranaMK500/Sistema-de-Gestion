// src/types/models/transporte.ts

import { TipoLicencia, TipoVehiculo, ClienteSummaryDto } from "./comunes";

/**
 * Espejo de: studios.tkoh.billing.dto.simple.ChoferDto
 */
export interface ChoferDto {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  tipolicencia: TipoLicencia;
  licencia: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.ChoferCreateDto
 */
export interface ChoferCreateDto {
  nombre: string;
  dni: string;
  telefono: string;
  tipolicencia: TipoLicencia;
  licencia: string;
  clienteSummaryDto?: ClienteSummaryDto;
}

/**
 * Espejo de: studios.tkoh.billing.dto.simple.VehiculoDto
 */
export interface VehiculoDto {
  id: number;
  placa: string;
  tarjetaUnicaCirculacion: string;
  marca: string;
  tipovehiculo: TipoVehiculo;
  kilometrajeAnterior: string;
  kilometrajeProximo: string;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.VehiculoCreateDto
 */
export interface VehiculoCreateDto {
  placa: string;
  tarjetaUnicaCirculacion: string;
  clienteSummaryDto?: ClienteSummaryDto;
}
