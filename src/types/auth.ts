/**
 * Refleja: studios.tkoh.billing.dto.request.AuthRequest (Java)
 * Endpoint: /auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Refleja: studios.tkoh.billing.dto.request.RegisterRequest (Java)
 * Endpoint: /auth/register
 */
export interface RegisterRequest {
  email: string;
  password: string;
  nombres: string;
  apellidoPa: string; // Tal cual el backend
  apellidoMa: string; // Tal cual el backend
}

/**
 * Refleja: studios.tkoh.billing.dto.response.AuthResponse (Java)
 * NOTA: El backend usa snake_case aquí.
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}
