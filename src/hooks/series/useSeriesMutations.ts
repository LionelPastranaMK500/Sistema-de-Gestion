import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seriesService } from "@/services/api/series.service";
import { SerieCreateDto, SerieDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useSeriesMutations = () => {
  const queryClient = useQueryClient();

  const invalidateSeries = () => {
    queryClient.invalidateQueries({ queryKey: ["series"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: SerieCreateDto) => seriesService.create(dto),
      onSuccess: () => {
        notifySuccess("Serie registrada correctamente");
        invalidateSeries();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al registrar la serie";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: SerieDto) => seriesService.update(dto),
      onSuccess: () => {
        notifySuccess("Serie actualizada correctamente");
        invalidateSeries();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al actualizar la serie";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => seriesService.delete(id),
      onSuccess: () => {
        notifySuccess("Serie eliminada correctamente");
        invalidateSeries();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al eliminar la serie";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
