import SimpleInputModal from "@/components/modals/SimpleInputModal";
import useVentaStore from "@/stores/ventasStore";

interface PlacaModalProps {
  visible: boolean;
  onHide: () => void;
}

const PlacaModal = ({ visible, onHide }: PlacaModalProps) => {
  const { placa, setPlaca } = useVentaStore();

  return (
    <SimpleInputModal
      visible={visible}
      onHide={onHide}
      title="Agregar Placa Vehicular"
      placeholder="PLACA VEHICULAR"
      value={placa}
      onSave={setPlaca}
    />
  );
};

export default PlacaModal;
