import apiClient from "@/config/api";
import { ApiResponse } from "@/types/api";
import {
  InitiateRecoveryRequest,
  VerifyCodeRequest,
  ResetPasswordRequest,
} from "@/types/models";

const RECOVERY_URL = "/auth/recovery";

export const passwordRecoveryService = {
  // POST /auth/recovery/init
  initiateRecovery: async (
    request: InitiateRecoveryRequest
  ): Promise<ApiResponse<string>> => {
    const { data } = await apiClient.post<ApiResponse<string>>(
      `${RECOVERY_URL}/init`,
      request
    );
    return data;
  },

  // POST /auth/recovery/verify
  verifyCode: async (
    request: VerifyCodeRequest
  ): Promise<ApiResponse<boolean>> => {
    const { data } = await apiClient.post<ApiResponse<boolean>>(
      `${RECOVERY_URL}/verify`,
      request
    );
    return data;
  },

  // POST /auth/recovery/reset
  resetPassword: async (
    request: ResetPasswordRequest
  ): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.post<ApiResponse<void>>(
      `${RECOVERY_URL}/reset`,
      request
    );
    return data;
  },
};
