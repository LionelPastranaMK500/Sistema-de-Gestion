import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import logo from "@/assets/Logo_WolfFur.png"

export async function buildExcel(sheetsData, fileName, onFinish) {
    if (!fileName || fileName.trim() === "") {
        throw new Error("El nombre del archivo no puede estar vacío.");
    }

    const workbook = new ExcelJS.Workbook();

    for (const tipo of Object.keys(sheetsData)) {
        const sheetData = sheetsData[tipo];
        const worksheet = workbook.addWorksheet(tipo.slice(0, 31));

        try {
            const response = await fetch(logo);
            const imageBlob = await response.blob();
            const buffer = await imageBlob.arrayBuffer();
            const imageId = workbook.addImage({ buffer, extension: "png" });
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                ext: { width: 250, height: 100 },
            });
            worksheet.getRow(1).height = 50;
        } catch (e) {
            console.warn("No se encuentra el logo", e);
        }

        worksheet.mergeCells(1, 2, 1, sheetData[2].length);
        const titleCell = worksheet.getCell(1, 2);
        titleCell.value = sheetData[0][0];
        titleCell.alignment = {};
        titleCell.font = {};
        titleCell.fill = {};

        const headers = sheetData[2];
        worksheet.addRow(headers);
        worksheet.getRow(3).eachCell((cell) => {
            cell.font = {};
            cell.alignment = {};
            cell.border = {};
            cell.fill = {};
        });

        sheetData.slice(3).forEach((row) => {
            const newRow = worksheet.addRow(row);
            newRow.eachCell((cell, colIndex) => {
                if (headers[colIndex] && headers[colIndex].includes("TOTAL")) {
                    //formato de moneda
                }
                if (headers[colIndex] && headers[colIndex].includes("FECHA")) {
                    //formato de fecha
                }
            });
        });

        const estadoSunatIndex = headers.findIndex((header) =>
            header.toUpperCase().includes("ESTADO SUNAT")
        );
        if (estadoSunatIndex !== -1) {
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 3) {
                    const estadoCell = (
                        row.getCell(estadoSunatIndex + 1).value || ""
                    )
                        .toString()
                        .toUpperCase();
                    if (estadoCell.includes("ANULADO")) {
                        row.eachCell((cell) => {
                            cell.fill = {};
                            cell.font = {};
                        });
                    }
                }
            });
        }

        worksheet.columns.forEach((col) => {
            let maxLength = 10;
            col.eachCell({ includeEmpty: true }, (cell) => {
                const value = cell.value ? cell.value.toString() : "";
                maxLength = Math.max(maxLength, value.length);
            });
            col.width = maxLength + 2;
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
    if (onFinish) onFinish();
}
