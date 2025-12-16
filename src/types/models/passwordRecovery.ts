// src/types/models/passwordRecovery.ts

/**
 * Refleja: studios.tkoh.billing.dto.request.PasswordRecoveryRequests.InitiateRecoveryRequest (Java)
 * Corresponde al endpoint: POST /auth/recovery/init
 */
export interface InitiateRecoveryRequest {
  email: string;
}

/**
 * Refleja: studios.tkoh.billing.dto.request.PasswordRecoveryRequests.VerifyCodeRequest (Java)
 * Corresponde al endpoint: POST /auth/recovery/verify
 */
export interface VerifyCodeRequest {
  email: string;
  code: string;
}

/**
 * Refleja: studios.tkoh.billing.dto.request.PasswordRecoveryRequests.ResetPasswordRequest (Java)
 * Corresponde al endpoint: POST /auth/recovery/reset
 */
export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

// Puedes añadir aquí otras interfaces relacionadas con el flujo de recuperación de contraseña si aparecen.
