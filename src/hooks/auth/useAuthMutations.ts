import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "@/utils/notifications/notify";
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
      notifySuccess("Bienvenido al sistema"); //
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al iniciar sesión";
      notifyError(message); //
    },
  });

  // --- REGISTER ---
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      notifySuccess("Cuenta creada exitosamente. Por favor inicia sesión."); //
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al registrar el usuario";
      notifyError(message);
    },
  });

  // --- PASSWORD: REQUEST RESET (Paso 1) ---
  const requestResetMutation = useMutation({
    mutationFn: (email: string) =>
      passwordRecoveryService.initiateRecovery({ email }),
    onSuccess: () => {
      notifyInfo("Código enviado. Revisa tu correo.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al solicitar código";
      notifyError(message);
    },
  });

  // --- PASSWORD: CONFIRM RESET (Paso 2) ---
  const confirmResetMutation = useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      passwordRecoveryService.resetPassword(data),
    onSuccess: () => {
      notifySuccess("Contraseña actualizada correctamente.");
      navigate("/");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Error al cambiar contraseña";
      notifyError(message);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isLoginError: loginMutation.isError,

    registerUser: registerMutation.mutate,
    isRegisterPending: registerMutation.isPending,

    requestReset: requestResetMutation.mutate,
    isRequestPending: requestResetMutation.isPending,

    confirmReset: confirmResetMutation.mutate,
    isConfirmPending: confirmResetMutation.isPending,
  };
};
