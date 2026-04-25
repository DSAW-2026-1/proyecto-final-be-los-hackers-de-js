//TODO: PROTOTYPE - NOT INTERACTIVE
import React from "react";

import {
  Card,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";
import { ChartContainer } from "./ui/chart";
import { ShoppingCart, Package, MessageSquare, Star } from "lucide-react";

const sampleProducts = [
  { id: "P-001", title: "Libro de Cálculo (Usado)", price: 25000, stock: 3, status: "active" },
  { id: "P-002", title: "Calculadora Graficadora", price: 550000, stock: 5, status: "active" },
  { id: "P-003", title: "Sobrecolchón para Residencia", price: 40000, stock: 0, status: "sold" },
];

const recentOrders = [
  { id: "O-1001", buyer: "María G.", total: 25000, status: "Entregada" },
  { id: "O-1002", buyer: "Andrés P.", total: 550000, status: "Confirmada" },
];

export function SellerDashboard() {
  const totalProducts = sampleProducts.length;
  const activeOrders = recentOrders.filter((o) => o.status !== "Entregada").length;
  const unreadMessages = 4; // placeholder
  const rating = 4.6;

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Panel de Vendedor</h2>
          <p className="text-muted-foreground">Resumen de actividad y gestión de tus publicaciones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-bold mb-1">{totalProducts}</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-bold mb-1">{activeOrders}</p>
                <p className="text-sm text-muted-foreground">Órdenes activas</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-bold mb-1">{unreadMessages}</p>
                <p className="text-sm text-muted-foreground">Mensajes sin leer</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-rose-50 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-bold mb-1">{rating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Calificación</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Inventario</h3>
              </div>
              <div className="divide-y">
                <div className="p-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleProducts.map((p) => (
                        <TableRow key={p.id} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted rounded-lg" />
                              <div>
                                <h4 className="font-medium mb-1">{p.title}</h4>
                                <p className="text-sm text-muted-foreground">{p.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${p.price.toLocaleString()}</TableCell>
                          <TableCell>{p.stock}</TableCell>
                          <TableCell>
                            <Badge variant={p.status === "active" ? "default" : "secondary"}>
                              {p.status === "active" ? "Activo" : "Vendido"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">Editar</Button>
                              <Button variant="destructive" size="sm">Eliminar</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>

            <Card className="mt-6">
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Órdenes recientes</h3>
              </div>
              <div className="divide-y">
                {recentOrders.map((o) => (
                  <div key={o.id} className="p-6 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-muted rounded-lg" />
                      <div>
                        <h4 className="font-medium mb-1">{o.buyer}</h4>
                        <p className="text-sm text-muted-foreground">{o.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium">${o.total.toLocaleString()}</p>
                      <Badge variant={o.status === "Entregada" ? "outline" : "default"}>{o.status}</Badge>
                      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-white">Actualizar envío</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Rendimiento</h3>
              <p className="text-sm text-muted-foreground mb-4">Ventas mensuales (ejemplo)</p>
              <ChartContainer id="sales" config={{ sales: { label: "Ventas", color: "#2563eb" } }}>
                <svg className="w-full h-40" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2"
                    points="0,30 25,18 50,24 75,12 100,8"
                  />
                </svg>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-2">Accesos rápidos</h3>
              <div className="grid gap-2">
                <Button variant="secondary" size="sm">Publicar nuevo producto</Button>
                <Button variant="outline" size="sm">Ver mensajes ({unreadMessages})</Button>
                <Button variant="ghost" size="sm">Ajustes de envío</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
