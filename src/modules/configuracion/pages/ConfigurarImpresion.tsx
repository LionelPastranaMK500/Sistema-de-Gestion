import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { KeyboardArrowLeftIcon } from "@/constants/icons";
import { getImpresionConfig } from "@/services/generadorData";
import useImpresionStore from "@/stores/impresionStore";

const FORMATO_OPTIONS = [
  { label: "A4", value: "A4" },
  { label: "A5", value: "A5" },
  { label: "Ticket 80mm", value: "t80mm" },
];
const DECIMAL_OPTIONS = [
  { label: "0 decimales", value: 0 },
  { label: "2 decimales", value: 2 },
  { label: "3 decimales", value: 3 },
];

interface ColumnsConfig {
  disponibles: string[];
  visibles: string[];
}

interface ColumnaSelectorProps {
  formato: string;
  initialColumns: ColumnsConfig;
  onUpdate: (newCols: ColumnsConfig) => void;
  onSave: (formatoKey: string) => void;
}

const ColumnaSelector = ({
  formato,
  initialColumns,
  onUpdate,
  onSave,
}: ColumnaSelectorProps) => {
  const [disponibles, setDisponibles] = useState<string[]>(
    initialColumns.disponibles
  );
  const [visibles, setVisibles] = useState<string[]>(initialColumns.visibles);

  useEffect(() => {
    setDisponibles(initialColumns.disponibles);
    setVisibles(initialColumns.visibles);
  }, [initialColumns]);

  const handleMoveColumn = (
    item: string,
    source: "disponibles" | "visibles",
    target: "disponibles" | "visibles"
  ) => {
    let newDisponibles = disponibles.filter((i) => i !== item);
    let newVisibles = visibles.filter((i) => i !== item);

    if (source === "disponibles" && target === "visibles") {
      newVisibles = [...newVisibles, item];
    } else if (source === "visibles" && target === "disponibles") {
      newDisponibles = [...newDisponibles, item];
    }

    setDisponibles(newDisponibles);
    setVisibles(newVisibles);
    onUpdate({ disponibles: newDisponibles, visibles: newVisibles });
  };

  const ListContainer = ({
    title,
    items,
    source,
  }: {
    title: string;
    items: string[];
    source: "disponibles" | "visibles";
  }) => (
    <div>
      <h4 className="font-semibold text-gray-600 mb-2">
        {title.toUpperCase()}
      </h4>
      <div className="h-64 border border-gray-300 rounded-md overflow-y-auto bg-white">
        <ul className="divide-y divide-gray-200">
          {items.map((item, index) => (
            <li
              key={index}
              className={`px-4 py-2 text-sm text-gray-700 cursor-pointer transition hover:bg-gray-50`}
              onClick={() =>
                handleMoveColumn(
                  item,
                  source,
                  source === "disponibles" ? "visibles" : "disponibles"
                )
              }
              title={`Click para mover a ${
                source === "disponibles" ? "Visibles" : "Disponibles"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{`Configuración formato ${formato}`}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ListContainer
          title="Columnas disponibles"
          items={disponibles}
          source="disponibles"
        />
        <ListContainer
          title="Columnas visibles"
          items={visibles}
          source="visibles"
        />
      </div>
      <div className="mt-8">
        <Button
          label="GUARDAR"
          onClick={() => onSave(formato)}
          className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-6 !rounded-lg"
        />
      </div>
    </div>
  );
};

export default function ConfigurarImpresion() {
  const navigate = useNavigate();
  const config = useImpresionStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initialData = getImpresionConfig();
    config.loadInitialConfig(initialData);
  }, []);

  const handleSaveBasica = () => {
    setLoading(true);
    // Simulación
    setTimeout(() => setLoading(false), 500);
  };

  const handleSaveFormato = (formatoKey: string) => {
    console.log("Guardando formato", formatoKey);
  };

  const handleBasicaChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      config.updateBasica({ [name]: value } as any);
    },
    [config]
  );

  const handleVolver = () => {
    navigate("/configuracion");
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-gray-50 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6 flex-shrink-0">
        <button
          onClick={handleVolver}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Volver a configuración"
        >
          <KeyboardArrowLeftIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Impresión</h2>
      </div>

      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          Configuración básica
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Formato de impresión por defecto
            </label>
            <Dropdown
              name="formatoDefecto"
              value={config.formatoDefecto}
              options={FORMATO_OPTIONS}
              onChange={handleBasicaChange}
              placeholder="Seleccione formato"
              className="w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              optionLabel="label"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número máximo de decimales a usar
            </label>
            <Dropdown
              name="decimales"
              value={config.decimales}
              options={DECIMAL_OPTIONS}
              onChange={handleBasicaChange}
              placeholder="Seleccione decimales"
              className="w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              optionLabel="label"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Información cabecera
          </label>
          <InputTextarea
            name="infoCabecera"
            rows={3}
            value={config.infoCabecera}
            onChange={handleBasicaChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cuentas bancarias
          </label>
          <InputTextarea
            name="cuentasBancarias"
            rows={5}
            value={config.cuentasBancarias}
            onChange={handleBasicaChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Información pie de página
          </label>
          <InputTextarea
            name="infoPiePagina"
            rows={2}
            value={config.infoPiePagina}
            onChange={handleBasicaChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
        <div className="mt-8">
          <Button
            label="GUARDAR"
            icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
            onClick={handleSaveBasica}
            disabled={loading}
            className="!bg-blue-600 hover:!bg-blue-700 !text-white !font-bold !py-2 !px-6 !rounded-lg"
          />
        </div>
      </div>

      <ColumnaSelector
        formato="A4"
        initialColumns={config.formatos.A4}
        onUpdate={(newCols) => config.updateFormato("A4", newCols)}
        onSave={handleSaveFormato}
      />

      <ColumnaSelector
        formato="A5"
        initialColumns={config.formatos.A5}
        onUpdate={(newCols) => config.updateFormato("A5", newCols)}
        onSave={handleSaveFormato}
      />
    </div>
  );
}
