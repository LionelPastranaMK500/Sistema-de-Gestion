import { useQuery } from "@tanstack/react-query";
import { usuariosService } from "@/services/api/usuarios.service";
import { UsuarioResponse, UsuarioSummaryDto } from "@/types/models/usuario";

export const useUsuarioQueries = () => {
  // Listar todos los usuarios (Solo para ADMIN según tu Java)
  const useGetUsuarios = () =>
    useQuery<UsuarioResponse[]>({
      queryKey: ["usuarios", "list"],
      queryFn: () => usuariosService.getUsuarios(),
    });

  // Obtener el estado de bloqueo/intentos (útil para soporte técnico)
  const useGetUserStatus = (id: number) =>
    useQuery<string>({
      queryKey: ["usuarios", "status", id],
      queryFn: () => usuariosService.getUserStatus(id),
      enabled: !!id,
    });

  // Obtener el resumen del usuario (para perfiles o info rápida)
  const useGetUserSummary = (id: number) =>
    useQuery<UsuarioSummaryDto>({
      queryKey: ["usuarios", "summary", id],
      queryFn: () => usuariosService.getUserSummary(id),
      enabled: !!id,
    });

  return {
    useGetUsuarios,
    useGetUserStatus,
    useGetUserSummary,
  };
};
