import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Star, MapPin, Calendar, Package, ShoppingBag, MessageCircle, Edit, Loader2, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { userService, UserProfileResponse } from '../services/userService';
import { productService, SearchResultItem } from '../services/productService';
import { ApiError } from '../services/api';
import { NotFound } from './NotFound';
import { ProductCard } from './ProductCard';
import { ConnectionError } from './ConnectionError';

const REVIEWS = [
  {
    id: 1,
    reviewer: 'Carlos López',
    rating: 5,
    comment: 'Excelente vendedor, producto tal como se describió. Muy recomendado!',
    date: '15 Abril 2026'
  },
  {
    id: 2,
    reviewer: 'María García',
    rating: 4,
    comment: 'Buena comunicación y entrega rápida. El producto llegó en buen estado.',
    date: '10 Abril 2026'
  },
];

export function UserProfile() {
  const { isAuthenticated, user: contextUser, setUserInfo } = useAuth();
  const { uid } = useParams<{ uid?: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [products, setProducts] = useState<SearchResultItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const isOwnProfile = !uid;

  useEffect(() => {
    // Prevent multiple redirects and toasts in the same cycle
    let isMounted = true;

    const fetchProfile = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      setErrorStatus(null);
      
      try {
        const data = isOwnProfile 
          ? await userService.getProfile() 
          : await userService.getProfileByUid(uid!);
        
        if (isMounted) {
          setUser(data);
          // Sync with context if it's our own profile and we don't have the info there yet
          if (isOwnProfile && (!contextUser || contextUser.username !== data.username)) {
            setUserInfo({ username: data.username, email: data.email });
          }

          // Fetch products if user is a seller
          if (data.isSeller) {
            setLoadingProducts(true);
            try {
              const profileUid = uid || authService.getUid();
              if (profileUid) {
                const productResp = await productService.searchProducts({ 
                  sellerID: profileUid,
                  page: 1 
                });
                if (isMounted) {
                  setProducts(Object.values(productResp.results));
                  setCount(productResp.count);
                }
              }
            } catch (err) {
              console.error('Error fetching seller products:', err);
              setCount(0);
            } finally {
              if (isMounted) {
                setLoadingProducts(false);
              }
            }
          }
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching profile:', error);
        const apiError = error as ApiError;
        const status = apiError.status || 500;
        setErrorStatus(status);
        
        if (status !== 404) {
          const errorMsg = isOwnProfile ? 'Error al cargar tu perfil' : 'Error al cargar el perfil del usuario';
          toast.error(errorMsg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, navigate, uid, isOwnProfile, contextUser, setUserInfo]);

  if (isOwnProfile && !isAuthenticated) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (errorStatus === 404) {
    return <NotFound />;
  }

  if (!user || errorStatus) {
    return <ConnectionError onRetry={() => window.location.reload()} />;
  }

  const userInitial = user.username.charAt(0).toUpperCase();

  return (
    <div className="bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary to-primary/80" />

          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 mb-6">
              <div className="flex items-end gap-6">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  {user.photo ? (
                    <img 
                      src={`data:image/jpeg;base64,${user.photo}`} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold">
                      {userInitial}
                    </div>
                  )}
                </Avatar>

                <div className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{user.username}</h1>
                    <Badge className="bg-green-600">Verificado</Badge>
                    {user.isSeller && <Badge variant="outline" className="border-primary text-primary">Vendedor</Badge>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Universidad de La Sabana</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Miembro Activo</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    {user.career || 'Estudiante'} • {user.isSeller ? 'Vendedor verificado' : 'Comprador verificado'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0 md:pb-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline" onClick={() => navigate('/chat')}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Mensajes
                    </Button>
                    <Button onClick={() => navigate('/profile/edit')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate(`/chat?user=${user.username}`)}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                    <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Flag className="w-4 h-4 mr-2" />
                      Reportar
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center bg-primary/5">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 fill-accent text-accent mr-1" />
                  <span className="text-2xl font-bold">
                    {user.reputation ? user.reputation.split(' ')[0] : '0.0'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Calificación</p>
              </Card>

              <Card className="p-4 text-center bg-primary/5">
                <div className="flex items-center justify-center mb-2">
                  <Package className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{user.sales}</span>
                </div>
                <p className="text-sm text-muted-foreground">Ventas</p>
              </Card>

              {/* These sections could be data-driven later */}
              <Card className="p-4 text-center bg-primary/5">
                <div className="flex items-center justify-center mb-2">
                  <ShoppingBag className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{loadingProducts ? '...' : count}</span>
                </div>
                <p className="text-sm text-muted-foreground">Publicados</p>
              </Card>

              <Card className="p-4 text-center bg-primary/5">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="w-5 h-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">98%</span>
                </div>
                <p className="text-sm text-muted-foreground">Respuesta</p>
              </Card>
            </div>

            <Tabs defaultValue="products" className="mt-8">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="products">Productos Activos</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas ({REVIEWS.length})</TabsTrigger>
                <TabsTrigger value="about">Acerca de</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                {user.isSeller ? (
                  <>
                    {loadingProducts ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : products.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                          <ProductCard 
                            key={product.productID}
                            id={product.productID}
                            title={product.name}
                            price={product.price}
                            image={product.image}
                            rating={product.rating}
                            seller={user.username}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Este usuario no tiene productos activos actualmente.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {isOwnProfile ? 'No eres un vendedor activo todavía.' : 'Este usuario no tiene productos activos.'}
                    </p>
                    {isOwnProfile && (
                      <Button variant="link" onClick={() => navigate('/seller/products/create')}>
                        ¡Empieza a vender ahora!
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {REVIEWS.map((review) => (
                    <Card key={review.id} className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                              {review.reviewer.split(' ').map(n => n[0]).join('')}
                            </div>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{review.reviewer}</h4>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                    </Card>
                  ))}
                  {REVIEWS.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aún no hay reseñas.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Información del Usuario</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-muted-foreground">Programa académico</span>
                      <span className="font-medium">{user.career || 'No especificado'}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-muted-foreground">Universidad</span>
                      <span className="font-medium">Universidad de La Sabana</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-muted-foreground">Ubicación</span>
                      <span className="font-medium">Campus Principal</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground">Tiempo de respuesta</span>
                      <span className="font-medium">~2 horas</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
