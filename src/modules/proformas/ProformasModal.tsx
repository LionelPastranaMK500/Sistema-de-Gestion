import { VentaGenerada } from "@/services/generadorData";
import { CloseIcon } from "@/constants/icons";
import { getActiveUser } from "@/services/auth/authServices";
import { formatearFechaComprobante } from "@/utils/documents/fechaComprobante";
import { useRef, useState } from "react";
import { generarPDF } from "@/utils/pdf/pdfConfig";

interface ProformasModalProps {
  f: VentaGenerada;
  onClose: () => void;
}

const ProformasModal = ({ f, onClose }: ProformasModalProps) => {
  const [mostrarFormatos, setMostrarFormatos] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  if (!f) return null;
  const usuario = getActiveUser();

  const formatos = [
    { id: "t80mm", label: "80mm" },
    { id: "A4", label: "A4" },
  ];

  const handleSeleccionFormato = (formato: string) => {
    generarPDF(f, formato);
    setMostrarFormatos(false);
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="z-50 relative flex flex-col bg-white shadow-xl rounded-lg w-full max-w-lg max-h-[80vh]">
        <div className="flex justify-between items-center bg-purple-600 px-4 py-3 rounded-t-lg">
          <h3 className="font-bold text-white text-lg">Proforma</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-purple-700 rounded p-1 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="bg-white shadow px-4 py-3 rounded-md text-center">
            <p className="font-bold text-gray-800 uppercase">{f.tDocumento}</p>
            <p className="text-gray-600">
              {f.serie}-{f.numero}
            </p>
            <p className="mt-2 font-extrabold text-purple-600 text-xl">
              S/ {(f.monto?.total || 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow px-4 py-3 rounded-md">
            <strong className="block text-gray-800">CLIENTE</strong>
            <p className="text-gray-700">{f.cliente}</p>
            <p className="text-gray-500">
              {f.documentoTipo} {f.documento}
            </p>
          </div>

          <div className="bg-white shadow px-4 py-3 rounded-md">
            <strong className="block text-gray-800">USUARIO</strong>
            <p className="text-gray-700">
              {usuario
                ? `${usuario.nombres} ${usuario.apellidoPaterno}`
                : "Usuario no disponible"}
            </p>
            <p className="text-gray-500">
              {formatearFechaComprobante(f.fecha)}
            </p>
          </div>

          <div className="relative gap-3 grid grid-cols-2 mt-4">
            <button className="bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold text-white text-sm">
              ENVIAR POR EMAIL
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold text-white text-sm">
              ENVIAR POR WHATSAPP
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold text-white text-sm">
              IMPRIMIR
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold text-white text-sm">
              VISUALIZAR PDF
            </button>

            <div className="relative col-span-2">
              <button
                ref={btnRef}
                className="bg-purple-600 hover:bg-purple-700 py-2 rounded w-full font-semibold text-white text-sm"
                onClick={() => setMostrarFormatos(!mostrarFormatos)}
              >
                GENERAR PDF
              </button>

              {mostrarFormatos && (
                <ul className="bottom-full right-0 left-0 z-50 absolute bg-white shadow-lg mb-1 border border-gray-200 rounded">
                  {formatos.map((formato) => (
                    <li key={formato.id}>
                      <button
                        className="hover:bg-gray-100 px-4 py-2 w-full text-left"
                        onClick={() => handleSeleccionFormato(formato.id)}
                      >
                        {formato.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <button className="bg-green-600 hover:bg-green-700 mt-3 py-2 rounded w-full font-semibold text-white">
            CONVERTIR A VENTA
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProformasModal;
