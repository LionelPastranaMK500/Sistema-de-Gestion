import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logo from "@/assets/Logo_WolfFur.png";

// Definimos el tipo para los datos de las hojas: un objeto donde cada clave es el nombre de la hoja
// y el valor es una matriz de celdas (filas x columnas)
export type SheetsData = Record<
  string,
  (string | number | null | undefined)[][]
>;

export async function buildExcel(
  sheetsData: SheetsData,
  fileName: string,
  onFinish?: () => void
): Promise<void> {
  if (!fileName || fileName.trim() === "") {
    throw new Error("El nombre del archivo no puede estar vacío.");
  }

  const workbook = new ExcelJS.Workbook();

  // Paleta de colores
  const COLOR_BRAND = "1857C3"; // Azul banda / título
  const COLOR_HEADER = "60A5FA"; // Azul claro/celeste encabezados
  const COLOR_WHITE = "FFFFFF";
  const COLOR_GRID = "E5E7EB"; // Bordes gris claro
  const COLOR_ROW_ALT = "F7F9FC"; // Zebra
  const COLOR_TEXT = "111827"; // Texto
  const COLOR_ANULADO = "FEE2E2"; // Fila anulada (fondo)

  // Borde fino estándar
  const BORDER_THIN: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: COLOR_GRID } },
    left: { style: "thin", color: { argb: COLOR_GRID } },
    bottom: { style: "thin", color: { argb: COLOR_GRID } },
    right: { style: "thin", color: { argb: COLOR_GRID } },
  };

  for (const tipo of Object.keys(sheetsData)) {
    const sheetData = sheetsData[tipo] || [];
    // La fila 2 contiene los encabezados (índice 2 del array)
    const headers = sheetData[2] || [];
    const lastCol = Math.max(headers.length, 1);

    // ExcelJS limita nombres de hoja a 31 caracteres
    const worksheet = workbook.addWorksheet(tipo.slice(0, 31), {
      properties: { defaultRowHeight: 18 },
    });

    // -------- Fila 1: Banda + Logo + Título --------
    // Pintar toda la fila 1 de la banda azul y bordes
    for (let c = 1; c <= lastCol; c++) {
      const cell = worksheet.getCell(1, c);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLOR_BRAND },
      };
      cell.border = BORDER_THIN as ExcelJS.Borders;
      cell.font = { name: "Inter", size: 12, color: { argb: COLOR_WHITE } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    }

    // Logo (opcional)
    try {
      const res = await fetch(logo);
      const blob = await res.blob();
      const buf = await blob.arrayBuffer();
      const imgId = workbook.addImage({ buffer: buf, extension: "png" });

      // Aproximado para encajar con 85px de alto de fila
      worksheet.addImage(imgId, {
        tl: { col: 0, row: 0 },
        ext: { width: 250, height: 100 },
      });
    } catch (e) {
      console.warn("No se encontró el logo:", e);
    }

    // Título centrado de B1..lastCol
    // mergeCells usa coordenadas base 1 (startRow, startCol, endRow, endCol)
    worksheet.mergeCells(1, 2, 1, lastCol);
    const titleCell = worksheet.getCell(1, 2);
    titleCell.value = (sheetData?.[0]?.[0] || tipo || "")
      .toString()
      .toUpperCase();
    titleCell.font = {
      name: "Inter",
      size: 16,
      bold: true,
      color: { argb: COLOR_WHITE },
    };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    // Altura pedida para la primera fila
    worksheet.getRow(1).height = 85;

    // -------- Fila 2: Encabezados --------
    // insertRow devuelve la fila insertada
    const headerRow = worksheet.insertRow(2, headers);
    headerRow.height = 17;

    headerRow.eachCell((cell) => {
      cell.font = {
        name: "Inter",
        bold: true,
        color: { argb: COLOR_WHITE },
        size: 12,
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: COLOR_HEADER },
      };
      cell.border = BORDER_THIN as ExcelJS.Borders;
    });

    // -------- Datos: desde fila 3 en adelante --------
    // sheetData incluye las filas 0 y 1 que ya usamos (título y vacío), y la 2 (headers)
    // Así que los datos reales empiezan en el índice 3
    sheetData.slice(3).forEach((rowArr, idx) => {
      const excelRow = worksheet.addRow(rowArr);
      const isAlt = idx % 2 === 0;

      excelRow.eachCell((cell, colIndex) => {
        // colIndex es base 1. Los headers están en el array en base 0.
        const header = String(headers[colIndex - 1] || "");
        const H = header.toUpperCase();

        const isMoney = /TOTAL|PRECIO|IMPORTE|SUBTOTAL|MONTO/.test(H);
        const isDate = /FECHA/.test(H);
        const isNumberish =
          isMoney || /CANTIDAD|NRO|N°|NUMERO|NÚMERO|CODIGO|CÓDIGO/.test(H);

        cell.font = { name: "Inter", size: 11, color: { argb: COLOR_TEXT } };
        cell.alignment = {
          vertical: "middle",
          horizontal: isMoney || isNumberish ? "right" : "left",
          wrapText: true,
        };
        cell.border = BORDER_THIN as ExcelJS.Borders;

        if (isAlt) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: COLOR_ROW_ALT },
          };
        }

        if (isMoney) {
          cell.numFmt = "#,##0.00";
        } else if (isDate) {
          cell.numFmt = "dd/mm/yyyy";
        }
      });
    });

    // -------- Resaltar ESTADO SUNAT: ANULADO --------
    // Buscamos la columna que se llame "ESTADO SUNAT"
    const estadoSunatIndex = headers.findIndex((h) =>
      String(h || "")
        .toUpperCase()
        .includes("ESTADO SUNAT")
    );

    if (estadoSunatIndex !== -1) {
      worksheet.eachRow((row, rowNumber) => {
        // Los datos empiezan visualmente en la fila 3 (después del header en la fila 2)
        if (rowNumber > 2) {
          // getCell es base 1. estadoSunatIndex es base 0, así que +1
          const cellValue = row.getCell(estadoSunatIndex + 1).value;
          const val = String(cellValue ?? "").toUpperCase();

          if (val.includes("ANULADO")) {
            row.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: COLOR_ANULADO },
              };
              // Mantenemos la fuente pero cambiamos el color a rojo oscuro
              cell.font = { ...cell.font, color: { argb: "991B1B" } };
            });
          }
        }
      });
    }

    // -------- Auto width (Ancho automático) --------
    worksheet.columns.forEach((col) => {
      let max = 10;
      col.eachCell &&
        col.eachCell({ includeEmpty: true }, (cell) => {
          const v = cell.value;
          const s = v == null ? "" : String(v);
          max = Math.max(max, s.length);
        });
      // Ajustamos un poco el ancho (min 12, max 60)
      col.width = Math.min(Math.max(max + 2, 12), 60);
    });

    // -------- Congelar filas 1 y 2 (título + headers) --------
    worksheet.views = [{ state: "frozen", ySplit: 2 }];
  }

  // Generar y guardar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);

  if (onFinish) onFinish();
}
