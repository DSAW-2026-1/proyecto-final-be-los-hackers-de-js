//TODO: PROTOTYPE - NOT INTERACTIVE
 import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar } from './ui/avatar'
import { Star } from 'lucide-react'

type ShippingStatus = 'Pendiente' | 'Confirmado' | 'En tránsito' | 'Entregado' | 'Cancelado'

type Item = {
  name: string
  qty: number
  image?: string
}

const mockItem = {
  id: 'PR-2026-0421',
  name: 'Auriculares inalámbricos ZX-200',
  price: 199000,
  date: '2026-04-20',
  status: 'En tránsito' as ShippingStatus,
  tracking: 'TRACK-2222',
  progress: 65,
  image: undefined,
  items: [
    { name: 'Auriculares inalámbricos ZX-200', qty: 1 },
  ] as Item[]
}

const seller = {
  name: 'Ana Rodríguez',
  dept: 'Ingeniería Informática',
  rating: 4.9,
  sales: 23
}

// Using same statuses and badge mapping as OrderHistory

export function BuyerShippingStatus() {
  const item = mockItem

  const totalQty = (item.items && item.items.length) ? item.items.reduce((s, it) => s + (it.qty || 0), 0) : 1

  function badgeProps(status: ShippingStatus) {
    switch (status) {
      case 'Pendiente':
        return { variant: 'outline' }
      case 'Confirmado':
        return { variant: 'secondary' }
      case 'En tránsito':
        return { variant: 'default' }
      case 'Entregado':
        return { variant: 'default', className: 'bg-green-600' }
      case 'Cancelado':
        return { variant: 'destructive' }
      default:
        return { variant: 'default' }
    }
  }

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">Estado de envío</h1>
          <p className="text-sm text-muted-foreground">Sigue el estado de envío de tu pedido</p>
        </header>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-stretch justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  📦
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {item.name}
                    {item.price != null && (
                      <span className="text-lg font-semibold text-muted-foreground">{` — $${item.price.toLocaleString()} · ${totalQty} ${totalQty > 1 ? 'unidades' : 'unidad'}`}</span>
                    )}
                  </h2>
                  <div className="text-xs text-muted-foreground">Pedido {item.id} · {item.date}</div>
                  <div className="mt-2 text-sm text-gray-700">
                    <div className="text-xs text-muted-foreground">Número de seguimiento: <span className="font-medium">{item.tracking}</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 inline-block">
                <Card className="p-4 bg-secondary/50 border-primary/10 inline-block w-auto">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-lg font-bold">AR</div>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{seller.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{seller.dept}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-medium text-foreground">{seller.rating}</span>
                          <span>({seller.sales} ventas)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="w-48 sm:w-64 flex flex-col justify-between items-end gap-2">
              <div className="flex flex-col items-end gap-2">
                <Badge {...badgeProps(item.status)}>
                  {item.status}
                </Badge>

                {item.status === 'En tránsito' && (
                  <div className="w-48 sm:w-64">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div className="h-2 bg-primary rounded-full" style={{ width: `${item.progress}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">En camino — seguimiento {item.tracking ?? '—'}</div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild size="sm">
                  <a href="#">Ver producto</a>
                </Button>

                <Button asChild variant="outline" size="sm">
                  <a href="#">Dejar reseña</a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
