"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, Download, Sparkles, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Component() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) return

    const name = selectedFile.name || ""
    const type = selectedFile.type || ""

    const noExtension = !name.includes(".")
    const isTextLike = type === "text/plain" || name.endsWith(".txt") || noExtension

    if (isTextLike) {
      setFile(selectedFile)
      setFileName(name || "archivo")
    } else {
      alert("Por favor selecciona un archivo de texto válido (.txt o sin extensión)")
    }
  }


  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      const droppedFile = e.dataTransfer?.files?.[0]
      if (!droppedFile) return

      const name = droppedFile.name || ""
      const type = droppedFile.type || ""
      const noExtension = !name.includes(".")
      const isTextLike = type === "text/plain" || name.endsWith(".txt") || noExtension

      if (isTextLike) {
        setFile(droppedFile)
        setFileName(name || "archivo")
      } else {
        alert("Por favor selecciona un archivo de texto válido (.txt o sin extensión)")
      }
    }

    window.addEventListener("dragover", handleDragOver)
    window.addEventListener("drop", handleDrop)

    return () => {
      window.removeEventListener("dragover", handleDragOver)
      window.removeEventListener("drop", handleDrop)
    }
  }, [])



  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/convertidor/api/convert", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const disposition = response.headers.get("Content-Disposition")
        let filename = "archivo_convertido.xlsx" // Fallback

        if (disposition && disposition.includes("filename=")) {
          const match = disposition.match(/filename="?(.*?)"?$/)
          if (match?.[1]) {
            filename = match[1]
          }
        }

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setDownloadUrl(url)
        setFileName(filename) // 👈 Guardá el nombre para reusarlo
        setShowSuccess(true)

        // Auto download
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } else {
        alert("Error al convertir el archivo")
      }
    } catch (error) {
      alert("Error al procesar el archivo")
    } finally {
      setIsConverting(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setShowSuccess(false)
    setDownloadUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23dce1] via-[#0057ff] to-[#23dce1] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100, 0],
              y: [0, Math.random() * 100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border-4 border-white/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-16 h-16 bg-white/20 transform rotate-45"
        animate={{ rotate: [45, 405] }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-6 p-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src="/convertidor/bluelink_logo.png" alt="Bluelink BPO" className="w-full h-full object-contain" />
          </motion.div>
          {/* <motion.h1
            className="text-4xl font-bold text-white mb-2"
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            TXT A EXCEL
          </motion.h1>
          <motion.h2
            className="text-2xl font-semibold text-white/90 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Bluelink BPO
          </motion.h2> */}
        </motion.div>

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
                {!showSuccess ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* File Upload Area */}
                    <motion.div
                      className={`border-2 border-dashed border-white/40 rounded-xl p-8 text-center transition-all duration-300 ${file ? "bg-white/20" : "hover:bg-white/10"
                        }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                      />

                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {file ? (
                          <FileText className="w-16 h-16 text-white mx-auto mb-4" />
                        ) : (
                          <Upload className="w-16 h-16 text-white mx-auto mb-4" />
                        )}
                      </motion.div>

                      <h3 className="text-2xl font-bold text-white mb-2">{file ? file.name : "Seleccionar Archivo"}</h3>
                      <p className="text-white/80">
                        {file ? "Archivo listo para convertir" : "Haz clic aquí o arrastra tu archivo .txt"}
                      </p>
                    </motion.div>

                    {/* Convert Button */}
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        onClick={handleConvert}
                        disabled={!file || isConverting}
                        className="bg-gradient-to-r from-[#0057ff] to-[#23dce1] hover:from-[#23dce1] hover:to-[#0057ff] text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl transform transition-all duration-300 disabled:opacity-50"
                        size="lg"
                      >
                        <AnimatePresence mode="wait">
                          {isConverting ? (
                            <motion.div
                              key="converting"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              >
                                <Sparkles className="w-6 h-6" />
                              </motion.div>
                              <span>Convirtiendo...</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="convert"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center space-x-2"
                            >
                              <Zap className="w-6 h-6" />
                              <span>CONVERTIR</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
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
                      ¡Convertido Exitosamente!
                    </motion.h2>

                    <motion.p
                      className="text-white/90 text-lg mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Tu archivo Excel ha sido generado y descargado automáticamente
                    </motion.p>

                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      {downloadUrl && fileName && (
                        <Button
                          onClick={() => {
                            const a = document.createElement("a")
                            a.href = downloadUrl
                            a.download = fileName
                            a.click()
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full mr-4"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Descargar Nuevamente
                        </Button>
                      )}

                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="bg-white/20 border-white/40 text-white hover:bg-white/30 font-bold py-3 px-8 rounded-full"
                      >
                        Convertir Otro Archivo
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Watermark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <motion.div
            className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/70 text-sm font-medium"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            @MerzDev
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
