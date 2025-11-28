import { Dialog } from "primereact/dialog";

// Usamos un genérico T para que las opciones sean flexibles
interface SelectionModalProps<T> {
  visible: boolean;
  onHide: () => void;
  title: string;
  options?: T[];
  optionLabel?: keyof T; // Debe ser una clave del objeto T
  optionValue?: keyof T; // Debe ser una clave del objeto T
  onSelect: (option: T) => void;
}

const SelectionModal = <T extends Record<string, any>>({
  visible,
  onHide,
  title,
  options = [],
  optionLabel = "name",
  // optionValue = "value", // No se usa realmente en el render actual
  onSelect,
}: SelectionModalProps<T>) => {
  const handleSelect = (option: T) => {
    onSelect(option);
    onHide();
  };

  const headerContent = <h2 className="text-xl font-bold">{title}</h2>;

  return (
    <Dialog
      header={headerContent}
      visible={visible}
      style={{ width: "400px" }}
      modal
      draggable={false}
      onHide={onHide}
      headerClassName="!p-4 bg-blue-700 text-white rounded-t-lg"
      contentClassName="p-5 bg-white"
    >
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition-colors duration-200 font-medium text-gray-700 hover:text-blue-700"
          >
            {String(option[optionLabel])}
          </button>
        ))}
      </div>
    </Dialog>
  );
};

export default SelectionModal;
