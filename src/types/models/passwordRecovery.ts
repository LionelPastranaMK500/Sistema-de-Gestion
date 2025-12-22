// =============================================================================
// FLUJO 1: RECUPERACIÓN DE CONTRASEÑA (Olvidé mi clave)
// Refleja los Records internos de: studios.tkoh.billing.dto.request.PasswordRecoveryRequests
// =============================================================================

/**
 * Paso 1: Solicitar código
 * Endpoint: /auth/recovery/init
 */
export interface InitiateRecoveryRequest {
  email: string;
}

/**
 * Paso 2: Verificar el código recibido
 * Endpoint: /auth/recovery/verify
 */
export interface VerifyCodeRequest {
  email: string;
  code: string; // @Size(min = 4, max = 4)
}

/**
 * Paso 3: Establecer la nueva contraseña
 * Endpoint: /auth/recovery/reset
 * OJO: Corregido para coincidir con tu Java Record (newPassword, confirmPassword)
 */
export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string; // Java: String newPassword
  confirmPassword: string; // Java: String confirmPassword
}

// =============================================================================
// FLUJO 2: ACTUALIZACIÓN DE CONTRASEÑA (Usuario Logueado)
// =============================================================================

/**
 * Refleja: studios.tkoh.billing.dto.update.PasswordUpdateDto
 * Uso: Cuando el usuario entra a su perfil y quiere cambiar su clave actual.
 */
export interface PasswordUpdateDto {
  password: string; // Java: String password
}
