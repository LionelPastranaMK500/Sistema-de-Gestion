import apiClient from "@/config/api";
import { AuthRequest, RegisterRequest, AuthResponse } from "@/types/models";

const AUTH_URL = "/auth";

export const authService = {
  // POST /auth/login
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/login`,
      credentials
    );
    return data;
  },

  // POST /auth/register
  register: async (info: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/register`,
      info
    );
    return data;
  },

  // POST /auth/refresh-token
  refreshToken: async (tokenActual: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      `${AUTH_URL}/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenActual}`,
        },
      }
    );
    return data;
  },
};
