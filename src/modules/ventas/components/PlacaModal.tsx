import SimpleInputModal from "@components/modals/SimpleInputModal";
import useVentaStore from "@stores/ventasStore";

const PlacaModal = ({ visible, onHide }) => {
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