import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "sheetjs-style"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const content = await file.text()
    const lines = content.trim().split("\n")

    const records = lines.map((line) => {
      const [
        CC_USUARIO,
        C_COSTO,
        SUCURSAL,
        NIT,
        SERVICIO,
        DATA0,
        NOMBRE_SERV,
        VALOR,
        CLAVE,
        SERIAL,
        SERIE,
        NUMERO,
        FECHA_VENTA,
        HORA_VENTA,
        DATA1,
        DATA2,
        DATA3,
        DATA4,
        DATA5,
        DATA6,
      ] = line.split("|")

      return {
        CC_USUARIO,
        C_COSTO,
        SUCURSAL,
        NIT,
        SERVICIO,
        DATA0,
        NOMBRE_SERV,
        VALOR: VALOR
          ? new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
            }).format(Number(VALOR))
          : "",
        CLAVE,
        SERIAL,
        SERIE,
        NUMERO,
        FECHA_VENTA: FECHA_VENTA ? FECHA_VENTA.replace(/-/g, "/") : "",
        HORA_VENTA,
        DATA1,
        DATA2,
        DATA3,
        DATA4,
        DATA5,
        DATA6,
      }
    })

    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(records)

    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")

    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
        const cell = worksheet[cellAddress]
        if (!cell) continue

        if (row === 0) {
          // Estilo encabezado con bordes y fondo amarillo
          cell.s = {
            fill: { fgColor: { rgb: "FFFF00" } },
            font: { bold: true },
            alignment: {
              horizontal: "center",
              vertical: "center",
            },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          }
        } else {
          // Estilo datos (alineación derecha)
          cell.s = {
            alignment: {
              horizontal: "right",
              vertical: "center",
            },
          }
        }
      }
    }

    // Anchos personalizados
    worksheet["!cols"] = [
      { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 23 },
      { wch: 14 }, { wch: 10 }, { wch: 30 }, { wch: 14 },
      { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 10 },
      { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    ]

    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos")

    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      cellStyles: true,
    })

    // ✅ Manejo robusto del nombre original
    const fileName = file.name
    const originalBaseName = fileName.includes(".")
      ? fileName.split(".").slice(0, -1).join(".")
      : fileName || "archivo"

    const newFileName = `${originalBaseName}_convertido.xlsx`

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${newFileName}"`,
      },
    })
  } catch (error) {
    console.error("Error processing file:", error)
    return NextResponse.json({ error: "Error processing file" }, { status: 500 })
  }
}
