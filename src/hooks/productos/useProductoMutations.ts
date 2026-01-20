import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productosService } from "@/services/api/productos.service";
import { ProductoCreateDto, ProductoUpdateDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useProductoMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProductos = () => {
    // Invalidamos todo lo relacionado a productos para forzar recarga de stock y precios
    queryClient.invalidateQueries({ queryKey: ["productos"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: ProductoCreateDto) => productosService.create(dto),
      onSuccess: () => {
        notifySuccess("Producto creado exitosamente");
        invalidateProductos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear el producto";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: ProductoUpdateDto) => productosService.update(dto),
      onSuccess: () => {
        notifySuccess("Producto actualizado correctamente");
        invalidateProductos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar el producto";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => productosService.delete(id),
      onSuccess: () => {
        notifySuccess("Producto eliminado correctamente");
        invalidateProductos();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar el producto";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
