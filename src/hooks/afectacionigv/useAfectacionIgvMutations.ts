import { useMutation, useQueryClient } from "@tanstack/react-query";
import { afectacionIgvService } from "@/services/api/afectacionIgv.service";
import { AfectacionIGVCreateDto, AfectacionIGVDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useAfectacionIgvMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: ["afectacion-igv", "list"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: AfectacionIGVCreateDto) =>
        afectacionIgvService.create(dto),
      onSuccess: () => {
        notifySuccess("Afectación IGV creada correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear la afectación";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: AfectacionIGVDto) => afectacionIgvService.update(dto),
      onSuccess: () => {
        notifySuccess("Afectación IGV actualizada correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar la afectación";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => afectacionIgvService.delete(id),
      onSuccess: () => {
        notifySuccess("Afectación eliminada correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar la afectación";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
