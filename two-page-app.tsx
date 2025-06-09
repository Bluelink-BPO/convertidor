"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, ShoppingCart } from "lucide-react"

type PageType = "dashboard" | "products"

export default function Component() {
  const [activePage, setActivePage] = useState<PageType>("dashboard")

  const renderPageContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#0032c1] mb-4">Dashboard Principal</h1>
              <p className="text-lg text-[#2c3b8e] mb-8">Resumen de actividad y estadísticas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-[#23dce1] hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#eef7ff] to-[#7db2ff]/20">
                  <CardTitle className="text-[#0032c1]">Usuarios</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#0057ff]">1,234</div>
                  <p className="text-[#2c3b8e]">Usuarios activos</p>
                </CardContent>
              </Card>
              <Card className="border-[#23dce1] hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#eef7ff] to-[#7db2ff]/20">
                  <CardTitle className="text-[#0032c1]">Ventas</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#0057ff]">$45,678</div>
                  <p className="text-[#2c3b8e]">Ingresos totales</p>
                </CardContent>
              </Card>
              <Card className="border-[#23dce1] hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#eef7ff] to-[#7db2ff]/20">
                  <CardTitle className="text-[#0032c1]">Inventario</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#0057ff]">89</div>
                  <p className="text-[#2c3b8e]">Productos disponibles</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#23dce1] mt-8">
              <CardHeader>
                <CardTitle className="text-[#0032c1]">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center justify-between border-b border-[#eef7ff] pb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#23dce1] to-[#7db2ff] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold">A</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#0032c1]">Acción #{item}</p>
                          <p className="text-sm text-[#2c3b8e]">Hace {item * 2} horas</p>
                        </div>
                      </div>
                      <Badge className="bg-[#eef7ff] text-[#0057ff]">Completado</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "products":
        return (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[#0032c1]">Catálogo de Productos</h1>
              <Button className="bg-[#0057ff] hover:bg-[#0032c1]">Nuevo Producto</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((product) => (
                <Card key={product} className="border-[#23dce1] hover:shadow-lg transition-shadow">
                  <div className="w-full h-40 bg-gradient-to-br from-[#eef7ff] to-[#7db2ff]/40 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#0032c1] mb-2">Producto {product}</h3>
                    <p className="text-[#2c3b8e] mb-4">
                      Descripción del producto {product}. Características y detalles importantes.
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#0057ff]">${(product * 25).toFixed(2)}</span>
                      <Badge className="bg-[#23dce1] text-[#0032c1]">En Stock</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Página no encontrada</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef7ff] to-white">
      {/* Header with Navigation */}
      <header className="bg-white border-b border-[#23dce1] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#23dce1] to-[#0057ff] rounded-lg mr-3"></div>
              <h1 className="text-xl font-bold text-[#0032c1]">Mi Aplicación</h1>
            </div>

            {/* Navigation Buttons */}
            <nav className="flex space-x-2">
              <Button
                variant={activePage === "dashboard" ? "default" : "outline"}
                className={`flex items-center ${
                  activePage === "dashboard"
                    ? "bg-[#0057ff] hover:bg-[#0032c1] text-white"
                    : "border-[#23dce1] text-[#0032c1] hover:bg-[#eef7ff]"
                }`}
                onClick={() => setActivePage("dashboard")}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activePage === "products" ? "default" : "outline"}
                className={`flex items-center ${
                  activePage === "products"
                    ? "bg-[#0057ff] hover:bg-[#0032c1] text-white"
                    : "border-[#23dce1] text-[#0032c1] hover:bg-[#eef7ff]"
                }`}
                onClick={() => setActivePage("products")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Productos
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderPageContent()}</main>
    </div>
  )
}
