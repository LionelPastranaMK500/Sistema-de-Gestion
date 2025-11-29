import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logo from "@/assets/Logo_WolfFur.png";
import { SheetsData } from "@/types/services/reportes";

export async function buildExcel(
  sheetsData: SheetsData,
  fileName: string,
  onFinish?: () => void
): Promise<void> {
  if (!fileName || fileName.trim() === "") {
    throw new Error("El nombre del archivo no puede estar vacío.");
  }

  const workbook = new ExcelJS.Workbook();

  const COLOR_BRAND = "1857C3";
  const COLOR_HEADER = "60A5FA";
  const COLOR_WHITE = "FFFFFF";
  const COLOR_GRID = "E5E7EB";
  const COLOR_ROW_ALT = "F7F9FC";
  const COLOR_TEXT = "111827";
  const COLOR_ANULADO = "FEE2E2";

  const BORDER_THIN: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: COLOR_GRID } },
    left: { style: "thin", color: { argb: COLOR_GRID } },
    bottom: { style: "thin", color: { argb: COLOR_GRID } },
    right: { style: "thin", color: { argb: COLOR_GRID } },
  };

  for (const tipo of Object.keys(sheetsData)) {
    const sheetData = sheetsData[tipo] || [];
    const headers = sheetData[2] || [];
    const lastCol = Math.max(headers.length, 1);

    const worksheet = workbook.addWorksheet(tipo.slice(0, 31), {
      properties: { defaultRowHeight: 18 },
    });

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

    try {
      const res = await fetch(logo);
      const blob = await res.blob();
      const buf = await blob.arrayBuffer();
      const imgId = workbook.addImage({ buffer: buf, extension: "png" });

      worksheet.addImage(imgId, {
        tl: { col: 0, row: 0 },
        ext: { width: 250, height: 100 },
      });
    } catch (e) {
      console.warn("No se encontró el logo:", e);
    }

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
    worksheet.getRow(1).height = 85;

    // -------- Fila 2: Encabezados --------
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

    // -------- Datos --------
    sheetData.slice(3).forEach((rowArr, idx) => {
      const excelRow = worksheet.addRow(rowArr);
      const isAlt = idx % 2 === 0;

      excelRow.eachCell((cell, colIndex) => {
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
    const estadoSunatIndex = headers.findIndex((h) =>
      String(h || "")
        .toUpperCase()
        .includes("ESTADO SUNAT")
    );

    if (estadoSunatIndex !== -1) {
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 2) {
          const cellValue = row.getCell(estadoSunatIndex + 1).value;
          const val = String(cellValue ?? "").toUpperCase();

          if (val.includes("ANULADO")) {
            row.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: COLOR_ANULADO },
              };
              cell.font = { ...cell.font, color: { argb: "991B1B" } };
            });
          }
        }
      });
    }

    // -------- Auto width --------
    worksheet.columns.forEach((col) => {
      let max = 10;
      col.eachCell &&
        col.eachCell({ includeEmpty: true }, (cell) => {
          const v = cell.value;
          const s = v == null ? "" : String(v);
          max = Math.max(max, s.length);
        });
      col.width = Math.min(Math.max(max + 2, 12), 60);
    });

    worksheet.views = [{ state: "frozen", ySplit: 2 }];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, fileName);

  if (onFinish) onFinish();
}
