import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, CheckCircle, XCircle, FileText, User, Box } from 'lucide-react';

const MOCK_REPORT = {
  id: 42,
  type: 'Producto',
  item: 'Auriculares inalámbricos - Posible falsificación',
  reporter: 'Carlos L.',
  priority: 'Alta',
  date: '2026-04-21',
  description:
    'El vendedor parece estar ofreciendo réplicas pasando por productos originales. Fotos adjuntas muestran discrepancias en el empaquetado y el logo.',
  evidence: ['foto1.jpg', 'foto2.jpg'],
};

export function AdminReportView({ report = MOCK_REPORT }) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  function handleApprove() {
    setStatus('approved');
  }

  function handleStartReject() {
    setShowRejectReason(true);
  }

  function handleViewItem() {
    // placeholder: integrate with router or modal
    console.log('View item:', report.item);
  }

  function handleViewUser() {
    console.log('View user:', report.reporter);
  }

  function handleConfirmReject() {
    if (!rejectReason.trim()) {
      setShowRejectReason(true);
      return;
    }
    setStatus('rejected');
  }

  return (
    <div className="bg-muted/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-primary">Detalle del Reporte</h2>
              <p className="text-sm text-muted-foreground">Revisa el reporte y toma una acción</p>
            </div>
          </div>
          <div>
            <Badge variant="secondary" className="mr-2">
              ID #{report.id}
            </Badge>
            <Badge
              variant={status === 'pending' ? 'outline' : status === 'approved' ? 'default' : 'destructive'}
            >
              {status === 'pending' ? 'Pendiente' : status === 'approved' ? 'Aprobado' : 'Rechazado'}
            </Badge>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{report.type}</Badge>
                <Badge
                  variant={report.priority === 'Alta' ? 'destructive' : report.priority === 'Media' ? 'default' : 'secondary'}
                >
                  {report.priority}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">{report.item}</h3>
              <p className="text-sm text-muted-foreground mb-4">Reportado por {report.reporter} • {report.date}</p>
              <p className="mb-4">{report.description}</p>

              <div className="space-y-2">
                <h4 className="font-medium">Evidencias</h4>
                <div className="flex gap-3 mt-2">
                  {report.evidence.map((e, i) => (
                    <div key={i} className="w-28 h-20 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                      <FileText className="w-4 h-4 mr-1" />
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="w-full md:w-80">
              <Card className="p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{report.reporter}</p>
                    <p className="text-sm text-muted-foreground">Remitente</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Prioridad: {report.priority}</Badge>
                  <Badge variant="secondary">Tipo: {report.type}</Badge>
                  {/* view buttons moved below actions; shown conditionally by report.type */}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Acciones</h4>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleApprove} size="sm" variant="destructive" disabled={status !== 'pending'}>
                    <XCircle className="w-4 h-4 mr-2" /> 
                    {report.type === 'Producto' ? 'Retirar Publicación' : 'Suspender Usuario'}
                  </Button>
                  <Button onClick={handleStartReject} size="sm" variant="outline" disabled={status !== 'pending'}>
                    <CheckCircle className="w-4 h-4 mr-2" /> Rechazar Reporte
                  </Button>

                  {showRejectReason && status === 'pending' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Motivo del rechazo</label>
                      <textarea
                        className="w-full rounded-md border bg-background p-2 text-sm"
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explica por qué consideras que este reporte no procede..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleConfirmReject}>
                          Confirmar rechazo
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setShowRejectReason(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

              </Card>

              {/* Single conditional view button placed below accept/reject actions */}
              <div className="mt-3">
                {report.type === 'Producto' ? (
                  <Button size="sm" variant="outline" onClick={handleViewItem} className="w-full">
                    <Box className="w-4 h-4 mr-2" /> Ver producto
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={handleViewUser} className="w-full">
                    <User className="w-4 h-4 mr-2" /> Ver usuario
                  </Button>
                )}
              </div>

              {status !== 'pending' && (
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        {status === 'approved' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                      <div>
                        <p className="font-medium">Decisión final</p>
                        <p className="text-sm text-muted-foreground">
                          {status === 'approved' 
                            ? (report.type === 'Producto' ? 'Publicación retirada' : 'Usuario suspendido') 
                            : 'Reporte rechazado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </aside>
          </div>
        </Card>
      </div>
    </div>
  );
}
