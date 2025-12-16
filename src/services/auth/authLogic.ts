import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";
import { LoginRequest, RegisterRequest } from "@/types/models/auth";

/**
 * Hook para la lógica de Login
 */
export const useLoginLogic = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      setSession(response.access_token, response.refresh_token);
      notifySuccess("Bienvenido al sistema");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Credenciales incorrectas";
      notifyError(msg);
    },
  });
};

/**
 * Hook para la lógica de Registro
 */
export const useRegisterLogic = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      notifySuccess("Usuario registrado. Por favor inicia sesión.");
      navigate("/");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Error al registrar usuario";
      notifyError(msg);
    },
  });
};

/**
 * Hook para la lógica de Cerrar Sesión
 */
export const useLogoutLogic = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  return () => {
    logoutStore();
    notifySuccess("Sesión cerrada");
    navigate("/");
  };
};

/**
 * Paso 1: Solicitar código de recuperación
 */
export const useRequestResetLogic = () => {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onSuccess: () => {
      notifySuccess("Se envió un código de recuperación a tu correo");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Error al solicitar código";
      notifyError(msg);
    },
  });
};

/**
 * Paso 2: Verificar el código ingresado
 */
export const useVerifyCodeLogic = () => {
  return useMutation({
    mutationFn: (data: { email: string; code: string }) =>
      authService.verifyResetCode(data.email, data.code),
    onSuccess: () => {
      notifySuccess("Código verificado correctamente");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Código incorrecto o expirado";
      notifyError(msg);
    },
  });
};

/**
 * Paso 3: Restablecer la contraseña
 */
export const useResetPasswordLogic = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: { email: string; code: string; nuevaClave: string }) =>
      authService.resetPassword(data.email, data.code, data.nuevaClave),
    onSuccess: () => {
      notifySuccess("Contraseña actualizada correctamente");
      navigate("/"); // Redirige al login
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Error al restablecer contraseña";
      notifyError(msg);
    },
  });
};
