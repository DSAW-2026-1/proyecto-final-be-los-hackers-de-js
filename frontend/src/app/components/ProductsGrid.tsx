import { ProductCard } from './ProductCard';
import { Button } from './ui/button';
import { Grid3x3, List } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Link } from 'react-router';

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Calculadora Científica TI-84 Plus',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1611193412775-1f0f77dfe98e?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Electrónica',
    seller: 'María García',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Libro Cálculo III - Stewart',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop',
    condition: 'Nuevo' as const,
    category: 'Libros',
    seller: 'Juan Pérez',
    rating: 5.0,
  },
  {
    id: 3,
    title: 'MacBook Air M1 2020 - 256GB',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Computadores',
    seller: 'Ana Rodríguez',
    rating: 4.9,
  },
  {
    id: 4,
    title: 'Bicicleta de Montaña Trek',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Deportes',
    seller: 'Carlos López',
    rating: 4.7,
  },
  {
    id: 5,
    title: 'iPad 9na Gen + Apple Pencil',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    condition: 'Nuevo' as const,
    category: 'Tablets',
    seller: 'Laura Martínez',
    rating: 5.0,
  },
  {
    id: 6,
    title: 'Auriculares Sony WH-1000XM4',
    price: 650000,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Audio',
    seller: 'Pedro Silva',
    rating: 4.6,
  },
];

export function ProductsGrid() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">
            Productos Destacados
          </h2>
          <p className="text-muted-foreground">
            Los artículos más populares de la semana
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs defaultValue="grid" className="hidden sm:block">
            <TabsList>
              <TabsTrigger value="grid">
                <Grid3x3 className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PRODUCTS.slice(0, 3).map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            id={product.id.toString()} 
          />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link to="/search">
          <Button variant="outline" size="lg">
            Ver todos los productos
          </Button>
        </Link>
      </div>
    </div>
  );
}
