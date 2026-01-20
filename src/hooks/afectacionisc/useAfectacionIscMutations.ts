import { useMutation, useQueryClient } from "@tanstack/react-query";
import { afectacionIscService } from "@/services/api/afectacionIsc.service";
import { AfectacionISCCreateDto, AfectacionISCDto } from "@/types/models";
import { notifySuccess, notifyError } from "@/utils/notifications/notify";

export const useAfectacionIscMutations = () => {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: ["afectacion-isc", "list"] });
  };

  const useCreate = () =>
    useMutation({
      mutationFn: (dto: AfectacionISCCreateDto) =>
        afectacionIscService.create(dto),
      onSuccess: () => {
        notifySuccess("Afectación ISC creada correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Error al crear la afectación ISC";
        notifyError(msg);
      },
    });

  const useUpdate = () =>
    useMutation({
      mutationFn: (dto: AfectacionISCDto) => afectacionIscService.update(dto),
      onSuccess: () => {
        notifySuccess("Afectación ISC actualizada correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al actualizar la afectación ISC";
        notifyError(msg);
      },
    });

  const useDelete = () =>
    useMutation({
      mutationFn: (id: number) => afectacionIscService.delete(id),
      onSuccess: () => {
        notifySuccess("Afectación ISC eliminada correctamente");
        invalidateList();
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message ||
          "Error al eliminar la afectación ISC";
        notifyError(msg);
      },
    });

  return {
    useCreate,
    useUpdate,
    useDelete,
  };
};
