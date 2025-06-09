
import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
      return NextResponse.json({ error: "Tipo de archivo no válido" }, { status: 400 })
    }

    console.log(`Procesando archivo: ${file.name}, tamaño: ${file.size} bytes`)

    // Obtener el buffer del archivo
    const buffer = await file.arrayBuffer()

    // Aplicar la lógica de reparación usando tu código específico
    const repairedBuffer = await repairExcelFile(buffer, file.name)

    // Generar nombre del archivo con sufijo "reparado"
    const originalName = file.name
    const extension = originalName.substring(originalName.lastIndexOf("."))
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."))
    const repairedFileName = `${nameWithoutExt}_reparado${extension}`

    console.log(`Enviando archivo reparado: ${repairedFileName}`)

    // Crear respuesta con los encabezados apropiados
    const response = new NextResponse(repairedBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${repairedFileName}"`,
        "Content-Length": repairedBuffer.byteLength.toString(),
        "Cache-Control": "no-cache",
      },
    })

    return response
  } catch (error) {
    console.error("Error al procesar el archivo:", error)
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    )
  }
}

function repairExcelFile(buffer: ArrayBuffer, fileName: string): ArrayBuffer {
  console.log(`Reparando archivo ${fileName} de ${buffer.byteLength} bytes`)

  try {
    const workbook = XLSX.read(buffer, { type: "array" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][]

    const cleanData: string[][] = []
    const errorData: string[][] = []

    const regexDocumento = /cc_vendedor:\s*(\d+)/i
    const regexCodigoSIMS = /Cod_Agencia_Sims:\s*(\d+)/i
    const regexNombreSIMS = /Nomb_Sims:\s*([^<]+)/i
    const regexTipoCaja = /Caja_Sims:\s*([^<]+)/i

    rows.forEach((row) => {
      if (!row || row.length === 0) return

      const text = row.join(" ").trim()
      const documento = (text.match(regexDocumento) || [])[1] || ""
      const codigoSIMS = (text.match(regexCodigoSIMS) || [])[1] || ""
      const nombreAgencia = (text.match(regexNombreSIMS) || [])[1]?.trim() || ""
      const cajaRaw = (text.match(regexTipoCaja) || [])[1]?.trim() || ""

      let tipoCaja = ""
      let numeroExtra = ""

      const matchCaja = cajaRaw.match(/^(AUX|PRINCIPAL)\s*(\d+)?/i)
      if (matchCaja) {
        tipoCaja = matchCaja[1]
        numeroExtra = matchCaja[2] || ""
      }

      const fila = [
        documento.trim(),
        codigoSIMS.trim(),
        nombreAgencia.trim(),
        tipoCaja.trim(),
        numeroExtra.trim(),
      ]

      const esInvalido =
        (!codigoSIMS || codigoSIMS === "-") && (!nombreAgencia || nombreAgencia === "-");

      if (esInvalido) {
        errorData.push(fila)
      } else {
        cleanData.push(fila)
      }
    })

    const numeroAsignacion = fileName.match(/\d+/)?.[0] || ""
    const outputWorkbook = XLSX.utils.book_new()
    const outputSheet = XLSX.utils.aoa_to_sheet(cleanData)

    outputSheet["!cols"] = [
      { wch: 15 }, // Documento
      { wch: 15 }, // Código SIMS
      { wch: 70 }, // Nombre Agencia
      { wch: 12 }, // Tipo Caja
      { wch: 12 }, // Número Extra
    ]
    XLSX.utils.book_append_sheet(outputWorkbook, outputSheet, `Asignaciones ${numeroAsignacion}`)

    // Filtrar filas no vacías en errorData
    const errorDataLimpia = errorData.filter(
      (fila) => fila.some((celda) => celda && celda.toString().trim() !== "")
    )

    if (errorDataLimpia.length > 0) {
      const errorSheet = XLSX.utils.aoa_to_sheet(errorDataLimpia)
      errorSheet["!cols"] = [
        { wch: 15 }, // Documento
        { wch: 15 }, // Código SIMS
        { wch: 10 }, // Nombre Agencia
        { wch: 12 }, // Tipo Caja
        { wch: 12 }, // Número Extra
      ]
      XLSX.utils.book_append_sheet(outputWorkbook, errorSheet, "Información incompleta")
    }

    const outputBuffer = XLSX.write(outputWorkbook, {
      type: "buffer",
      bookType: "xlsx",
    })

    console.log(`Reparación completada, tamaño de salida: ${outputBuffer.byteLength} bytes`)
    console.log(`Registros válidos procesados: ${cleanData.length}`)

    return outputBuffer
  } catch (error) {
    console.error("Error en el proceso de reparación:", error)
    throw error
  }
}

export const runtime = "nodejs"
export const maxDuration = 30

