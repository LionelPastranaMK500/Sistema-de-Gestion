import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usuariosService } from "@/services/api/usuarios.service";
import { AddUserRequest } from "@/types/models/usuario";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useUsuarioMutations = () => {
  const queryClient = useQueryClient();

  const invalidateUsuarios = () => {
    queryClient.invalidateQueries({ queryKey: ["usuarios"] });
  };

  // Agregar nuevo usuario (Solo ADMIN)
  const useAddUser = () =>
    useMutation({
      mutationFn: (req: AddUserRequest) => usuariosService.addUser(req),
      onSuccess: () => {
        notifySuccess("Usuario creado y rol asignado correctamente");
        invalidateUsuarios();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear el usuario";
        notifyError(msg);
      },
    });

  return {
    useAddUser,
  };
};
