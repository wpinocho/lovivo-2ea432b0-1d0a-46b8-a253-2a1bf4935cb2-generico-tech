import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { createMailsTable, insertDummyMails, getAllMails, searchEmails, addEmail } from '@/lib/setup-mails-table'
import { Mail, Search, Plus, CheckCircle, XCircle, Database } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function MailsAdmin() {
  const [mails, setMails] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSetup, setShowSetup] = useState(true)
  const { toast } = useToast()

  const handleCreateTable = async () => {
    setLoading(true)
    const result = await createMailsTable()
    if (result.success) {
      toast({
        title: '✅ Tabla creada',
        description: 'La tabla "mails" se creó correctamente',
      })
      setShowSetup(false)
    } else {
      toast({
        title: '❌ Error',
        description: 'No se pudo crear la tabla. Puede que ya exista.',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  const handleInsertDummy = async () => {
    setLoading(true)
    const result = await insertDummyMails()
    if (result.success) {
      toast({
        title: '✅ Datos insertados',
        description: '10 correos dummy agregados correctamente',
      })
      loadMails()
    } else {
      toast({
        title: '❌ Error',
        description: 'No se pudieron insertar los datos',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  const loadMails = async () => {
    setLoading(true)
    const result = await getAllMails(false) // Show all, including unsubscribed
    if (result.success && result.data) {
      setMails(result.data)
      setShowSetup(false)
    } else {
      // Table might not exist yet
      setShowSetup(true)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadMails()
      return
    }
    
    setLoading(true)
    const result = await searchEmails(searchTerm)
    if (result.success && result.data) {
      setMails(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadMails()
  }, [])

  return (
    <EcommerceTemplate>
      <div className="min-h-screen bg-[#f5f5f7] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-4">
                <Database className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Base de Datos de Correos
            </h1>
            <p className="text-xl text-muted-foreground">
              Gestiona tu lista de suscriptores y contactos
            </p>
          </div>

          {/* Setup Section */}
          {showSetup && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Configuración Inicial</CardTitle>
                <CardDescription>
                  Primero necesitas crear la tabla en la base de datos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleCreateTable}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Creando...' : '1. Crear Tabla "mails"'}
                </Button>
                <Button 
                  onClick={handleInsertDummy}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Insertando...' : '2. Agregar 10 Correos Dummy'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          {!showSetup && (
            <div className="mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por email, nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  Buscar
                </Button>
                <Button onClick={loadMails} variant="outline" disabled={loading}>
                  Ver Todos
                </Button>
              </div>
            </div>
          )}

          {/* Stats */}
          {!showSetup && mails.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Correos
                  </CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mails.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Suscritos
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mails.filter(m => m.subscribed).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    No Suscritos
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mails.filter(m => !m.subscribed).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mails List */}
          {!showSetup && (
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando...</p>
                  </CardContent>
                </Card>
              ) : mails.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No se encontraron correos</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Intenta con otro término de búsqueda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                mails.map((mail) => (
                  <Card key={mail.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {mail.first_name && mail.last_name 
                                ? `${mail.first_name} ${mail.last_name}`
                                : mail.email}
                            </h3>
                            {mail.subscribed ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Suscrito
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="h-3 w-3 mr-1" />
                                No suscrito
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {mail.email}
                            </p>
                            {mail.phone && (
                              <p>📞 {mail.phone}</p>
                            )}
                            <p className="text-xs">
                              Fuente: <Badge variant="outline">{mail.source}</Badge>
                            </p>
                            {mail.tags && mail.tags.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {mail.tags.map((tag: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {mail.notes && (
                              <p className="mt-2 text-sm italic">
                                💬 {mail.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right text-xs text-muted-foreground">
                          <p>Agregado:</p>
                          <p>{new Date(mail.created_at).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Instructions */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>ℹ️ Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Estructura de la Tabla:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>email</code> - Correo electrónico (único, requerido)</li>
                  <li><code>first_name</code> - Nombre (opcional)</li>
                  <li><code>last_name</code> - Apellido (opcional)</li>
                  <li><code>phone</code> - Teléfono (opcional)</li>
                  <li><code>subscribed</code> - Estado de suscripción (boolean)</li>
                  <li><code>source</code> - Origen del contacto (newsletter, checkout, manual)</li>
                  <li><code>tags</code> - Etiquetas para segmentación (array)</li>
                  <li><code>notes</code> - Notas adicionales (opcional)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Próximos Pasos:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Integrar con el formulario de newsletter de tu sitio</li>
                  <li>Agregar validación de emails duplicados</li>
                  <li>Crear segmentos por tags</li>
                  <li>Exportar a CSV para campañas de email marketing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EcommerceTemplate>
  )
}