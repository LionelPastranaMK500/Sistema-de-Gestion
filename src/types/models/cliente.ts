// Asumimos que el DTO de dirección estará en este archivo.
// Si aún no lo creas, te marcará error hasta que hagamos 'direccion.ts'.
import { DireccionDto } from "./direccion";

// =============================================================================
// 1. BASE (Campos comunes para evitar repetición)
// =============================================================================
interface ClienteBase {
  numeroRuc: string;
  nombreRazonSocial: string;
  telefonoCelular: string;
  email: string;
  direccionPrincipal: string;
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.ClienteCreateDto
 */
export interface ClienteCreateDto extends ClienteBase {
  observaciones: string;
  tipoClienteID: number;
  ubigeoID: number;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.ClienteUpdateDto
 * NOTA: Update NO tiene 'numeroRuc' (no editable) ni 'ubigeoID'.
 */
export interface ClienteUpdateDto extends Omit<ClienteBase, "numeroRuc"> {
  id: number; // Java: Long id
  observaciones: string;
  tipoClienteID: number;
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Detail / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ClienteDto
 */
export interface ClienteDto extends ClienteBase {
  clienteID: number; // Java: Long clienteID
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.ClienteSummaryDto
 * NOTA: Java usa 'direccion' en lugar de 'direccionPrincipal'.
 */
export interface ClienteSummaryDto {
  clienteID: number; // Java: Long clienteID
  numeroRuc: string;
  nombreRazonSocial: string;
  direccion: string; // Java: String direccion
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.ClienteDetailDto
 * NOTA: Según tu Java, este DTO NO tiene campo ID.
 */
export interface ClienteDetailDto extends ClienteBase {
  // No tiene ID según el código Java proporcionado
  observaciones: string;
  tipoClienteID: number;
  tipoCliente: string; // Nombre del tipo (ej. "Juridico")

  // Relaciones (Evitamos importaciones circulares con Documento/Guia usando any o interfaces ligeras)
  listaDocumentos: any[]; // Java: Set<Documento>
  listaGuias: any[]; // Java: Set<GuiaRemision>
  listaDireccionesAdicionales: any[]; // Java: Set<ClienteDireccion> (Definido en el backend como Modelo, aquí llega como JSON)
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ClienteLookupResult
 * (Para búsquedas rápidas tipo autocompletado)
 */
export interface ClienteLookupResult {
  tipo: string;
  numeroDocumento: string;
  nombre: string;
  direccion: string;
  email: string;
  telefono: string;
}

// =============================================================================
// 4. DTOs DE DIRECCIONES (Específicos de Cliente)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ClienteWithAddressesDto
 */
export interface ClienteWithAddressesDto
  extends Omit<ClienteBase, "telefonoCelular" | "email"> {
  clienteID: number;
  // direccionPrincipal ya viene de ClienteBase (pero revisa si el Omit es correcto para tu caso)

  direccionesAdicionales: DireccionDto[]; // Java: Set<DireccionDto>
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.ClienteDireccionDto
 * (Tabla intermedia o relación directa)
 */
export interface ClienteDireccionDto {
  clienteDireccionId: number; // Java: Long clienteDireccionId
  clienteID: number;
  direccionID: number;

  clienteDto: ClienteWithAddressesDto;
  direccionDto: DireccionDto;
}
