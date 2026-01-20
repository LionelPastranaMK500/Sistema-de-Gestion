import { useQuery } from "@tanstack/react-query";
import { configuracionService } from "@/services/api/configuracion.service";

export const useConfiguracionQueries = () => {
  // Obtener todas las configuraciones (Admin)
  const useListAll = () =>
    useQuery({
      queryKey: ["configuracion", "list"],
      queryFn: () => configuracionService.listAll(),
      select: (response) => response.data,
    });

  // Obtener por ID
  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["configuracion", "detail", id],
      queryFn: () => configuracionService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  // Obtener configuración del usuario autenticado actualmente
  const useMyConfig = () =>
    useQuery({
      queryKey: ["configuracion", "me"],
      queryFn: () => configuracionService.findByCurrentUser(),
      select: (response) => response.data,
      staleTime: 1000 * 60 * 30, // 30 minutos
    });

  // Buscar configuración por ID de usuario específico
  const useByUsuario = (usuarioId: number) =>
    useQuery({
      queryKey: ["configuracion", "usuario", usuarioId],
      queryFn: () => configuracionService.findByUsuario(usuarioId),
      enabled: !!usuarioId,
      select: (response) => response.data,
    });

  return {
    useListAll,
    useGetById,
    useMyConfig,
    useByUsuario,
  };
};
