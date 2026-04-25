import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  SlidersHorizontal, 
  Grid3x3, 
  List, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

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
    location: 'Edificio C'
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
    location: 'Biblioteca'
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
    location: 'Campus Principal'
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
    location: 'Zona Deportiva'
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
    location: 'Campus Principal'
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
    location: 'Edificio A'
  },
  {
    id: 7,
    title: 'Mochila North Face Borealis',
    price: 350000,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    condition: 'Como Nuevo' as const,
    category: 'Accesorios',
    seller: 'Sofía Castro',
    rating: 4.9,
    location: 'Edificio B'
  },
  {
    id: 8,
    title: 'Monitor Dell 24" UltraSharp',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Computadores',
    seller: 'Mateo Ruiz',
    rating: 4.7,
    location: 'Campus Principal'
  },
  {
    id: 9,
    title: 'Camiseta Selección Colombia 2024',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=400&h=300&fit=crop',
    condition: 'Nuevo' as const,
    category: 'Ropa',
    seller: 'Valentina Mesa',
    rating: 4.5,
    location: 'Zona Deportiva'
  },
  {
    id: 10,
    title: 'Kindle Paperwhite 11va Gen',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1594980596229-6aad958bc34a?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Electrónica',
    seller: 'Diego Herrera',
    rating: 4.8,
    location: 'Edificio C'
  },
  {
    id: 11,
    title: 'Estuche para Violín 4/4',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Otros',
    seller: 'Camila Torres',
    rating: 5.0,
    location: 'Edificio de Artes'
  },
  {
    id: 12,
    title: 'Escritorio de Madera Compacto',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f816b1a20a?w=400&h=300&fit=crop',
    condition: 'Usado' as const,
    category: 'Hogar',
    seller: 'Santiago Gil',
    rating: 4.2,
    location: 'Residencias'
  },
];

const CATEGORIES = [
  'Electrónica',
  'Libros',
  'Computadores',
  'Deportes',
  'Ropa',
  'Accesorios',
  'Audio',
  'Tablets'
];

export function ProductSearch() {
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  return (
    <div className="bg-background py-12 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">Explorar Marketplace</h2>
          <p className="text-muted-foreground">Busca entre cientos de artículos de otros estudiantes</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="hidden lg:block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filtros</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground h-8 px-2">
                  Limpiar todo
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <h4 className="font-semibold mb-4 flex items-center justify-between cursor-pointer">
                    Categorías
                    <ChevronDown className="w-4 h-4" />
                  </h4>
                  <div className="space-y-3">
                    {CATEGORIES.slice(0, 6).map((cat) => (
                      <div key={cat} className="flex items-center gap-3">
                        <Checkbox id={`cat-${cat}`} />
                        <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer hover:text-primary transition-colors">
                          {cat}
                        </Label>
                      </div>
                    ))}
                    <Button variant="link" className="p-0 h-auto text-xs text-primary font-semibold">
                      Ver más categorías...
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold mb-6">Rango de Precio (COP)</h4>
                  <Slider 
                    defaultValue={[0, 5000000]} 
                    max={5000000} 
                    step={50000} 
                    className="mb-4"
                    onValueChange={(val) => setPriceRange(val)}
                  />
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">Mínimo</Label>
                      <Input value={`$${priceRange[0].toLocaleString()}`} readOnly className="h-8 text-xs font-mono" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">Máximo</Label>
                      <Input value={`$${priceRange[1].toLocaleString()}`} readOnly className="h-8 text-xs font-mono" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Condition */}
                <div>
                  <h4 className="font-semibold mb-4">Estado</h4>
                  <div className="space-y-3">
                    {['Nuevo', 'Usado - Como Nuevo', 'Usado - Buen Estado', 'Para repuestos'].map((cond) => (
                      <div key={cond} className="flex items-center gap-3">
                        <Checkbox id={`cond-${cond}`} />
                        <Label htmlFor={`cond-${cond}`} className="text-sm cursor-pointer">
                          {cond}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Rating */}
                <div>
                  <h4 className="font-semibold mb-4">Reputación Vendedor</h4>
                  <div className="space-y-3">
                    {[4, 3, 2].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <Checkbox id={`rating-${stars}`} />
                        <Label htmlFor={`rating-${stars}`} className="flex items-center gap-1 cursor-pointer">
                          <span className="text-sm">{stars}+</span>
                          <Star className="w-3 h-3 fill-accent text-accent" />
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter Trigger */}
            <Button variant="outline" className="w-full lg:hidden flex items-center justify-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Ver Filtros
            </Button>
          </aside>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando <span className="font-bold text-foreground">{MOCK_PRODUCTS.length}</span> resultados
              </p>

              <div className="flex items-center gap-3">
                <Tabs defaultValue="grid">
                  <TabsList className="h-8">
                    <TabsTrigger value="grid" className="h-7 w-7 p-0">
                      <Grid3x3 className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="list" className="h-7 w-7 p-0">
                      <List className="w-4 h-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Select defaultValue="relevant">
                  <SelectTrigger className="h-8 w-40 text-xs">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevant">Más relevantes</SelectItem>
                    <SelectItem value="price-low">Precio más bajo</SelectItem>
                    <SelectItem value="price-high">Precio más alto</SelectItem>
                    <SelectItem value="newest">Más recientes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_PRODUCTS.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center pt-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-10 gap-1 px-3">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                {[1, 2, 3, '...', 12].map((page, i) => (
                  <Button 
                    key={i} 
                    variant={page === 1 ? 'default' : 'outline'} 
                    size="sm"
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm" className="h-10 gap-1 px-3">
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Needed for the Select in the results area
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
