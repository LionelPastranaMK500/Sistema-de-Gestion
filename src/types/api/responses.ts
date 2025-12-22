// src/types/api/responses.ts
/**
 * Envoltorio estándar de respuesta del Backend
 * Refleja: studios.tkoh.billing.dto.response.ApiResponse.java
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T; // Puede ser un objeto, un array o null
  timestamp: string; // Instant en Java llega como string ISO
}

/**
 * Estructura de Paginación de Spring Data
 * Usada cuando el backend retorna `Page<Dto>`
 */
export interface Page<T> {
  content: T[]; // La lista de items de la página actual
  totalPages: number; // Total de páginas
  totalElements: number; // Total de registros en la BD
  last: boolean; // Es la última página?
  first: boolean; // Es la primera página?
  size: number; // Tamaño de página solicitado
  number: number; // Índice de la página actual (0-based)
  numberOfElements: number; // Elementos en esta respuesta específica
  empty: boolean;
}

/**
 * Tipo helper para respuestas paginadas envueltas en ApiResponse
 * Uso: const response: ApiPaginatedResponse<Producto>
 */
export type ApiPaginatedResponse<T> = ApiResponse<Page<T>>;
