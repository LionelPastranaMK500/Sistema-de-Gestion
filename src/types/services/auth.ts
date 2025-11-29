// --- DTOs de Autenticación ---

export interface AuthCompany {
  ruc: string;
  usuarioSol: string;
  razonSocial: string;
  sucursal: string;
  nombreComercial?: string;
  direccion?: string;
}

export interface AuthUser {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  correo: string;
  clave?: string;
  rol?: string;
  empresa?: AuthCompany | null;
  resetCode?: string;
  nombreCompleto?: string;
}

// Respuesta lógica interna del servicio de auth
export interface AuthLogicResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  empresa?: AuthCompany;
  token?: string;
}

// Respuesta de la API (Backend)
export interface ApiAuthResponse {
  user: AuthUser; // Ojo: Aquí tu API usa 'Usuario' de generadorData, pero AuthUser es más completo para el frontend
  token: string;
}

// --- Formularios y Validaciones ---

export interface LoginData {
  correo?: string;
  clave?: string;
}

export interface RegisterData {
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  correo?: string;
  clave?: string;
  aceptaTerminos?: boolean;
}

export interface SunatData {
  ruc?: string;
  usuarioSol?: string;
  claveSol?: string;
}

export interface ResetPassData {
  correo?: string;
  codigo?: string;
  nuevaClave?: string;
}

export type ValidationErrors = Record<string, string>;

// Respuesta genérica para lógica de componentes
export interface LogicResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  data?: any;
}
