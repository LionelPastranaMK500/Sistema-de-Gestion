import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "@/types/stores";
import apiClient from "@/config/api";

// 1. Definimos las acciones
interface AuthActions {
  setSession: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

// 2. Unimos el Estado + Acciones
type AuthStore = AuthState & AuthActions;

// 3. Creamos el Store
export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      // --- ESTADO INICIAL ---
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // --- ACCIONES ---
      setSession: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          user: null,
        });

        // Configuración global
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        localStorage.setItem("authToken", accessToken);
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });

        localStorage.removeItem("authToken");
        delete apiClient.defaults.headers.common["Authorization"];
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) =>
        ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        } as AuthStore),
    }
  )
);

export default useAuthStore;
