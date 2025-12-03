import SimpleInputModal from "@/components/modals/SimpleInputModal";
import useVentaStore from "@/stores/ventasStore";
import { BaseVentaModalProps } from "@/types/ui/modules";

const PlacaModal = ({ visible, onHide }: BaseVentaModalProps) => {
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
