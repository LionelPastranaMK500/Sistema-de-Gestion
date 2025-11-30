import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types/stores";
import { authService } from "@/services/api/auth.service";
import apiClient from "@/config/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          const response = await authService.login(credentials);

          // 2. Guardamos en el estado de Zustand
          set({
            accessToken: response.access_token, // CORREGIDO: access_token
            refreshToken: response.refresh_token, // CORREGIDO: refresh_token
            isAuthenticated: true,
            user: null,
          });

          apiClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.access_token}`;

          localStorage.setItem("authToken", response.access_token);
          localStorage.setItem("refreshToken", response.refresh_token);
        } catch (error) {
          console.error("Error en login:", error);
          throw error;
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });

        // Limpieza completa
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        delete apiClient.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
