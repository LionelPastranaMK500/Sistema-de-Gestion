// src/types/auth.ts

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
  apellidoPa: string;
  apellidoMa: string;
}

/**
 * Refleja: studios.tkoh.billing.dto.response.AuthResponse (Java)
 * IMPORTANTE: Asumimos que tu backend está configurado para devolver snake_case
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}
