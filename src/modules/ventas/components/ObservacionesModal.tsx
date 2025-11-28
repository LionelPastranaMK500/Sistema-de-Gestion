import SimpleInputModal from "@/components/modals/SimpleInputModal";
import useVentaStore from "@/stores/ventasStore";

interface ObservacionesModalProps {
  visible: boolean;
  onHide: () => void;
}

const ObservacionesModal = ({ visible, onHide }: ObservacionesModalProps) => {
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
