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

/**
 * Parámetros estándar para cualquier petición paginada.
 * Coincide con lo que espera Spring Data (Pageable).
 */
export interface PaginationOptions {
  page?: number;
  size?: number;
  sort?: string; // Opcional: para "campo,asc"
}

// Valores por defecto globales (para no hardcodearlos en cada servicio)
export const DEFAULT_PAGINATION: PaginationOptions = {
  page: 0,
  size: 20,
};

// =========================================================================
// 💡 EJEMPLO DE PERSONALIZACIÓN (DEFAULT LOCAL)
// =========================================================================
// Caso 1: Usar el default global (20) -> Lo que tenemos ahora
// const params = { ...DEFAULT_PAGINATION, ...options };
//
// Caso 2: Forzar un default de 10 SOLO para este método
// const params = { ...DEFAULT_PAGINATION, size: 10, ...options };
//
// Caso 3: Forzar un default de 50 y ordenar por nombre
// const params = { ...DEFAULT_PAGINATION, size: 50, sort: 'nombre,asc', ...options };
//
// ¿POR QUÉ FUNCIONA?
// 1. Primero se cargan los defaults globales (...DEFAULT_PAGINATION).
// 2. Luego tú sobrescribes con tu default local (ej: size: 10).
// 3. Al final va ...options. Si el componente React envía { size: 100 },
// =========================================================================
