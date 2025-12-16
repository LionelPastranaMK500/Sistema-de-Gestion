import apiClient from "@/config/api";

import {
  InitiateRecoveryRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
} from "@/types/models";

const RECOVERY_URL = "/auth/recovery";

export const passwordRecoveryService = {
  // POST /auth/recovery/init (Solicitar código de recuperación)
  initiateRecovery: async (request: InitiateRecoveryRequest): Promise<any> => {
    const { data } = await apiClient.post(`${RECOVERY_URL}/init`, request);
    return data;
  },

  // POST /auth/recovery/verify (Verificar código)
  verifyCode: async (request: VerifyCodeRequest): Promise<any> => {
    const { data } = await apiClient.post(`${RECOVERY_URL}/verify`, request);
    return data;
  },

  // POST /auth/recovery/reset (Restablecer contraseña)
  resetPassword: async (request: ResetPasswordRequest): Promise<any> => {
    const { data } = await apiClient.post(`${RECOVERY_URL}/reset`, request);
    return data;
  },
};
