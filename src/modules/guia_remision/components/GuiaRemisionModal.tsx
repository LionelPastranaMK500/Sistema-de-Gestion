import { CloseIcon } from "@/constants/icons";
import { getActiveUser } from "@/services/auth/authServices";
import { formatearFechaComprobante } from "@/utils/documents/fechaComprobante";
import { GuiaRemisionModalProps } from "@/types/modules/guia_remision";

const GuiaRemisionModal = ({ f, onClose }: GuiaRemisionModalProps) => {
  if (!f) return null;

  const usuario = getActiveUser();
  const mostrarSelloAnulado = f.state?.toLowerCase() === "anulado";

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="z-50 relative flex flex-col bg-white shadow-xl rounded-lg w-full max-w-lg max-h-[80vh]">
        {mostrarSelloAnulado && (
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="opacity-20 px-12 py-8 border-4 border-red-600 rounded-xl font-extrabold text-red-600 text-6xl rotate-[-25deg] select-none">
              ANULADO
            </div>
          </div>
        )}

        <div className="flex justify-between items-center bg-blue-600 px-4 py-3 rounded-t-lg">
          <h3 className="font-bold text-white text-lg">
            Comprobante electrónico
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded p-1 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <div className="bg-white shadow px-4 py-3 rounded-md text-center">
            <p className="font-bold text-gray-800 uppercase">
              GUÍA DE REMISIÓN REMITENTE
            </p>
            <p className="text-gray-600 font-medium text-lg">
              {f.serie}-{String(f.numero).padStart(6, "0")}
            </p>
          </div>

          <div className="bg-white shadow px-4 py-3 rounded-md">
            <strong className="block text-gray-800 text-sm mb-1">
              DESTINATARIO
            </strong>
            <p className="text-gray-700 font-medium">{f.cliente}</p>
            <p className="text-gray-500 text-sm">
              {f.documentoTipo} {f.documento}
            </p>
          </div>

          <div className="bg-white shadow px-4 py-3 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="block text-gray-800 text-sm mb-1">
                  FECHA EMISIÓN
                </strong>
                <p className="text-gray-600 text-sm">
                  {formatearFechaComprobante(f.fecha)}
                </p>
              </div>
              <div>
                <strong className="block text-gray-800 text-sm mb-1">
                  MOTIVO
                </strong>
                <p className="text-gray-600 text-sm uppercase">
                  {f.motivo || "VENTA"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-3 rounded-md">
            <strong className="block text-gray-800 text-sm mb-1">
              USUARIO
            </strong>
            <p className="text-gray-700 text-sm">
              {usuario
                ? `${usuario.nombres} ${usuario.apellidoPaterno}`
                : f.usuario || "Desconocido"}
            </p>
          </div>

          <div className="bg-white shadow px-4 py-3 rounded-md flex justify-between items-center">
            <strong className="text-gray-800 text-sm">ESTADO SUNAT</strong>
            <span
              className={`font-bold px-3 py-1 rounded-full text-xs ${
                f.state === "ACEPTADO"
                  ? "bg-green-100 text-green-700"
                  : f.state === "ANULADO"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {f.state || "PENDIENTE"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-semibold text-white text-sm transition-colors">
              ENVIAR POR EMAIL
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-semibold text-white text-sm transition-colors">
              ENVIAR POR WHATSAPP
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-semibold text-white text-sm transition-colors">
              VISUALIZAR PDF
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-semibold text-white text-sm transition-colors">
              DESCARGAR PDF
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-semibold text-white text-sm transition-colors">
              DESCARGAR XML
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 py-2.5 rounded font-semibold text-white text-sm transition-colors">
              DESCARGAR CDR
            </button>
          </div>

          {f.state !== "ANULADO" && (
            <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded font-bold mt-2 transition-colors">
              DAR DE BAJA (ANULAR)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuiaRemisionModal;
