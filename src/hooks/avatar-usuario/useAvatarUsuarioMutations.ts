import { useMutation, useQueryClient } from "@tanstack/react-query";
import { avatarUsuarioService } from "@/services/api/avatarUsuario.service";
import { AvatarUsuarioDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useAvatarUsuarioMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: ["avatar-usuario", "list"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (file: File) => avatarUsuarioService.create(file),
      onSuccess: () => {
        notifySuccess("Avatar subido correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al subir el avatar";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: AvatarUsuarioDto) => avatarUsuarioService.update(dto),
      onSuccess: () => {
        notifySuccess("Avatar actualizado correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar el avatar";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => avatarUsuarioService.delete(id),
      onSuccess: () => {
        notifySuccess("Avatar eliminado correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar el avatar";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
