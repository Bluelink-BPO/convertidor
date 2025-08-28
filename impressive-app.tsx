"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Users, BarChart3, Sparkles, Zap } from "lucide-react"
import ComponentTxtAexcel from "./app/convert-excel/page"
import ExcelRepairApp from "./app/reparador-excel/page"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Wrench, HelpCircle } from "lucide-react";
import ComponentInfoDev from "./components/info-desarrollador"

const getIconByLabel = (label: string) => {
  switch (label) {
    case "Txt a Excel":
      return FileText;
    case "Reparador de Excel":
      return Wrench;
    default:
      return HelpCircle; // Ícono por defecto
  }
};

// Configuración de páginas - AQUÍ PUEDES AGREGAR TUS RUTAS
const pageConfig = [
  {
    id: "dashboard",
    label: "Txt a Excel",
    icon: getIconByLabel("Txt a Excel"),
    gradient: "from-[#23dce1] via-[#0057ff] to-[#0032c1]",
  },
  {
    id: "analytics",
    label: "Reparador de Excel",
    icon: getIconByLabel("Reparador de Excel"),
    gradient: "from-[#7db2ff] via-[#0057ff] to-[#2c3b8e]",
  },
];

type PageType = "dashboard" | "analytics"

export default function Component() {
  const [activePage, setActivePage] = useState<PageType>("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handlePageChange = (page: PageType) => {
    if (page === activePage) return
    setIsLoading(true)
    setTimeout(() => {
      setActivePage(page)
      setIsLoading(false)
    }, 300)
  }

  const renderPageContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#23dce1] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-[#0057ff] border-b-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
        </div>
      )
    }

    switch (activePage) {
      case "dashboard":
        return (
          < ComponentTxtAexcel />
        )

      case "analytics":
        return (
          < ExcelRepairApp />
        )

      default:
        return <div>Página no encontrada</div>
    }
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#eef7ff] via-white to-[#7db2ff]/10 -z-10">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-[#23dce1]/20 to-[#0057ff]/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transition: "all 0.3s ease-out",
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-[#7db2ff]/20 to-[#2c3b8e]/20 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Logo flotante a la izquierda */}
      <div className="fixed top-4 left-4 z-50 pointer-events-auto">
        <div className="flex items-center justify-center w-28 h-28 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-xl border border-white/30 hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
          <img
            src="bluelink_logo.png"
            alt="Bluelink BPO"
            className="w-full h-full object-contain"
          />
        </div>
      </div>


      <div className="fixed top-4 right-4 z-50 pointer-events-auto">
        <div className="flex items-center justify-center w-28 h-28 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-xl border border-white/30 hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer">
          <img
            src="logo_supergiros.png"
            alt="Bluelink BPO"
            className="w-106 h-106 object-contain" // Cambia 96 por el tamaño que quieras
          />
        </div>
      </div>


      {/* Floating Navigation - Completamente flotante */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-white/90 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-2xl border border-white/30 hover:bg-white/95 transition-all duration-300">
          <div className="flex gap-1">
            {pageConfig.map((page) => {
              const Icon = page.icon
              const isActive = activePage === page.id
              return (
                <Button
                  key={page.id}
                  variant="ghost"
                  size="sm"
                  className={`relative overflow-hidden rounded-xl px-4 py-2 transition-all duration-500 text-xs font-medium ${isActive
                    ? `bg-gradient-to-r ${page.gradient} text-white shadow-lg scale-105`
                    : "text-[#0032c1] hover:bg-[#eef7ff] hover:scale-102"
                    }`}
                  onClick={() => handlePageChange(page.id as PageType)}
                >
                  {isActive && <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl"></div>}
                  <Icon className={`mr-1.5 h-3.5 w-3.5 ${isActive ? "animate-bounce" : ""}`} />
                  <span className="relative z-10">{page.label}</span>
                  {isActive && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#23dce1] rounded-full animate-ping"></div>
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content - 100% del espacio */}
      <main className="w-full h-full">
        <div className="w-full h-full">
          <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700 w-full h-full">
            {renderPageContent()}
          </div>
        </div>
      </main>


      <style jsx>{`
      @keyframes slideUp {
        from {
          height: 0%;
          opacity: 0;
        }
        to {
          height: var(--final-height);
          opacity: 1;
        }
      }
      
      .animate-reverse {
        animation-direction: reverse;
      }

      .scale-102 {
        transform: scale(1.02);
      }
    `}</style>

      {/* Watermark */}
      < ComponentInfoDev
        nombreDesarrollador="@MerzDev"
        especialidad="Backend Developer"
        correo="frederich.merz@bluelinkbpo.com.co"
        empresa="Bluelink BPO"
        area="TI"
        posicionBoton="right-4"
        cargo="Aprendiz TI"
      />


      < ComponentInfoDev
        nombreDesarrollador="@JormanDev"
        especialidad="Backend Developer"
        correo="jorman.viafara@bluelinkbpo.com.co"
        empresa="Bluelink BPO"
        area="TI"
        posicionBoton="left-4"
        cargo="Analista de Implementacion"
      />



    </div>
  )
}
