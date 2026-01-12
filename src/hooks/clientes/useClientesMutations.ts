import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clientesService } from "@/services/api/clientes.service";
import { ClienteCreateDto, ClienteUpdateDto } from "@/types/models/cliente";

export const useClientesMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Crea un nuevo cliente.
   * Endpoint: POST /api/v1/clientes
   * Uso: Formulario "Registrar Nuevo". Invalida la lista para refrescar.
   */
  const createCliente = useMutation({
    mutationFn: (data: ClienteCreateDto) => clientesService.create(data),
    onSuccess: () => {
      toast.success("Cliente registrado correctamente");
      // CORRECCIÓN: Usamos la sintaxis de objeto { queryKey: [...] }
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Error al registrar cliente";
      toast.error(msg);
    },
  });

  /**
   * Actualiza un cliente existente.
   * Endpoint: PUT /api/v1/clientes/{id}
   * Uso: Formulario de edición.
   */
  const updateCliente = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClienteUpdateDto }) =>
      clientesService.update(id, data),
    onSuccess: () => {
      toast.success("Cliente actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente"] });
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Error al actualizar cliente";
      toast.error(msg);
    },
  });

  /**
   * Elimina un cliente.
   * Endpoint: DELETE /api/v1/clientes/{id}
   * Uso: Botón de borrar en la tabla.
   */
  const deleteCliente = useMutation({
    mutationFn: (id: number) => clientesService.delete(id),
    onSuccess: () => {
      toast.success("Cliente eliminado");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Error al eliminar cliente";
      toast.error(msg);
    },
  });

  return {
    createCliente,
    updateCliente,
    deleteCliente,
  };
};
