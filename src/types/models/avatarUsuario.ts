// src/types/models/avatarUsuario.ts

/**
 * Espejo de: studios.tkoh.billing.dto.simple.AvatarUsuarioDto
 * Usado en listas o referencias simples.
 */
export interface AvatarUsuarioDto {
  id: number;
  nombreArchivo: string;
  tipoContenido: string;
  usuarioId: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.detail.AvatarUsuarioDetailDto
 * Usado cuando pides el detalle completo (posiblemente incluye la data en Base64)
 */
export interface AvatarUsuarioDetailDto {
  id: number;
  nombreArchivo: string;
  tipoContenido: string;
  datos: string;
  usuarioId: number;
}

/**
 * Espejo de: studios.tkoh.billing.dto.create.AvatarUsuarioCreateDto
 */
export interface AvatarUsuarioCreateDto {
  usuarioId: number;
}
