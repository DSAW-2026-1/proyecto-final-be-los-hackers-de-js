//TODO: PROTOTYPE - NOT INTERACTIVE
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar } from './ui/avatar'
import { Input } from './ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select'

type ShippingStatus = 'Pendiente' | 'Confirmado' | 'En tránsito' | 'Entregado' | 'Cancelado'

const mockItem = {
  id: 'PR-2026-0421',
  name: 'Auriculares inalámbricos ZX-200',
  price: 199000,
  date: '2026-04-20',
  status: 'Pendiente' as ShippingStatus,
  tracking: '',
  progress: 0,
  items: [
    { name: 'Auriculares inalámbricos ZX-200', qty: 1 },
  ],
}

const buyer = {
  name: 'Carlos Méndez',
  address: {
    line1: 'Calle 123 #45-67',
    line2: 'Piso 12, Apto 3',
    city: 'Bogotá',
    postal: '12345',
    country: 'Colombia',
  },
  phone: '+57 300 123 456',
}

export function SellerShippingUpdate() {
  const [item, setItem] = useState(() => ({ ...mockItem }))
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

  function handleSave() {
    // In a real app, call an API here. For the prototype we'll just log.
    // eslint-disable-next-line no-console
    console.log('Saved shipping update', item)
    alert('Estado guardado (prototipo)')
  }

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">Actualizar estado de envío</h1>
          <p className="text-sm text-muted-foreground">Actualiza el estado, número de seguimiento y progreso del envío</p>
        </header>

        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  🚚
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {item.name}
                    {item.price != null && (
                      <span className="text-lg font-semibold text-muted-foreground">{` — $${item.price.toLocaleString()} · ${totalQty} ${totalQty > 1 ? 'unidades' : 'unidad'}`}</span>
                    )}
                  </h2>
                  <div className="text-xs text-muted-foreground">Pedido {item.id} · {item.date}</div>
                </div>
                <div className="ml-auto flex-shrink-0 flex flex-col items-end gap-2">
                  <Badge {...badgeProps(item.status)}>{item.status}</Badge>
                  {item.status === 'En tránsito' && (
                    <div className="w-40">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                        <div className="h-2 bg-primary rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">En camino — {item.tracking ?? '—'}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 inline-block">
                <Card className="p-4 bg-secondary/50 border-primary/10 inline-block w-auto">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white text-lg font-bold">CM</div>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{buyer.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div className="truncate">
                          {[
                            buyer.address.line1,
                            buyer.address.line2,
                            `${buyer.address.postal} ${buyer.address.city}`.trim(),
                            buyer.address.country,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </div>
                        <div className="mt-1">
                          <Button variant="outline" size="sm" onClick={() => alert('Abrir chat (prototipo)')}>Abrir chat</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Estado</label>
                  <Select value={item.status} onValueChange={(v) => setItem(s => ({ ...s, status: v as ShippingStatus }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue>{item.status}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Confirmado">Confirmado</SelectItem>
                      <SelectItem value="En tránsito">En tránsito</SelectItem>
                      <SelectItem value="Entregado">Entregado</SelectItem>
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Número de seguimiento</label>
                  <Input className="mt-1" value={item.tracking} onChange={(e) => setItem(s => ({ ...s, tracking: e.target.value }))} placeholder="Ej: TRACK-1234" />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm text-muted-foreground">Progreso (%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={item.progress}
                    onChange={(e) => setItem(s => ({ ...s, progress: Number(e.target.value) }))}
                    className="w-full mt-2"
                  />
                  <div className="text-sm text-muted-foreground mt-1">{item.progress}%</div>
                </div>
              </div>

            </div>

            <div className="w-full flex justify-end">
              <div className="flex gap-2">
                <Button onClick={handleSave}>Guardar cambios</Button>
                <Button variant="outline" onClick={() => setItem({ ...mockItem })}>Revertir</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
