// src/types/api/requests.ts
/**
 * Parámetros estándar para endpoints paginados de Spring
 * Se envían como query params: ?page=0&size=10&sort=id,desc
 */
export interface PaginationParams {
  page?: number; // 0-based index
  size?: number;
  sort?: string | string[]; // ej: "nombre,asc"
}

/**
 * Filtros genéricos que vi en tus controladores (GuiaRemisionController)
 */
export interface SearchParams extends PaginationParams {
  usuarioId?: number;
  sucursalId?: number;
  clienteId?: number;
  // Puedes agregar aquí otros filtros globales como 'q' (texto de búsqueda)
  q?: string;
}
