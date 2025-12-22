// src/types/models/avatarUsuario.ts
import { UsuarioDto } from "./usuario";

// Si este Enum lo tienes en 'comunes.ts', impórtalo de allá.
// Si no, déjalo aquí tal cual lo tenías.
export type TipoOrigenImagen = "FILE_SYSTEM" | "DB" | "URL";

// =============================================================================
// DTOs DE AVATAR (Espejos del Java)
// =============================================================================

/**
 * BASE / CREATE
 * Espejo EXACTO de: studios.tkoh.billing.dto.create.AvatarUsuarioCreateDto
 */
export interface AvatarUsuarioCreateDto {
  nombreArchivo: string;
  dataArchivo: string; // Java: byte[] -> se maneja como string Base64 en front
  tipoArchivo: string;
  pesoArchivo: string;
  fechaSubida: string; // Java: LocalDateTime -> string ISO
  tipoOrigenImagen: TipoOrigenImagen;
}

/**
 * SIMPLE DTO
 * Espejo EXACTO de: studios.tkoh.billing.dto.simple.AvatarUsuarioDto
 * Hereda todo del Create y agrega el ID específico.
 */
export interface AvatarUsuarioDto extends AvatarUsuarioCreateDto {
  avatarID: number; // Java: Long avatarID
}

/**
 * DETAIL DTO
 * Espejo EXACTO de: studios.tkoh.billing.dto.detail.AvatarUsuarioDetailDto
 */
export interface AvatarUsuarioDetailDto
  extends Omit<AvatarUsuarioCreateDto, "fechaSubida"> {
  id: number; // Java: Long id
  usuariosDto: UsuarioDto[]; // Java: List<UsuarioDto>
}
