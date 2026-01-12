import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "@/services/api/auth.service";
import { passwordRecoveryService } from "@/services/api/passwordRecovery.service";
import useAuthStore from "@/stores/authStore";
import {
  AuthRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from "@/types/models";

export const useAuthMutations = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  // --- LOGIN ---
  const loginMutation = useMutation({
    mutationFn: (credentials: AuthRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setSession(data.access_token, data.refresh_token);
      toast.success("Bienvenido al sistema");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.error(message);
    },
  });

  // --- REGISTER ---
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente. Por favor inicia sesión.");
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al registrar el usuario";
      toast.error(message);
    },
  });

  // --- PASSWORD: REQUEST RESET (Paso 1) ---
  const requestResetMutation = useMutation({
    mutationFn: (email: string) =>
      passwordRecoveryService.initiateRecovery({ email }),
    onSuccess: () => {
      toast.info("Código enviado. Revisa tu correo.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al solicitar código";
      toast.error(message);
    },
  });

  // --- PASSWORD: CONFIRM RESET (Paso 2) ---
  const confirmResetMutation = useMutation({
    // Recibimos exactamente el DTO, ya no un objeto genérico
    mutationFn: (data: ResetPasswordRequest) =>
      passwordRecoveryService.resetPassword(data),
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente.");
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al cambiar contraseña";
      toast.error(message);
    },
  });

  return {
    // Login
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLoginError: loginMutation.isError,

    // Register
    registerUser: registerMutation.mutate,
    isRegisterPending: registerMutation.isPending,

    // Reset Password
    requestReset: requestResetMutation.mutate,
    isRequestPending: requestResetMutation.isPending,

    confirmReset: confirmResetMutation.mutate,
    isConfirmPending: confirmResetMutation.isPending,
  };
};
