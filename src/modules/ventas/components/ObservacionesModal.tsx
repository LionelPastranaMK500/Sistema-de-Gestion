import SimpleInputModal from "@/components/modals/SimpleInputModal";
import useVentaStore from "@/stores/ventasStore";
import { BaseVentaModalProps } from "@/types/ui/modules"; // CAMBIO

const ObservacionesModal = ({ visible, onHide }: BaseVentaModalProps) => {
  const { observaciones, setObservaciones } = useVentaStore();

  return (
    <SimpleInputModal
      visible={visible}
      onHide={onHide}
      title="Agregar Observaciones"
      placeholder="OBSERVACIONES"
      value={observaciones}
      onSave={setObservaciones}
      type="textarea"
      rows={5}
    />
  );
};

export default ObservacionesModal;
