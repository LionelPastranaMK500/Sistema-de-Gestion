import { useState, useEffect, useRef, useMemo } from "react";
import { Calendar } from "primereact/calendar";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { configCalendar } from "@/utils/calendar/configCalendar";

// Servicios y Lógica
import { clientesService, productosService } from "@/services/api";
import {
  useVentaData,
  useVentaMutations,
} from "@/services/ventas/ventas.logic";
import useVentaStore from "@/stores/ventasStore";

// Tipos
import { PdfFormat } from "@/types/utils/pdf";
import { VentaComponent } from "@/types/modules/ventas";

// Utilidades
import { visualizarPDF } from "@/utils/pdf/pdfViewer";
import {
  PermIdentityTwoToneIcon,
  CloseIcon,
  MenuIcon,
} from "@/constants/icons";
import { componentsVentas } from "@/constants/menuItems";

// Componentes
import PlacaModal from "./components/PlacaModal";
import OrdenCompraModal from "./components/OrdenCompraModal";
import ObservacionesModal from "./components/ObservacionesModal";
import CondicionPagoModal from "./components/CondicionPagoModal";
import DatosAdicionalesModal from "./components/DatosAdicionalesModal";
import GuiaRemisionModal from "./components/GuiaRemisionModal";

const VentasView = () => {
  // --- 1. STORE ---
  const {
    clienteVenta,
    setClienteVenta,
    productosVenta,
    agregarProducto,
    removerProducto,
    actualizarCantidad,
    placa,
    ordenCompra,
    observaciones,
    condicionPago,
    datosAdicionales,
    guiasRemision,
  } = useVentaStore();

  // --- 2. LOGIC HOOKS ---
  const { monedas, tiposDocumento, series, isLoadingMaestros } = useVentaData();
  const { crearVenta, isCrearVentaLoading } = useVentaMutations();

  // --- 3. ESTADO LOCAL ---
  const [fechaEmision, setFechaEmision] = useState<Date | null>(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState<Date | null>(null);

  const [clienteInput, setClienteInput] = useState("");
  const [clientesFiltrados, setClientesFiltrados] = useState<any[]>([]);

  const [productoInput, setProductoInput] = useState<string>("");
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);

  const [tipoDocId, setTipoDocId] = useState("");
  const [serieId, setSerieId] = useState("");
  const [monedaId, setMonedaId] = useState("PEN");
  const [globalDiscount, setGlobalDiscount] = useState(0);

  const [proformaChecked, setProformaChecked] = useState(false);

  // Variables PDF
  const [visiblePreview, setVisiblePreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [tipoPdf, setTipoPdf] = useState<PdfFormat>("A4");

  // Modales
  const [showPlacaModal, setShowPlacaModal] = useState(false);
  const [showOrdenCompraModal, setShowOrdenCompraModal] = useState(false);
  const [showObservacionesModal, setShowObservacionesModal] = useState(false);
  const [modalsOtros, setModalsOtros] = useState<Record<string, boolean>>({});

  const acClienteRef = useRef<AutoComplete>(null);
  const menuOtrosRef = useRef<Menu>(null);

  // --- EFECTOS ---
  useEffect(() => {
    configCalendar();
  }, []);

  const formatCliente = (c: any) => {
    if (!c) return "";
    const doc = c.documento || c.numeroDocumento || "";
    const nombre = c.razonSocial || c.nombre || "";
    return `${doc} - ${nombre}`;
  };

  useEffect(() => {
    if (!clienteVenta) {
      setClienteInput("");
    } else {
      setClienteInput(formatCliente(clienteVenta));
    }
  }, [clienteVenta]);

  useEffect(() => {
    if (series && series.length > 0 && !serieId) {
      const first = series[0] as any;
      setSerieId(first.serie || first.id);
    }
  }, [series, serieId]);

  // --- CÁLCULOS ---
  const { totalGeneral, totalsDesglose } = useMemo(() => {
    const subtotal = productosVenta.reduce(
      (acc, p: any) => acc + (p.totalVenta || 0),
      0
    );
    // Aplicar descuento global
    const totalConDescuento = subtotal * (1 - globalDiscount / 100);

    // Desglose Base/IGV
    const opGravada = totalConDescuento / 1.18;
    const igv = totalConDescuento - opGravada;

    return {
      totalGeneral: totalConDescuento,
      totalsDesglose: {
        gravado: opGravada,
        igv: igv,
      },
    };
  }, [productosVenta, globalDiscount]);

  // --- HANDLERS BÚSQUEDA ---
  const HEADER = { __type: "header" };
  const TIPS = { __type: "tips" };

  const buscarClientes = async (e: AutoCompleteCompleteEvent) => {
    try {
      const response = await clientesService.getAll({ q: e.query });
      // Manejo seguro de la respuesta Axios vs Array directo
      const data = (response as any).data || response;
      const lista = Array.isArray(data) ? data : data.content || [];
      setClientesFiltrados([HEADER, ...lista, TIPS]);
    } catch (error) {
      setClientesFiltrados([HEADER, TIPS]);
    }
  };

  const buscarProductos = async (e: AutoCompleteCompleteEvent) => {
    try {
      const response = await productosService.search({ q: e.query });
      const data = (response as any).data || response;
      const lista = Array.isArray(data) ? data : data.content || [];
      setProductosFiltrados(lista);
    } catch (error) {
      setProductosFiltrados([]);
    }
  };

  const handleSelectCliente = (e: AutoCompleteSelectEvent) => {
    const selected = e.value;
    if (selected && typeof selected !== "string" && !selected.__type) {
      setClienteVenta(selected);
    }
    setTimeout(() => setClientesFiltrados([]), 100);
  };

  const handleSelectProducto = (e: AutoCompleteSelectEvent) => {
    const selected = e.value;
    if (selected && typeof selected !== "string") {
      agregarProducto(selected, 1);
      setProductoInput("");
    }
  };

  const handleProformaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProformaChecked(e.target.checked);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalDiscount(Number(e.target.value));
  };

  // --- PDF GENERATOR (RESTAURADO) ---
  const handleVistaPrevia = async () => {
    const docCliente =
      (clienteVenta as any)?.documento ||
      (clienteVenta as any)?.numeroDocumento ||
      "00000000";
    const nomCliente =
      (clienteVenta as any)?.razonSocial ||
      (clienteVenta as any)?.nombre ||
      "CLIENTE VARIOS";
    const dirCliente = (clienteVenta as any)?.direccion || "Sin dirección";

    const payloadPdf = {
      documento: docCliente,
      documentoTipo: (clienteVenta as any)?.tipoDocumento || "DNI",
      cliente: nomCliente,
      direccion: dirCliente,
      tDocumento: proformaChecked ? "PROFORMA" : "PRE-VENTA",
      serie: serieId || "###",
      numero: "#####",

      items: productosVenta.map((p: any) => ({
        ...p,
        descripcion: p.descripcion || p.nombre,
        precioUnitario: p.precioVenta,
        total: p.totalVenta,
      })),

      fecha: fechaEmision || new Date(),
      fechaVencimiento: fechaVencimiento
        ? fechaVencimiento.toISOString()
        : undefined,

      monto: {
        total: totalGeneral,
        gravado: totalsDesglose.gravado,
        igv: totalsDesglose.igv,
        exonerado: 0,
        inafecto: 0,
        gratuito: 0,
        isc: 0,
        icbper: 0,
      },

      state: "BORRADOR",
      tipoOperacion: "VENTA",
      sucursal: "PRINCIPAL",
      usuario: "DEMO",
      placaVehiculo: placa,
      ordenCompra: ordenCompra,
      observaciones: observaciones,
      condicionPago: condicionPago,
      datosAdicionales: datosAdicionales,
      guiasRemision: guiasRemision,
    };

    try {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      const blob = await visualizarPDF(payloadPdf, tipoPdf);
      const newUrl = URL.createObjectURL(blob);
      setPdfUrl(newUrl);
      setVisiblePreview(true);
    } catch (error) {
      console.error("Error PDF:", error);
    }
  };

  const handleHideModalOtros = (action: string) =>
    setModalsOtros((prev) => ({ ...prev, [action]: false }));

  const clienteItemTemplate = (opt: any) => {
    if (opt?.__type === "header")
      return <div className="p-2 bg-gray-100 font-bold">Resultados</div>;
    if (opt?.__type === "tips")
      return (
        <div className="p-2 text-xs text-gray-500">Busca por RUC/Nombre</div>
      );
    return (
      <div className="p-2 border-b hover:bg-gray-50 cursor-pointer">
        <div className="font-bold text-sm">{opt.razonSocial || opt.nombre}</div>
        <div className="text-xs text-gray-500">
          {opt.documento || opt.numeroDocumento}
        </div>
      </div>
    );
  };

  const allComponents = componentsVentas as VentaComponent[];
  const otrosModalItems = allComponents
    .filter((c) => !c.isInput)
    .map(({ name, action }) => ({
      label: `${name} ${
        (action === "guia" && guiasRemision?.length) ||
        (action === "adicionales" && datosAdicionales?.length) ||
        (action === "condicionPago" && (condicionPago as any)?.condicion)
          ? "✓"
          : ""
      }`,
      command: () => setModalsOtros((prev) => ({ ...prev, [action]: true })),
    }));

  return (
    <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-16 font-bold text-gray-800 text-3xl">Nueva venta</h2>
        <label className="flex items-center gap-2 text-gray-700 text-sm">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={proformaChecked}
            onChange={handleProformaChange}
          />
          PROFORMA
        </label>
      </div>

      {/* FILA 1 */}
      <div className="gap-4 grid grid-cols-4 mb-4">
        <div className="col-span-2">
          <label className="block mb-1 text-gray-500 text-xs">Cliente</label>
          <div className="relative w-full h-11">
            {clienteVenta ? (
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 w-full h-full border border-gray-300">
                <PermIdentityTwoToneIcon className="text-gray-600" />
                <span className="font-medium text-sm text-gray-800 truncate">
                  {formatCliente(clienteVenta)}
                </span>
                <button
                  type="button"
                  className="ml-auto text-gray-400 hover:text-gray-700"
                  onClick={() => setClienteVenta(null)}
                >
                  <CloseIcon />
                </button>
              </div>
            ) : (
              <AutoComplete
                ref={acClienteRef}
                value={clienteInput}
                suggestions={clientesFiltrados}
                completeMethod={buscarClientes}
                field="razonSocial"
                onChange={(e) => setClienteInput(e.value)}
                onSelect={handleSelectCliente}
                itemTemplate={clienteItemTemplate}
                placeholder="Buscar cliente..."
                className="w-full"
                inputClassName="h-11 rounded-md border border-gray-300 px-3 w-full"
                panelClassName="max-h-[300px] overflow-y-auto"
              />
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Emisión</label>
          <Calendar
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full h-11 border border-gray-300 rounded-md px-3"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Vencimiento
          </label>
          <Calendar
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.value as Date)}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full h-11 border border-gray-300 rounded-md px-3"
          />
        </div>
      </div>

      {/* FILA 2 */}
      <div className="gap-4 grid grid-cols-4 mb-4">
        <div>
          <label className="block mb-1 text-gray-500 text-xs">
            Comprobante
          </label>
          <select
            value={tipoDocId}
            onChange={(e) => setTipoDocId(e.target.value)}
            disabled={isLoadingMaestros}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-sm"
          >
            {tiposDocumento.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Serie</label>
          <select
            value={serieId}
            onChange={(e) => setSerieId(e.target.value)}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-sm"
          >
            {series.map((s: any) => (
              <option key={s.id || s.serie} value={s.serie}>
                {s.serie}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Moneda</label>
          <select
            value={monedaId}
            onChange={(e) => setMonedaId(e.target.value)}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-sm"
          >
            {monedas.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.codigo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Dscto (%)</label>
          <input
            type="number"
            value={globalDiscount}
            onChange={handleDiscountChange}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-sm"
          />
        </div>
      </div>

      {/* FILA 3 */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setShowPlacaModal(true)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white ${
            placa ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          PLACA {placa && "✓"}
        </button>
        <button
          onClick={() => setShowOrdenCompraModal(true)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white ${
            ordenCompra ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          O. COMPRA {ordenCompra && "✓"}
        </button>
        <button
          onClick={() => setShowObservacionesModal(true)}
          className={`w-full py-2 px-4 rounded-lg font-bold text-white ${
            observaciones ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          OBSERVACIONES {observaciones && "✓"}
        </button>
        <div className="relative w-full">
          <Menu model={otrosModalItems} popup ref={menuOtrosRef} />
          <button
            onClick={(e) => menuOtrosRef.current?.toggle(e)}
            className="flex justify-center items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg w-full font-bold text-white"
          >
            OTROS <MenuIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md overflow-auto text-center text-gray-500 text-sm">
        {productosVenta.length === 0 ? (
          <div className="p-6">Agrega productos...</div>
        ) : (
          <table className="w-full text-gray-700 text-sm">
            <thead className="bg-gray-100 border-b text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Cant.</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {productosVenta.map((p: any) => (
                <tr key={p.codigoProducto || p.id} className="border-b">
                  <td className="px-4 py-2 text-left">
                    {p.descripcion || p.nombre}
                  </td>
                  <td className="px-4 py-2">S/ {p.precioVenta?.toFixed(2)}</td>
                  <td className="flex justify-center items-center gap-2 px-4 py-2">
                    <button
                      className="bg-gray-200 px-2 rounded"
                      onClick={() =>
                        actualizarCantidad(
                          p.codigoProducto!,
                          Math.max(1, p.cantidadVenta - 1)
                        )
                      }
                    >
                      -
                    </button>
                    <span>{p.cantidadVenta}</span>
                    <button
                      className="bg-gray-200 px-2 rounded"
                      onClick={() =>
                        actualizarCantidad(
                          p.codigoProducto!,
                          p.cantidadVenta + 1
                        )
                      }
                    >
                      +
                    </button>
                  </td>
                  <td className="px-4 py-2">S/ {p.totalVenta?.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removerProducto(p.codigoProducto!)}
                    >
                      <CloseIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <div className="bottom-0 sticky bg-white pt-4 border-gray-300 border-t">
        <div className="mb-4">
          <AutoComplete
            value={productoInput}
            suggestions={productosFiltrados}
            completeMethod={buscarProductos}
            field="descripcion"
            onChange={(e) => setProductoInput(e.value)}
            onSelect={handleSelectProducto}
            placeholder="Buscar producto..."
            className="w-full"
            inputClassName="h-11 rounded-md border border-gray-300 px-3 w-full"
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="group relative flex-[22] text-center cursor-pointer">
            <p className="font-bold text-gray-700 text-lg">
              TOTAL{" "}
              <span className="text-black">S/ {totalGeneral.toFixed(2)}</span>
            </p>
            <div className="hidden group-hover:block bottom-full left-1/2 absolute bg-white shadow-lg mb-2 p-4 border rounded-lg w-52 text-gray-700 text-sm -translate-x-1/2 z-10">
              <div className="flex justify-between">
                <span>Gravado:</span>
                <span>{totalsDesglose.gravado.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IGV:</span>
                <span>{totalsDesglose.igv.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleVistaPrevia}
            className="flex-[9] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700"
          >
            VISTA PREVIA
          </button>
          <button
            onClick={() => crearVenta()}
            disabled={isCrearVentaLoading}
            className={`flex-[9] px-4 py-2 rounded font-semibold text-white ${
              isCrearVentaLoading
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isCrearVentaLoading ? "PROCESANDO..." : "PROCESAR"}
          </button>
        </div>
      </div>

      <Dialog
        header="PDF"
        visible={visiblePreview}
        maximized
        onHide={() => setVisiblePreview(false)}
      >
        <div className="flex gap-4 mb-2">
          <select
            value={tipoPdf}
            onChange={(e) => setTipoPdf(e.target.value as PdfFormat)}
            className="border p-1 rounded"
          >
            <option value="A4">A4</option>
            <option value="t80mm">Ticket</option>
          </select>
          <button
            onClick={handleVistaPrevia}
            className="bg-blue-600 text-white px-3 rounded text-sm"
          >
            Actualizar
          </button>
        </div>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="border-0 w-full h-[calc(100vh-100px)]"
          />
        )}
      </Dialog>

      <PlacaModal
        visible={showPlacaModal}
        onHide={() => setShowPlacaModal(false)}
      />
      <OrdenCompraModal
        visible={showOrdenCompraModal}
        onHide={() => setShowOrdenCompraModal(false)}
      />
      <ObservacionesModal
        visible={showObservacionesModal}
        onHide={() => setShowObservacionesModal(false)}
      />
      <GuiaRemisionModal
        visible={!!modalsOtros.guia}
        onHide={() => handleHideModalOtros("guia")}
      />
      <DatosAdicionalesModal
        visible={!!modalsOtros.adicionales}
        onHide={() => handleHideModalOtros("adicionales")}
      />
      <CondicionPagoModal
        visible={!!modalsOtros.condicionPago}
        onHide={() => handleHideModalOtros("condicionPago")}
      />
    </div>
  );
};

export default VentasView;
