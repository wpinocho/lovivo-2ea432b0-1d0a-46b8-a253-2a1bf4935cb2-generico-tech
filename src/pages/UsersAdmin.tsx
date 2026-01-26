import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { 
  createUsersTrackingTable, 
  insertDummyUsers, 
  getAllUsers,
  getUserStats,
  SQL_CREATE_USERS_TRACKING_TABLE
} from '@/lib/setup-users-table'
import { Users, Monitor, Smartphone, Tablet, Database, MapPin, Eye } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const { toast } = useToast()

  const handleCreateTable = async () => {
    setLoading(true)
    const result = await createUsersTrackingTable()
    if (result.success) {
      toast({
        title: '✅ Tabla creada',
        description: 'La tabla "users_tracking" se creó correctamente',
      })
      setShowSetup(false)
      loadUsers()
    } else {
      toast({
        title: '⚠️ Importante',
        description: 'Necesitas ejecutar el SQL manualmente en Supabase Dashboard',
        variant: 'default'
      })
    }
    setLoading(false)
  }

  const handleInsertDummy = async () => {
    setLoading(true)
    const result = await insertDummyUsers()
    if (result.success) {
      toast({
        title: '✅ Datos insertados',
        description: '5 usuarios dummy agregados correctamente',
      })
      loadUsers()
    } else {
      toast({
        title: '❌ Error',
        description: 'No se pudieron insertar los datos',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  const loadUsers = async () => {
    setLoading(true)
    const result = await getAllUsers()
    if (result.success && result.data) {
      setUsers(result.data)
      setShowSetup(false)
      loadStats()
    } else {
      setShowSetup(true)
    }
    setLoading(false)
  }

  const loadStats = async () => {
    const result = await getUserStats()
    if (result.success) {
      setStats(result.stats)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_CREATE_USERS_TRACKING_TABLE)
    toast({
      title: '📋 SQL copiado',
      description: 'Ahora pégalo en Supabase Dashboard > SQL Editor',
    })
  }

  return (
    <EcommerceTemplate>
      <div className="min-h-screen bg-[#f5f5f7] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Tracking de Usuarios
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitorea visitantes y comportamiento en tu sitio
            </p>
          </div>

          {/* Setup Section */}
          {showSetup && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Configuración Inicial</CardTitle>
                <CardDescription>
                  Primero necesitas crear la tabla en Supabase
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    ⚠️ La función exec_sql no está disponible
                  </p>
                  <p className="text-sm text-yellow-700">
                    Necesitas ejecutar el SQL manualmente en Supabase Dashboard:
                  </p>
                  <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
                    <li>Ve a tu proyecto en Supabase Dashboard</li>
                    <li>Click en "SQL Editor" en el menú lateral</li>
                    <li>Crea una nueva query</li>
                    <li>Pega el SQL y ejecuta</li>
                  </ol>
                </div>

                <Button 
                  onClick={copySQL}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  📋 Copiar SQL para crear tabla
                </Button>

                <Button 
                  onClick={handleCreateTable}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Intentando crear...' : 'Intentar crear tabla automáticamente'}
                </Button>
                
                <Button 
                  onClick={handleInsertDummy}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Insertando...' : '2. Agregar 5 Usuarios Dummy'}
                </Button>

                <Button 
                  onClick={loadUsers}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Verificar si la tabla existe
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          {!showSetup && stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Usuarios
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Desktop
                  </CardTitle>
                  <Monitor className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.devices.desktop || 0}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Mobile
                  </CardTitle>
                  <Smartphone className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.devices.mobile || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tablet
                  </CardTitle>
                  <Tablet className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.devices.tablet || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users List */}
          {!showSetup && (
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Todos ({users.length})</TabsTrigger>
                <TabsTrigger value="registered">
                  Registrados ({users.filter(u => u.email).length})
                </TabsTrigger>
                <TabsTrigger value="anonymous">
                  Anónimos ({users.filter(u => !u.email).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {loading ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-muted-foreground">Cargando...</p>
                    </CardContent>
                  </Card>
                ) : users.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">No hay usuarios tracked</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Los usuarios se agregarán automáticamente cuando visiten tu sitio
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">
                                {user.email || `Usuario Anónimo`}
                              </h3>
                              {user.email ? (
                                <Badge variant="default" className="bg-green-500">
                                  Registrado
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  Anónimo
                                </Badge>
                              )}
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getDeviceIcon(user.device_type)}
                                {user.device_type || 'Unknown'}
                              </Badge>
                            </div>
                            
                            {user.first_name && user.last_name && (
                              <p className="text-sm font-medium text-muted-foreground mb-2">
                                {user.first_name} {user.last_name}
                              </p>
                            )}

                            <div className="space-y-1 text-sm text-muted-foreground">
                              {user.phone && (
                                <p>📞 {user.phone}</p>
                              )}
                              
                              <p className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Visitas: <strong>{user.visit_count}</strong>
                              </p>

                              <p>
                                🌐 Landing: <code className="text-xs bg-muted px-1 py-0.5 rounded">{user.landing_page}</code>
                              </p>

                              <p>
                                📄 Página actual: <code className="text-xs bg-muted px-1 py-0.5 rounded">{user.current_page}</code>
                              </p>

                              {user.referrer && (
                                <p>
                                  🔗 Referrer: <code className="text-xs bg-muted px-1 py-0.5 rounded">{user.referrer}</code>
                                </p>
                              )}

                              {(user.country || user.city) && (
                                <p className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {user.city && user.country ? `${user.city}, ${user.country}` : user.country || user.city}
                                </p>
                              )}

                              <p className="text-xs">
                                Session ID: <code className="bg-muted px-1 py-0.5 rounded">{user.session_id}</code>
                              </p>

                              <p className="text-xs">
                                IP: <code className="bg-muted px-1 py-0.5 rounded">{user.ip_address}</code>
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right text-xs text-muted-foreground">
                            <p>Primera visita:</p>
                            <p className="font-medium">{new Date(user.created_at).toLocaleDateString('es-MX')}</p>
                            <p className="mt-2">Última visita:</p>
                            <p className="font-medium">{new Date(user.last_visit).toLocaleDateString('es-MX')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="registered" className="space-y-4">
                {users.filter(u => u.email).map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">{user.email}</h3>
                          {user.first_name && user.last_name && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {user.first_name} {user.last_name}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getDeviceIcon(user.device_type)}
                              {user.device_type}
                            </Badge>
                            <Badge variant="outline">
                              {user.visit_count} visitas
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>Registrado:</p>
                          <p className="font-medium">{new Date(user.created_at).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="anonymous" className="space-y-4">
                {users.filter(u => !u.email).map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-1">Usuario Anónimo</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Session: {user.session_id}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                              {getDeviceIcon(user.device_type)}
                              {user.device_type}
                            </Badge>
                            <Badge variant="outline">
                              {user.visit_count} visitas
                            </Badge>
                            {user.city && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {user.city}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>Primera visita:</p>
                          <p className="font-medium">{new Date(user.created_at).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}

          {/* Instructions */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>ℹ️ Información del Sistema de Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Datos Capturados:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>session_id</code> - Identificador único de sesión</li>
                  <li><code>device_type</code> - Tipo de dispositivo (mobile/desktop/tablet)</li>
                  <li><code>user_agent</code> - Navegador y sistema operativo</li>
                  <li><code>ip_address</code> - Dirección IP del visitante</li>
                  <li><code>referrer</code> - De dónde vino el usuario</li>
                  <li><code>landing_page</code> - Primera página visitada</li>
                  <li><code>current_page</code> - Última página visitada</li>
                  <li><code>visit_count</code> - Número de visitas</li>
                  <li><code>country</code> y <code>city</code> - Ubicación (opcional)</li>
                  <li><code>email</code>, <code>first_name</code>, <code>last_name</code> - Para usuarios registrados</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Próximos Pasos:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Implementar tracking automático en todas las páginas</li>
                  <li>Agregar geolocalización por IP</li>
                  <li>Dashboard de analytics con gráficas</li>
                  <li>Segmentación de usuarios por comportamiento</li>
                  <li>Exportar datos para análisis externo</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EcommerceTemplate>
  )
}