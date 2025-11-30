import { TipoLicencia, TipoVehiculo, ClienteSummary } from "./comunes";

/**
 * Modelo Maestro de Chofer
 * Refleja ChoferDto.java
 */
export interface Chofer {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  tipolicencia: TipoLicencia;
  licencia: string;
}

export interface ChoferPayload extends Omit<Chofer, "id"> {
  clienteSummaryDto?: ClienteSummary; // Requerido en create según DTO
}

/**
 * Modelo Maestro de Vehículo
 * Refleja VehiculoDto.java
 */
export interface Vehiculo {
  id: number;
  placa: string;
  tarjetaUnicaCirculacion: string;
  marca: string;
  tipovehiculo: TipoVehiculo;
  kilometrajeAnterior: string;
  kilometrajeProximo: string;
}

export interface VehiculoPayload
  extends Pick<Vehiculo, "placa" | "tarjetaUnicaCirculacion"> {
  clienteSummaryDto?: ClienteSummary;
}
