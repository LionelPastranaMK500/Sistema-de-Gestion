/**
 * Refleja: studios.tkoh.billing.dto.response.AuthResponse
 * (Java Record -> mantiene nombres exactos)
 */
export interface AuthResponse {
  access_token: string; // snake_case confirmado
  refresh_token: string; // snake_case confirmado
}

/**
 * Refleja: studios.tkoh.billing.dto.request.AuthRequest
 * (Usado para Login)
 */
export interface AuthRequest {
  email: string;
  password: string;
}

/**
 * Refleja: studios.tkoh.billing.dto.request.LoginRequest
 * (En tu Java es idéntico a AuthRequest, creamos un alias para consistencia)
 */
export type LoginRequest = AuthRequest;

/**
 * Refleja: studios.tkoh.billing.dto.request.RegisterRequest
 * (Registro público / Self-service)
 * OJO: Nota los nombres abreviados de los apellidos
 */
export interface RegisterRequest {
  email: string;
  password: string;
  nombres: string;
  apellidoPa: string; // Java: apellidoPa
  apellidoMa: string; // Java: apellidoMa
}

/**
 * Refleja: studios.tkoh.billing.dto.request.AddUserRequest
 * (Creación de usuario por Admin)
 * OJO: Aquí los apellidos SÍ tienen el nombre completo
 */
export interface AddUserRequest {
  nombres: string;
  apellidoPaterno: string; // Java: apellidoPaterno
  apellidoMaterno: string; // Java: apellidoMaterno
  email: string;
  password: string;
  roleName: string; // "ADMIN" | "USER"
}
