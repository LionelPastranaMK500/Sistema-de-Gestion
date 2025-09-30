import { useState, useEffect, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { Dialog } from "primereact/dialog";
import { configCalendar } from "@utils/configCalendar";
import {
  getClientes,
  getTiposComprobante,
  getSeries,
  getProductos,
  mapTipo,
} from "@services/generadorData";
import { visualizarPDF } from "@utils/pdfViewer";
import { generarRuc, generarDni } from "@services/generadorDocumentos";
import VentasModal from "./VentasModal";
import { useProductosAgregados } from "@hooks/useProductosAgregados";

const VentasView = () => {
  const [fechaEmision, setFechaEmision] = useState(new Date());
  const [fechaVencimiento, setFechaVencimiento] = useState(null);

  const clientes = getClientes();
  const productos = getProductos();
  const comprobantes = getTiposComprobante();

  // ===== Defaults solicitados =====
  const DEFAULT_COMPROBANTE = "BOLETA DE VENTA ELECTRÓNICA";
  const DEFAULT_SERIE = "B001";

  const seriesIniciales = mapTipo[DEFAULT_COMPROBANTE]
    ? getSeries(mapTipo[DEFAULT_COMPROBANTE])
    : [];

  // Estado cliente (input y selección real)
  const [clienteInput, setClienteInput] = useState("");
  const [clienteSel, setClienteSel] = useState(null);

  // Productos
  const [producto, setProducto] = useState(null);

  // inicia con BOLETA DE VENTA ELECTRÓNICA
  const [comprobante, setComprobante] = useState(DEFAULT_COMPROBANTE);

  // inicia con las series de boleta y la B001 si existe
  const [seriesDisponibles, setSeriesDisponibles] = useState(seriesIniciales);
  const [serie, setSerie] = useState(
    seriesIniciales.includes(DEFAULT_SERIE)
      ? DEFAULT_SERIE
      : seriesIniciales[0] || ""
  );

  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [proformaChecked, setProformaChecked] = useState(false);

  const [visiblePreview, setVisiblePreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [tipoPdf, setTipoPdf] = useState("A4");

  // ====== Soporte UI Autocomplete Cliente ======
  const acClienteRef = useRef(null);
  const HEADER = { __type: "header" };
  const TIPS = { __type: "tips" };
  const closePanelLater = () => setTimeout(() => setClientesFiltrados([]), 120);

  useEffect(() => {
    configCalendar();
  }, []);

  // Helper: cómo mostrar el cliente dentro del input
  const formatCliente = (c) => {
    if (!c) return "";
    const doc = c.documento ? String(c.documento).trim() : "";
    const rs = c.razonSocial ? String(c.razonSocial).trim() : "";
    if (doc && rs) return `${doc} — ${rs}`;
    return rs || doc;
  };

  // cuando cambia el tipo de comprobante recalculamos series (preferir B001)
  useEffect(() => {
    if (mapTipo[comprobante]) {
      const nuevasSeries = getSeries(mapTipo[comprobante]);
      setSeriesDisponibles(nuevasSeries);
      setSerie(
        nuevasSeries.includes(DEFAULT_SERIE)
          ? DEFAULT_SERIE
          : nuevasSeries[0] || ""
      );
    } else {
      setSeriesDisponibles([]);
      setSerie("");
    }
  }, [comprobante]);

  const handleProformaChange = (e) => {
    const checked = e.target.checked;
    setProformaChecked(checked);

    if (checked) {
      setComprobante("PROFORMA ELECTRÓNICA");
      const nuevasSeries = getSeries("PROFORMA");
      setSeriesDisponibles(nuevasSeries);
      setSerie(nuevasSeries[0] || "");
    } else {
      // al desmarcar PROFORMA no imponemos defaults
      setComprobante("");
      setSerie("");
      setSeriesDisponibles([]);
    }
  };

  const handleVistaPrevia = async () => {
    let docCliente = clienteSel?.documento;
    if (!docCliente) {
      if (comprobante.includes("FACTURA ELECTRÓNICA")) docCliente = generarRuc();
      else if (comprobante.includes("BOLETA DE VENTA ELECTRÓNICA")) docCliente = generarDni();
      else docCliente = generarRuc();
    }

    const facturaPreview = {
      ruc: docCliente,
      cliente: clienteSel?.razonSocial || "",
      direccion: clienteSel?.direccion || "",
      tDocumento: comprobante,
      serie,
      numero: Date.now() % 10000,
      items: productosAgregados || [],
      fecha: fechaEmision,
      fechaVencimiento,
      total: totalGeneral,
    };

    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const blob = await visualizarPDF(facturaPreview, tipoPdf);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setVisiblePreview(true);
  };

  // ====== Búsquedas ======
  const buildClienteSuggestions = (query) => {
    const q = (query ?? "").toLowerCase().trim();
    if (!q) return [HEADER, TIPS]; // sin texto: header + tips fijos

    const matches = clientes.filter(
      (c) =>
        (c.razonSocial || "").toLowerCase().includes(q) ||
        (c.direccion || "").toLowerCase().includes(q) ||
        (c.documento || "").toString().toLowerCase().includes(q)
    );
    // siempre devolvemos header + (coincidencias si hay) + tips
    return [HEADER, ...(matches ?? []), TIPS];
  };

  const buscarClientes = (event) => {
    setClientesFiltrados(buildClienteSuggestions(event.query));
  };

  const buscarProductos = (event) => {
    const q = (event.query ?? "").toLowerCase();
    const _productos = productos.filter((p) =>
      (p.descripcion || "").toLowerCase().includes(q)
    );
    setProductosFiltrados(_productos);
  };

  // ====== Productos ======
  const {
    productosAgregados,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    totalGeneral,
  } = useProductosAgregados();

  const handleKeyEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      agregarProducto(productos);
    }
  };

  // ====== Item template cliente (Header / Tips / Item normal) ======
  const clienteItemTemplate = (opt) => {
    if (opt?.__type === "header") {
      return (
        <div
          className="top-0 z-10 sticky flex justify-between items-center bg-white px-4 py-3 border-b"
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="font-semibold text-[13px] text-gray-600 uppercase tracking-wide">
            Resultados de la búsqueda
          </span>
          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md font-bold text-[12px] text-white"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => console.log("REGISTRAR NUEVO")}
          >
            REGISTRAR NUEVO
          </button>
        </div>
      );
    }

    if (opt?.__type === "tips") {
      return (
        <div
          className="bottom-0 sticky bg-white px-4 py-3 border-t text-[12px] text-gray-600 leading-5"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div>
            <strong>TIP:</strong> Escribe <strong>3 o más caracteres</strong> para comenzar a buscar
          </div>
          <div>
            <strong>TIP:</strong> Para un <strong>DNI o RUC</strong>, escribe el número y presiona <strong>ENTER</strong>
          </div>
          <div>
            <strong>TIP:</strong> ¿Sin documentos? Escribe el nombre y presiona <strong>ENTER</strong>
          </div>
          <div>
            <strong>TIP:</strong> Para una venta sin datos, puedes dejar el campo vacío
          </div>
        </div>
      );
    }

    // Ítem normal (¡sin preventDefault!)
    return (
      <div className="hover:bg-gray-50 px-3 py-2">
        <div className="text-[12px] text-gray-500">{opt.documento}</div>
        <div className="font-semibold text-[13px] text-gray-800">{opt.razonSocial}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-white shadow-md p-6 rounded-lg w-full h-full">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="ml-5 font-bold text-gray-800 text-xl">Nueva venta</h2>
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

      {/* PRIMERA FILA */}
      <div className="gap-4 grid grid-cols-4 mb-4">
        <div className="col-span-2">
          <label className="block mb-1 text-gray-500 text-xs">Cliente</label>

          {/* Panel del mismo ancho del input */}
          <div className="relative w-full">
            <AutoComplete
              ref={acClienteRef}
              appendTo="self"
              panelStyle={{ width: "100%" }}
              minLength={0}
              value={clienteInput} // <- TEXTO VISIBLE
              suggestions={clientesFiltrados}
              completeMethod={buscarClientes}
              field="razonSocial"
              onChange={(e) => {
                // si el usuario escribe, “rompemos” la selección previa
                if (clienteSel) setClienteSel(null);
                setClienteInput(e.value ?? "");
                if (String(e.value ?? "").trim() === "") {
                  setClientesFiltrados([HEADER, TIPS]);
                  acClienteRef.current?.show?.();
                }
              }}
              onFocus={() => {
                setClientesFiltrados([HEADER, TIPS]);
                acClienteRef.current?.show?.();
              }}
              // cierre diferido para no truncar la selección
              onBlur={closePanelLater}
              onSelect={(e) => {
                setClienteSel(e.value);// objeto real
                setClienteInput(formatCliente(e.value)); // RUC + Razón social en el input
                closePanelLater();
              }}
              placeholder="Cliente"
              className="w-full"
              inputClassName="h-11 rounded-md border border-gray-300 px-3 text-[14px] w-full focus:ring-2 focus:ring-blue-400"
              panelClassName="max-h-[340px] rounded-md border border-gray-300 shadow-lg overflow-y-auto"
              itemTemplate={clienteItemTemplate}
              emptyMessage={null}
            />
          </div>
        </div>

        {/* Fecha emisión */}
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Fecha de emisión</label>
          <Calendar
            value={fechaEmision}
            onChange={(e) => setFechaEmision(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full h-11 border border-gray-300 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Fecha vcto */}
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Fecha de vencimiento</label>
          <Calendar
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.value)}
            dateFormat="dd/mm/yy"
            showIcon
            className="w-full"
            inputClassName="w-full h-11 border border-gray-300 rounded-md px-3 text-[14px] focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* SEGUNDA FILA */}
      <div className="gap-4 grid grid-cols-4 mb-4">
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Tipo de comprobante</label>
          <select
            value={comprobante}
            onChange={(e) => setComprobante(e.target.value)}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"
          >
            <option value="">---Seleccionar---</option>
            {comprobantes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Serie</label>
          <select
            value={serie}
            onChange={(e) => setSerie(e.target.value)}
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"
          >
            <option>---Seleccionar---</option>
            {seriesDisponibles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Tipo de operación</label>
          <select className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]">
            <option>VENTA INTERNA</option>
          </select>
        </div>

        {/* Dscto global */}
        <div>
          <label className="block mb-1 text-gray-500 text-xs">Dscto. global (%)</label>
          <input
            type="number"
            placeholder="0.00"
            className="px-2 py-2.5 border border-gray-300 rounded-md w-full h-11 text-[14px]"
          />
        </div>
      </div>
              
      {/* BOTONES DE OPCIONES */}
      <div className="gap-2 grid grid-cols-4 mb-6">
        <VentasModal />
      </div>

      {/* ZONA DE PRODUCTOS */}
      <div className="flex-1 bg-gray-50 mb-6 p-6 border border-gray-300 rounded-md overflow-auto text-gray-500 text-sm text-center">
        {productosAgregados.length === 0 ? (
          <div className="p-6 text-gray-500 text-sm text-center">Busca un producto....</div>
        ) : (
          <table className="w-full text-gray-700 text-sm">
            <thead className="bg-gray-100 border-b text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-2 text-left">Producto</th>
                <th className="px-4 py-2">Precio Unit.</th>
                <th className="px-4 py-2">Descuento</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {productosAgregados.map((producto) => (
                <tr key={producto.codigo} className="border-b">
                  <td className="px-4 py-2 text-left">{producto.descripcion}</td>
                  <td className="px-4 py-2 text-center">S/{producto.precio?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">S/ 0.00</td>
                  <td className="px-4 py-2 text-center">S/{totalGeneral.toFixed(2)}</td>
                  <td className="flex justify-center items-center gap-2 px-4 py-2">
                    <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded" onClick={() => actualizarCantidad(producto.codigo, producto.cantidad - 1)}>-</button>
                    <span>{producto.cantidad}</span>
                    <button className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded" onClick={() => actualizarCantidad(producto.codigo, producto.cantidad + 1)}>+</button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white" onClick={() => eliminarProducto(producto.codigo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* FOOTER */}
      <div className="bottom-0 sticky bg-white pt-4 border-gray-300 border-t">
        {/* Buscar producto */}
        <div className="mb-4">
          <AutoComplete
            value={producto}
            suggestions={productosFiltrados}
            completeMethod={buscarProductos}
            field="descripcion"
            onChange={(e) => setProducto(e.value)}
            onSelect={(e) => agregarProducto(e.value)}
            placeholder="Escriba nombre del producto..."
            className="w-full"
            onKeyDown={handleKeyEnter}
            inputClassName="h-11 rounded-md border border-gray-300 px-3 text-[14px] w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* TOTAL + BOTONES */}
        <div className="flex justify-between items-center gap-4">
          <div className="group relative flex-[22] text-center cursor-pointer">
            <p className="font-bold text-gray-700 text-lg">
              <strong>
                TOTAL <span className="text-black">S/. {totalGeneral}</span>
              </strong>
            </p>
            <div className="hidden group-hover:block bottom-full left-1/2 absolute bg-white shadow-lg mb-2 p-4 border rounded-lg w-52 text-gray-700 text-sm -translate-x-1/2">
              {[
                "Anticipios",
                "DSCTO",
                "Gravado",
                "Exonerado",
                "Inafecto",
                "Exportación",
                "Gratuito",
                "I.S.C",
                "I.G.V",
                "R.C",
                "I.C.B.P.E.R",
              ].map((item) => (
                <div key={item} className="flex justify-between">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleVistaPrevia}
            className="flex-[9] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded font-semibold text-gray-700"
          >
            VISTA PREVIA
          </button>

          <button className="flex-[9] bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-white">
            PROCESAR
          </button>
        </div>

        <Dialog
          header="Vista previa PDF"
          visible={visiblePreview}
          maximized
          className="w-screen h-screen"
          onHide={() => setVisiblePreview(false)}
        >
          <div className="flex gap-10 mb-3">
            <select
              value={tipoPdf}
              onChange={(e) => setTipoPdf(e.target.value)}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="A4">Formato A4</option>
              <option value="t80mm">Ticket 80mm</option>
            </select>
            <button
              onClick={handleVistaPrevia}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
            >
              Actualizar
            </button>
          </div>

          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              className="border-0 w-full h-[calc(100vh-100px)]"
            />
          )}
        </Dialog>
      </div>
    </div>
  );
}

export default VentasView;