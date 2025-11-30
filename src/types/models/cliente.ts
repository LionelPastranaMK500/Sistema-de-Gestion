import { Documento } from "./documento";
import { GuiaRemision } from "./guia";

export interface ClienteDireccion {
  id?: number;
  direccion: string;
  ubigeoId?: number;
  esPrincipal: boolean;
}

/**
 * Modelo Maestro de Cliente (Lectura)
 */
export interface Cliente {
  // Identificadores
  numeroRuc: string; // ID principal

  // Datos Personales/Empresariales
  nombreRazonSocial: string;
  telefonoCelular: string;
  email: string;
  direccionPrincipal: string;
  observaciones: string;

  // Tipificación
  tipoClienteID: number;
  tipoCliente: string;

  // Relaciones (Solo lectura)
  listaDocumentos?: Documento[];
  listaGuias?: GuiaRemision[];
  listaDireccionesAdicionales?: ClienteDireccion[];
}

/**
 * Payload para Crear/Editar Cliente
 */
export interface ClientePayload
  extends Omit<
    Cliente,
    | "tipoCliente"
    | "listaDocumentos"
    | "listaGuias"
    | "listaDireccionesAdicionales"
  > {
  ubigeoID: number;
}
