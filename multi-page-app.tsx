"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, Users, Settings, BarChart3, Mail, ShoppingCart } from "lucide-react"

type PageType = "home" | "analytics" | "users" | "products" | "messages" | "settings"

export default function Component() {
  const [activePage, setActivePage] = useState<PageType>("home")

  const navigationItems = [
    { id: "home" as PageType, label: "Inicio", icon: Home },
    { id: "analytics" as PageType, label: "Analíticas", icon: BarChart3 },
    { id: "users" as PageType, label: "Usuarios", icon: Users },
    { id: "products" as PageType, label: "Productos", icon: ShoppingCart },
    { id: "messages" as PageType, label: "Mensajes", icon: Mail },
    { id: "settings" as PageType, label: "Configuración", icon: Settings },
  ]

  const renderPageContent = () => {
    switch (activePage) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#0032c1] mb-4">Bienvenido al Dashboard</h1>
              <p className="text-lg text-[#2c3b8e] mb-8">Gestiona tu aplicación desde un solo lugar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-[#23dce1] hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#eef7ff] to-[#7db2ff]/20">
                  <CardTitle className="text-[#0032c1]">Estadísticas Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#0057ff]">1,234</div>
                  <p className="text-[#2c3b8e]">Usuarios activos</p>
                </CardContent>
              </Card>
              <Card className="border-[#23dce1] hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#eef7ff] to-[#7db2ff]/20">
                  <CardTitle className="text-[#0032c1]">Ventas del Mes</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#0057ff]">$45,678</div>
                  <p className="text-[#2c3b8e]">+12% vs mes anterior</p>
                </CardContent>
              </Card>
              <Card className="border-[#23dce1] hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-[#eef7ff] to-[#7db2ff]/20">
                  <CardTitle className="text-[#0032c1]">Productos</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-[#0057ff]">89</div>
                  <p className="text-[#2c3b8e]">En inventario</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#0032c1]">Analíticas</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-[#23dce1]">
                <CardHeader>
                  <CardTitle className="text-[#0032c1]">Tráfico del Sitio</CardTitle>
                  <CardDescription>Visitantes en los últimos 30 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-t from-[#eef7ff] to-[#7db2ff]/30 rounded-lg flex items-center justify-center">
                    <p className="text-[#2c3b8e]">Gráfico de tráfico aquí</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#23dce1]">
                <CardHeader>
                  <CardTitle className="text-[#0032c1]">Conversiones</CardTitle>
                  <CardDescription>Tasa de conversión mensual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-t from-[#eef7ff] to-[#23dce1]/30 rounded-lg flex items-center justify-center">
                    <p className="text-[#2c3b8e]">Gráfico de conversiones aquí</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[#0032c1]">Usuarios</h1>
              <Button className="bg-[#0057ff] hover:bg-[#0032c1]">Agregar Usuario</Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((user) => (
                <Card key={user} className="border-[#23dce1]">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#23dce1] to-[#7db2ff] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">U{user}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0032c1]">Usuario {user}</h3>
                        <p className="text-[#2c3b8e]">usuario{user}@email.com</p>
                      </div>
                    </div>
                    <Badge className="bg-[#eef7ff] text-[#0057ff] hover:bg-[#7db2ff]/20">Activo</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "products":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-[#0032c1]">Productos</h1>
              <Button className="bg-[#0057ff] hover:bg-[#0032c1]">Nuevo Producto</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((product) => (
                <Card key={product} className="border-[#23dce1] hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-full h-32 bg-gradient-to-br from-[#eef7ff] to-[#7db2ff]/40 rounded-lg mb-4"></div>
                    <CardTitle className="text-[#0032c1]">Producto {product}</CardTitle>
                    <CardDescription>Descripción del producto {product}</CardDescription>
                  </CardHeader>
                  <CardContent>
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

      case "messages":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#0032c1]">Mensajes</h1>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((message) => (
                <Card key={message} className="border-[#23dce1]">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#23dce1] to-[#7db2ff] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">M</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-[#0032c1]">Mensaje {message}</h3>
                          <span className="text-sm text-[#2c3b8e]">Hace 2 horas</span>
                        </div>
                        <p className="text-[#2c3b8e]">
                          Este es el contenido del mensaje {message}. Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#0032c1]">Configuración</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-[#23dce1]">
                <CardHeader>
                  <CardTitle className="text-[#0032c1]">Configuración General</CardTitle>
                  <CardDescription>Ajustes básicos de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#2c3b8e]">Notificaciones</span>
                    <Button variant="outline" size="sm" className="border-[#23dce1] text-[#0057ff]">
                      Activado
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#2c3b8e]">Modo Oscuro</span>
                    <Button variant="outline" size="sm" className="border-[#23dce1] text-[#0057ff]">
                      Desactivado
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#2c3b8e]">Idioma</span>
                    <Button variant="outline" size="sm" className="border-[#23dce1] text-[#0057ff]">
                      Español
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#23dce1]">
                <CardHeader>
                  <CardTitle className="text-[#0032c1]">Seguridad</CardTitle>
                  <CardDescription>Configuración de seguridad y privacidad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-[#0057ff] hover:bg-[#0032c1]">Cambiar Contraseña</Button>
                  <Button variant="outline" className="w-full border-[#23dce1] text-[#0057ff]">
                    Autenticación de Dos Factores
                  </Button>
                  <Button variant="outline" className="w-full border-[#23dce1] text-[#0057ff]">
                    Descargar Datos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return <div>Página no encontrada</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef7ff] to-white">
      {/* Header */}
      <header className="bg-white border-b border-[#23dce1] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#23dce1] to-[#0057ff] rounded-lg mr-3"></div>
              <h1 className="text-xl font-bold text-[#0032c1]">Mi Aplicación</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-[#23dce1] text-[#0032c1]">
                {navigationItems.find((item) => item.id === activePage)?.label}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activePage === item.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      activePage === item.id
                        ? "bg-[#0057ff] hover:bg-[#0032c1] text-white"
                        : "text-[#2c3b8e] hover:bg-[#eef7ff] hover:text-[#0032c1]"
                    }`}
                    onClick={() => setActivePage(item.id)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="animate-in fade-in-50 duration-200">{renderPageContent()}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
