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
  XCircle,
  Loader2,
  Flag,
  Box
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminService, AdminDashboardStats, AdminReport } from '../services/adminService';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import Base64ImageLoader from './Base64ImageLoader';
import { Avatar, AvatarFallback } from './ui/avatar';

function ReportItemRow({ report }: { report: AdminReport }) {
  const navigate = useNavigate();
  const [reportedName, setReportedName] = useState<string | null>(null);
  const [reportedSubtext, setReportedSubtext] = useState<string | null>(null);
  const [reportedImage, setReportedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (report.type === 'productReport') {
          const product = await productService.getProduct(report.reportedID);
          setName(product.name);
          setSubtext(`${product.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`);
          if (product.images && product.images[0]) {
            setImage(product.images[0]);
          }
        } else {
          const user = await userService.getProfileByUid(report.reportedID);
          setName(user.username);
          setSubtext(user.career || 'Estudiante');
          setImage(user.photo);
        }
      } catch (error) {
        console.error('Error fetching reported item:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [report.reportedID, report.type]);

  // Temporary helper to update local state without changing logic
  const setName = (val: string) => setReportedName(val);
  const setSubtext = (val: string) => setReportedSubtext(val);
  const setImage = (val: string | null) => setReportedImage(val);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors animate-pulse">
        <div className="flex items-center gap-6 flex-1">
          <div className="w-16 h-16 bg-muted rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="w-32 h-10 bg-muted rounded" />
      </div>
    );
  }

  const initials = reportedName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || '??';

  return (
    <div key={report.reportID} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-6 flex-1 text-left">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {report.type === 'productReport' ? (
              <div className="w-16 h-16 rounded bg-stone-100 border flex items-center justify-center overflow-hidden shadow-sm">
                {reportedImage ? (
                  <Base64ImageLoader data={reportedImage} alt={reportedName || ''} className="w-full h-full object-cover" />
                ) : (
                  <Box className="w-8 h-8 text-muted-foreground/40" />
                )}
              </div>
            ) : (
              <Avatar className="w-16 h-16 border shadow-sm">
                {reportedImage ? (
                  <Base64ImageLoader data={reportedImage} alt={reportedName || ''} className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="text-[10px] py-0 h-5 font-bold uppercase tracking-wider">
                {report.type === 'productReport' ? 'Producto' : 'Usuario'}
              </Badge>
              <Badge variant="destructive" className="text-[10px] py-0 h-5 uppercase tracking-tighter shadow-sm">Prioridad Alta</Badge>
            </div>
            <h4 className="font-bold text-lg leading-tight mb-1 truncate text-primary">{report.reportTitle}</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-destructive">Reportado:</span>
              <span className="text-muted-foreground truncate max-w-[200px]">{reportedName || 'Desconocido'}</span>
              {reportedSubtext && (
                <>
                  <span className="text-muted-foreground/30">•</span>
                  <span className="text-muted-foreground truncate">{reportedSubtext}</span>
                </>
              )}
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/80 mt-1 uppercase tracking-widest">ID: {report.reportID.substring(0, 8)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-6 min-w-fit">
        <div className="h-10 border-l mr-3 opacity-20 hidden md:block" />
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="destructive"
            className="shadow-sm"
            onClick={() => {
              if (report.type === 'productReport') navigate(`/admin/delete-product/${report.reportedID}`);
              else navigate(`/admin/suspend-user/${report.reportedID}`);
            }}
          >
            <XCircle className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">{report.type === 'productReport' ? 'Retirar' : 'Suspender'}</span>
            <span className="lg:hidden">Acción</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
            onClick={() => navigate(`/admin/reports/${report.reportID}`)}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            <span className="hidden lg:inline">Ver reporte</span>
            <span className="lg:hidden">Ver</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

const RECENT_PRODUCTS = [
  { id: 1, title: 'MacBook Air M1', seller: 'Ana R.', status: 'Aprobado', date: '2024-04-18' },
  { id: 2, title: 'Calculadora TI-84', seller: 'María G.', status: 'Pendiente', date: '2024-04-18' },
  { id: 3, title: 'Libro Cálculo III', seller: 'Juan P.', status: 'Aprobado', date: '2024-04-17' },
];

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Reports state
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingMoreReports, setLoadingMoreReports] = useState(false);
  const [reportsPage, setReportsPage] = useState(1);
  const [totalReportsPages, setTotalReportsPages] = useState(0);

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
    fetchReports(1, true);
  }, []);

  async function fetchReports(page: number, initial: boolean = false) {
    try {
      if (initial) setLoadingReports(true);
      else setLoadingMoreReports(true);

      const response = await adminService.getReports(page);
      const reportsArray = Object.values(response.results);
      
      if (initial) {
        setReports(reportsArray);
      } else {
        setReports(prev => [...prev, ...reportsArray]);
      }
      
      setReportsPage(response.page);
      setTotalReportsPages(response.pages);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (initial) {
        toast.error('No se pudieron cargar los reportes');
      }
    } finally {
      setLoadingReports(false);
      setLoadingMoreReports(false);
    }
  }

  const handleLoadMoreReports = () => {
    if (reportsPage < totalReportsPages) {
      fetchReports(reportsPage + 1);
    }
  };

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
          <h2 className="text-3xl font-bold text-primary mb-2 text-left">Panel de Administración</h2>
          <p className="text-muted-foreground text-left">Gestiona el marketplace y modera contenido</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-left">
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
          <TabsList className="justify-start">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <div className="p-6 border-b text-left">
                <h3 className="font-semibold text-lg">Productos Recientes</h3>
              </div>
              <div className="divide-y text-left">
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
              <div className="divide-y text-left">
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
              <div className="p-6 border-b text-left">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Flag className="w-5 h-5 text-primary" />
                  Reportes Pendientes
                </h3>
              </div>
              <div className="divide-y text-left">
                {loadingReports ? (
                  <div className="p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-muted-foreground">Cargando reportes...</p>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="p-12 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                    <p className="text-xl font-bold">No hay reportes pendientes</p>
                    <p className="text-muted-foreground">¡Buen trabajo! El marketplace está limpio.</p>
                  </div>
                ) : (
                  <>
                    {reports.map((report) => (
                      <ReportItemRow key={report.reportID} report={report} />
                    ))}
                    
                    {reportsPage < totalReportsPages && (
                      <div className="p-6 border-t flex justify-center">
                        <Button 
                          variant="outline" 
                          onClick={handleLoadMoreReports}
                          disabled={loadingMoreReports}
                        >
                          {loadingMoreReports ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Cargando...
                            </>
                          ) : (
                            'Cargar más reportes'
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
