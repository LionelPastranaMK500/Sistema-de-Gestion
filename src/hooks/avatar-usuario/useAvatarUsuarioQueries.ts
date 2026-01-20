import { useQuery } from "@tanstack/react-query";
import { avatarUsuarioService } from "@/services/api/avatarUsuario.service";

export const useAvatarUsuarioQueries = () => {
  const useListAll = () =>
    useQuery({
      queryKey: ["avatar-usuario", "list"],
      queryFn: () => avatarUsuarioService.listAll(),
      select: (response) => response.data,
    });

  const useGetById = (id: number) =>
    useQuery({
      queryKey: ["avatar-usuario", "detail", id],
      queryFn: () => avatarUsuarioService.getById(id),
      enabled: !!id,
      select: (response) => response.data,
    });

  return {
    useListAll,
    useGetById,
  };
};
