import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/config/api";
import { AuthStoreType, AuthState } from "@/types/stores/authstore";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create(
  persist<AuthStoreType>(
    (set) => ({
      ...initialState,

      // --- ACCIONES ---

      setSession: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });

        // Configurar Axios y localStorage
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        localStorage.setItem("authToken", accessToken);
      },

      setUser: (user) => {
        set({ user });
      },

      logout: () => {
        set(initialState);
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
          user: state.user,
        } as AuthStoreType),
    }
  )
);

export default useAuthStore;
