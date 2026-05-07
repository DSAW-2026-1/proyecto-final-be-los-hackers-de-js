import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Users,
  Package,
  TrendingUp,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminService, AdminDashboardStats } from '../services/adminService';
import { toast } from 'sonner';

const RECENT_PRODUCTS = [
  { id: 1, title: 'MacBook Air M1', seller: 'Ana R.', status: 'Aprobado', date: '2024-04-18' },
  { id: 2, title: 'Calculadora TI-84', seller: 'María G.', status: 'Pendiente', date: '2024-04-18' },
  { id: 3, title: 'Libro Cálculo III', seller: 'Juan P.', status: 'Aprobado', date: '2024-04-17' },
];

const REPORTS = [
  { id: 1, type: 'Producto', item: 'iPhone 13 Pro (Posible fraude)', reporter: 'Carlos L.', priority: 'Alta' },
  { id: 2, type: 'Usuario', item: 'Vendedor con múltiples quejas', reporter: 'Laura M.', priority: 'Media' },
  { id: 3, type: 'Producto', item: 'Descripción engañosa', reporter: 'Pedro S.', priority: 'Baja' },
];

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoadingStats(true);
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('No se pudieron cargar las estadísticas del panel');
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = stats ? [
    { label: 'Usuarios Totales', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Vendedores Activos', value: stats.activeSellers.toLocaleString(), icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { label: 'Productos Totales', value: stats.totalProducts.toLocaleString(), icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: 'Ventas Totales', value: stats.totalSales.toLocaleString(), icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ] : [];

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Panel de Administración</h2>
          <p className="text-muted-foreground">Gestiona el marketplace y modera contenido</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loadingStats ? (
            [...Array(4)].map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="w-12 h-12 rounded-lg bg-muted mb-4" />
                <div className="h-8 bg-muted rounded w-1/2 mb-2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Productos Recientes</h3>
              </div>
              <div className="divide-y">
                {RECENT_PRODUCTS.map((product) => (
                  <div key={product.id} className="p-6 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-muted rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Por {product.seller} • {product.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={product.status === 'Aprobado' ? 'default' : 'secondary'}
                        className={product.status === 'Aprobado' ? 'bg-green-600' : ''}
                      >
                        {product.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Gestión de Usuarios</h3>
                <div className="flex gap-2">
                  <Input placeholder="Buscar usuario..." className="w-64" />
                </div>
              </div>
              <div className="divide-y">
                {[
                  { id: 1, name: 'Ana Rodríguez', email: 'ana.r@unisabana.edu.co', role: 'Vendedor', status: 'Activo' },
                  { id: 2, name: 'Juan Pérez', email: 'juan.p@unisabana.edu.co', role: 'Comprador', status: 'Activo' },
                  { id: 3, name: 'María García', email: 'maria.g@unisabana.edu.co', role: 'Vendedor', status: 'Suspendido' },
                ].map((user) => (
                  <div key={user.id} className="p-6 flex items-center justify-between hover:bg-muted/50">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email} • {user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={user.status === 'Activo' ? 'default' : 'destructive'}
                        className={user.status === 'Activo' ? 'bg-green-600' : ''}
                      >
                        {user.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {user.status === 'Activo' ? 'Suspender' : 'Activar'}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <div className="p-6 border-b">
                <h3 className="font-semibold text-lg">Reportes Pendientes</h3>
              </div>
              <div className="divide-y">
                {REPORTS.map((report) => (
                  <div key={report.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge
                            variant={
                              report.priority === 'Alta'
                                ? 'destructive'
                                : report.priority === 'Media'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {report.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium mb-1">{report.item}</h4>
                        <p className="text-sm text-muted-foreground">
                          Reportado por {report.reporter}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-4 h-4 mr-2" />
                        {report.type === 'Producto' ? 'Retirar' : 'Suspender'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button size="sm" variant="ghost">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
