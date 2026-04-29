import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';
import { Link } from 'react-router';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  condition: 'Nuevo' | 'Usado';
  category: string;
  seller: string;
  rating: number;
}

export function ProductCard({
  id,
  title,
  price,
  image,
  condition,
  category,
  seller,
  rating,
}: ProductCardProps) {
  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group h-full">
        <div className="relative h-48 bg-muted overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-3 right-3 bg-white text-primary border-0">
            {condition}
          </Badge>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <Badge variant="secondary" className="text-xs mb-2">
              {category}
            </Badge>
            <h3 className="font-semibold line-clamp-2 min-h-[3rem]">{title}</h3>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ${price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">COP</span>
          </div>

          <div className="pt-3 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {seller[0]}
                </div>
                <span className="text-muted-foreground">{seller}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="font-medium">{rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
