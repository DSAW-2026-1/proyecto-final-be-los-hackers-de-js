import React from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

type Item = {
  name: string
  qty: number
  image?: string
}

type Order = {
  id: string
  date: string
  items: Item[]
  status: 'Pendiente' | 'Confirmado' | 'En tránsito' | 'Entregado' | 'Cancelado'
  tracking?: string
}

const mockOrders: Order[] = [
  {
    id: 'PD-2026-001',
    date: '2026-04-18',
    items: [
      { name: 'Camiseta estampada', qty: 1 }
    ],
    status: 'Entregado',
    tracking: 'XXXX-1111'
  },
  {
    id: 'PD-2026-002',
    date: '2026-04-20',
    items: [{ name: 'Auriculares inalámbricos', qty: 1 }],
    status: 'En tránsito',
    tracking: 'TRACK-2222'
  },
  {
    id: 'PD-2026-003',
    date: '2026-04-21',
    items: [{ name: 'Libro de recetas', qty: 1 }],
    status: 'Confirmado',
    tracking: undefined
  },
  {
    id: 'PD-2026-004',
    date: '2026-04-21',
    items: [{ name: 'MacBook Air M1 2020 - 256GB', qty: 1 }],
    status: 'Pendiente',
    tracking: undefined
  }
]


export function OrderHistory() {
  function badgeProps(status: Order['status']) {
    switch (status) {
      case 'Entregado':
        return { variant: 'default', className: 'bg-green-600' }
      case 'Confirmado':
        return { variant: 'secondary' }
      case 'En tránsito':
        return { variant: 'default' }
      case 'Pendiente':
        return { variant: 'outline' }
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
          <h1 className="text-4xl font-bold text-primary mb-2">Historial de pedidos</h1>
          <p className="text-sm text-muted-foreground">Últimos pedidos y estado de envío</p>
        </header>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    📦
                  </div>

                  <div>
                    <div className="text-sm font-medium">Pedido <span className="font-medium">{order.id}</span></div>
                    <div className="text-xs text-muted-foreground">{order.date} · {order.items.length} artículo{order.items.length > 1 ? 's' : ''}</div>
                    <ul className="mt-2 text-sm text-gray-700">
                      {order.items.slice(0, 2).map((it, i) => (
                        <li key={i} className="truncate">{it.qty} × {it.name}</li>
                      ))}
                      {order.items.length > 2 && <li className="text-xs text-muted-foreground">+{order.items.length - 2} más</li>}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                  <Badge {...badgeProps(order.status)}>
                    {order.status}
                  </Badge>

                  {order.status === 'En tránsito' && (
                    <div className="w-48 sm:w-64">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div className="h-2 bg-primary rounded-full" style={{ width: '60%' }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">En camino — seguimiento {order.tracking ?? '—'}</div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <Button asChild size="sm">
                      <a href="#">Ver pedido</a>
                    </Button>

                    <Button asChild variant="outline" size="sm">
                      <a href="#">Contacto</a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
