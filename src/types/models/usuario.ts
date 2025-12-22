import { EstadoUsuario } from "./comunes";

// =============================================================================
// 1. BASE (Helper para evitar repetición de campos comunes)
// =============================================================================
interface UsuarioBase {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  ruc: string;
  razonSocial: string;
  usuarioSOL: string;
  contraseniaSOL: string;
  nombreComercial: string;
  aliasVentas: string;
  direccionFiscal: string;
  estadousuario: EstadoUsuario;
  ultimaSesion?: string; // Date/LocalDateTime -> string ISO
}

// =============================================================================
// 2. DTOs DE TRANSACCIÓN (Create / Update)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.UsuarioCreateDto
 */
export interface UsuarioCreateDto extends UsuarioBase {
  contrasenia: string;

  // Java: private AvatarUsuario avaUser;
  // Usamos 'any' o la interfaz de Avatar si no crea ciclo.
  avaUser?: any;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.update.UsuarioUpdateDto
 */
export interface UsuarioUpdateDto extends Partial<UsuarioBase> {
  // En el Update, Java repite los campos, así que heredamos de Base (o Partial).
  // Nota: Java tiene @Email y @Size, TS solo valida tipos.

  // Relaciones (Java usa Set<Entity>).
  // Usamos any[] para EVITAR DEPENDENCIA CIRCULAR con Documento.ts y Guia.ts
  listaUsuariosCliente?: any[]; // Java: Set<UsuarioCliente>
  listaDocumentos?: any[]; // Java: Set<Documento>
  listaGuias?: any[]; // Java: Set<GuiaRemision>
  listaUsuariosSucursal?: any[]; // Java: Set<UsuarioSucursal>
}

// =============================================================================
// 3. DTOs DE LECTURA (Simple / Detail / Summary)
// =============================================================================

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.UsuarioDetailDto
 * Hereda todos los campos base y agrega el ID.
 */
export interface UsuarioDetailDto extends UsuarioBase {
  id: number; // Java: Long id
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.UsuarioDto
 * (Usado en DocumentoDetailDto y otros)
 */
export interface UsuarioDto {
  usuarioID: number; // Java: Long usuarioID
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  aliasVentas: string;
}

/**
 * Espejo EXACTO de: studios.tkoh.billing.dto.summary.UsuarioSummaryDto
 */
export interface UsuarioSummaryDto {
  id: number; // Java: Long id
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fullName: string; // Campo calculado en Java
  aliasVentas: string;
  ruc: string;
  razonSocial: string;
  email: string;
}
