// src/types/models/chofer.ts

import { TipoLicencia, ClienteSummaryDto } from "./comunes";
import { GuiaRemisionSummaryDto } from "./guia"; // Asumiendo que existe o existirá en guia.ts

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

  // En Java es un objeto anidado. Si es opcional, lo marcamos con ?
  clienteSummaryDto?: ClienteSummaryDto;
}

/**
 * Espejo de: studios.tkoh.billing.dto.update.ChoferUpdateDto
 */
export interface ChoferUpdateDto {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  tipolicencia: TipoLicencia;
  licencia: string;

  // Set<Long> en Java -> number[] en TS
  vehiculoIds?: number[];

  // Relación con Guía
  guiaSummaryDto?: GuiaRemisionSummaryDto;
}

/**
 * Espejo de: studios.tkoh.billing.dto.summary.ChoferSummaryDto
 */
export interface ChoferSummaryDto {
  id: number;
  tipolicencia: TipoLicencia;
  licencia: string;
}
