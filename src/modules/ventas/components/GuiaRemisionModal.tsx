import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import AddListModal from "@/components/modals/AddListModal";
import useVentaStore from "@/stores/ventasStore";
import { DynamicItem } from "@/hooks/data/useDynamicList";

interface GuiaRemisionModalProps {
  visible: boolean;
  onHide: () => void;
}

// Extendemos DynamicItem para compatibilidad con AddListModal
// Y nos aseguramos que tenga las propiedades que el store espera
interface GuiaItem extends DynamicItem {
  tipo: string; // Hacemos obligatorios estos campos
  serie: string;
  numero: string;
  [key: string]: any;
}

const GuiaRemisionModal = ({ visible, onHide }: GuiaRemisionModalProps) => {
  const { guiasRemision, setGuiasRemision } = useVentaStore();

  // Inicializamos el estado asegurando que los datos del store se mapeen a GuiaItem
  const [guias, setGuias] = useState<GuiaItem[]>([]);

  const [tipo, setTipo] = useState("REMITENTE");
  const [serie, setSerie] = useState("");
  const [numero, setNumero] = useState("");

  useEffect(() => {
    if (visible) {
      // Mapeamos los datos del store añadiendo tempId si falta
      const mappedGuias = (guiasRemision || []).map(
        (g: any, index: number) => ({
          ...g,
          tempId: g.tempId || Date.now() + index,
          // Aseguramos que los campos existan o tengan defaults
          tipo: g.tipo || "REMITENTE",
          serie: g.serie || "",
          numero: g.numero || "",
        })
      ) as GuiaItem[];

      setGuias(mappedGuias);
    }
  }, [visible, guiasRemision]);

  const handleSave = (itemsToSave: GuiaItem[]) => {
    // Al guardar en el store, TypeScript podría quejarse si la interfaz del store es diferente
    // Hacemos un cast a any[] o ajustamos la interfaz del store.
    // Como el store usa una interfaz genérica para guias, esto debería funcionar.
    setGuiasRemision(itemsToSave);
    onHide();
  };

  const tiposGuia = [
    { label: "REMITENTE", value: "REMITENTE" },
    { label: "TRANSPORTISTA", value: "TRANSPORTISTA" },
  ];

  const handleAddItem = () => {
    const nuevaGuia: GuiaItem = {
      tipo,
      serie,
      numero,
      tempId: Date.now(), // tempId obligatorio por DynamicItem
      id: Date.now(),
    };
    // Actualizamos el estado local de la lista
    setGuias((prev) => [...prev, nuevaGuia]);

    // Limpiamos campos
    setSerie("");
    setNumero("");
    setTipo("REMITENTE");
  };

  const handleRemoveItem = (id: string | number) => {
    // Filtramos por tempId (que es lo que usa AddListModal para identificar items nuevos)
    // o por id si ya existe.
    setGuias((prev) => prev.filter((g) => g.tempId !== id && g.id !== id));
  };

  const renderFormFields = () => (
    <>
      <div>
        <label className="block mb-2 text-sm text-gray-600">Tipo</label>
        <Dropdown
          value={tipo}
          options={tiposGuia}
          onChange={(e) => setTipo(e.value)}
          className="w-full"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-2 text-sm text-gray-600">Serie *</label>
          <InputText
            value={serie}
            onChange={(e) => setSerie(e.target.value.toUpperCase())}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm text-gray-600">Número *</label>
          <div className="flex gap-2">
            <InputText
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              type="number"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              icon="pi pi-minus-circle"
              onClick={() => {
                setSerie("");
                setNumero("");
              }}
              className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-full !w-10 !h-10 !p-0"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderItemDisplay = (guia: GuiaItem) => (
    <div className="flex gap-2 flex-1">
      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
        <label className="block text-xs text-gray-600 mb-1">Tipo *</label>
        <span className="text-sm text-gray-700">{guia.tipo}</span>
      </div>
      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
        <label className="block text-xs text-gray-600 mb-1">Serie *</label>
        <span className="text-sm text-gray-700">{guia.serie}</span>
      </div>
      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-lg">
        <label className="block text-xs text-gray-600 mb-1">Número *</label>
        <span className="text-sm text-gray-700">{guia.numero}</span>
      </div>
    </div>
  );

  return (
    <AddListModal
      visible={visible}
      onHide={onHide}
      onSave={handleSave}
      title="Guías de remisión"
      addButtonLabel="AGREGAR GUÍA DE REMISIÓN"
      items={guias}
      setItems={setGuias}
      renderFormFields={renderFormFields}
      renderItemDisplay={renderItemDisplay}
      validateForm={() => !!(serie && numero)}
      onAddItem={handleAddItem}
      onRemoveItem={handleRemoveItem}
      width="450px"
    />
  );
};

export default GuiaRemisionModal;
