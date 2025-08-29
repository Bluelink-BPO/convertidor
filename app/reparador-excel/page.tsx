"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Download, FileSpreadsheet, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function ExcelRepairApp() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isRepairing, setIsRepairing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [repairStatus, setRepairStatus] = useState<"idle" | "success" | "error">("idle")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && (selectedFile.name.endsWith(".xls") || selectedFile.name.endsWith(".xlsx"))) {
      setFile(selectedFile)
      setRepairStatus("idle")
      setDownloadUrl(null)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith(".xls") || droppedFile.name.endsWith(".xlsx"))) {
      setFile(droppedFile)
      setRepairStatus("idle")
      setDownloadUrl(null)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const repairFile = async () => {
    if (!file) return

    setIsRepairing(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/reparador-excel/api/repair-excel", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        // Get the filename from response headers
        const contentDisposition = response.headers.get("content-disposition")
        let filename = file.name.replace(/\.(xlsx?)$/, "_reparado.$1")

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        const blob = await response.blob()
        console.log("Blob created:", blob.size, "bytes")

        // Force download with save dialog
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          // For IE/Edge
          ; (window.navigator as any).msSaveOrOpenBlob(blob, filename)
        } else {
          // For modern browsers
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = filename
          link.style.display = "none"

          // Force the browser to show save dialog
          link.setAttribute("target", "_blank")

          document.body.appendChild(link)

          // Trigger download
          link.click()

          // Clean up
          document.body.removeChild(link)

          // Clean up the URL object after a delay
          setTimeout(() => {
            URL.revokeObjectURL(url)
          }, 1000)
        }

        setRepairStatus("success")

        // Reset after successful download to allow new file selection
        setTimeout(() => {
          setFile(null)
          setRepairStatus("idle")
          setProgress(0)
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error("Error:", errorData)
        setRepairStatus("error")
      }
    } catch (error) {
      console.error("Network error:", error)
      setRepairStatus("error")
    } finally {
      setIsRepairing(false)
    }
  }

  const downloadRepairedFile = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/reparador-excel/api/repair-excel", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const contentDisposition = response.headers.get("content-disposition")
        let filename = file.name.replace(/\.(xlsx?)$/, "_reparado.$1")

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/)
          if (filenameMatch) {
            filename = filenameMatch[1]
          }
        }

        const blob = await response.blob()

        // Force download with save dialog
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          ; (window.navigator as any).msSaveOrOpenBlob(blob, filename)
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = filename
          link.style.display = "none"
          link.setAttribute("target", "_blank")

          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          setTimeout(() => {
            URL.revokeObjectURL(url)
          }, 1000)
        }

        // Reset after download
        setTimeout(() => {
          setFile(null)
          setRepairStatus("idle")
          setProgress(0)
        }, 1000)
      }
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23dce1] via-[#0057ff] to-[#23dce1] p-4 overflow-y-auto">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <Image src="/convertidor/bluelink_logo.png" alt="Bluelink BPO" width={300} height={80} className="drop-shadow-2xl opacity-0" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Reparador de Excel
            <Sparkles className="inline-block ml-2 text-[#23dce1] animate-pulse" size={40} />
          </h1>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {repairStatus !== "success" ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Área de carga */}
                    <motion.div
                      className={`border-2 border-dashed border-white/40 rounded-xl p-8 text-center transition-all duration-300 ${file ? "bg-white/20" : "hover:bg-white/10"}`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => !file && fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xls,.xlsx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {!file ? (
                          <Upload className="w-16 h-16 text-white mx-auto mb-4" />
                        ) : (
                          <FileSpreadsheet className="w-16 h-16 text-[#23dce1] mx-auto mb-4" />
                        )}
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-2">
                        {file ? file.name : "Seleccionar Archivo"}
                      </h3>
                      <p className="text-white/80">
                        {file
                          ? `Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB`
                          : "Haz clic aquí o arrastra tu archivo .xls o .xlsx"}
                      </p>
                    </motion.div>

                    {/* Botones */}
                    {file && !isRepairing && repairStatus === "idle" && (
                      <motion.div
                        className="text-center space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          onClick={repairFile}
                          className="bg-gradient-to-r from-[#0057ff] to-[#23dce1] hover:from-[#23dce1] hover:to-[#0057ff] text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl transition-all duration-300"
                        >
                          <Sparkles className="mr-2" />
                          Reparar Archivo
                        </Button>

                        <Button
                          onClick={() => {
                            setFile(null)
                            setRepairStatus("idle")
                            setDownloadUrl(null)
                          }}
                          variant="outline"
                          className="bg-white/20 border-white/40 text-white hover:bg-white/30 font-bold py-4 px-8 rounded-full"
                        >
                          Cambiar Archivo
                        </Button>
                      </motion.div>
                    )}

                    {/* Progreso */}
                    {isRepairing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium">Reparando archivo...</span>
                          <span className="text-white">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-3 bg-white/20" />
                      </motion.div>
                    )}

                    {/* Error */}
                    {repairStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-2"
                      >
                        <AlertCircle className="text-red-400" size={24} />
                        <span className="text-white font-semibold">Error al reparar el archivo</span>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  // Estado de éxito
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-4" />
                    </motion.div>

                    <motion.h2
                      className="text-4xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      ¡Reparado Exitosamente!
                    </motion.h2>

                    <motion.p
                      className="text-white/90 text-lg mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Tu archivo ha sido reparado y descargado automáticamente.
                    </motion.p>

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {downloadUrl && (
                        <Button
                          onClick={downloadRepairedFile}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full mr-4"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Descargar Nuevamente
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          setFile(null)
                          setRepairStatus("idle")
                          setDownloadUrl(null)
                        }}
                        variant="outline"
                        className="bg-white/20 border-white/40 text-white hover:bg-white/30 font-bold py-3 px-8 rounded-full"
                      >
                        Reparar Otro Archivo
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>


        {/* Watermark */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Desarrollado por <span className="font-bold text-[#23dce1]">@MerzDev</span>
          </p>
        </div>
      </div>
    </div>
  )
}
