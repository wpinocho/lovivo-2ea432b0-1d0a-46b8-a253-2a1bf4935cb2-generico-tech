import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { 
  createUsersTable, 
  insertDummyUsers, 
  getAllUsers,
  getUserStats,
  searchUsers,
  SQL_CREATE_USERS_TABLE
} from '@/lib/setup-users-standard-table'
import { Users, Search, Mail, Phone, MapPin, Calendar, Database } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function UsersStandardAdmin() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSetup, setShowSetup] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const { toast } = useToast()

  const handleCreateTable = async () => {
    setLoading(true)
    const result = await createUsersTable()
    if (result.success) {
      toast({
        title: '✅ Tabla creada',
        description: 'La tabla "users" se creó correctamente',
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
        description: '12 usuarios dummy agregados correctamente',
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadUsers()
      return
    }
    
    setLoading(true)
    const result = await searchUsers(searchTerm)
    if (result.success && result.data) {
      setUsers(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_CREATE_USERS_TABLE)
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
              Base de Datos de Usuarios
            </h1>
            <p className="text-xl text-muted-foreground">
              Gestiona tu base de datos de clientes y usuarios
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
                  {loading ? 'Insertando...' : '2. Agregar 12 Usuarios Dummy'}
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

          {/* Search Bar */}
          {!showSetup && (
            <div className="mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por email, nombre, teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  Buscar
                </Button>
                <Button onClick={loadUsers} variant="outline" disabled={loading}>
                  Ver Todos
                </Button>
              </div>
            </div>
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
                    Suscritos Newsletter
                  </CardTitle>
                  <Mail className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.subscribed}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.total > 0 ? Math.round((stats.subscribed / stats.total) * 100) : 0}% del total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Países
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.keys(stats.countries).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Ciudades
                  </CardTitle>
                  <Database className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.keys(stats.cities).length}
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
                <TabsTrigger value="subscribed">
                  Suscritos ({users.filter(u => u.newsletter_subscribed).length})
                </TabsTrigger>
                <TabsTrigger value="not-subscribed">
                  No Suscritos ({users.filter(u => !u.newsletter_subscribed).length})
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
                      <p className="text-lg font-medium">No hay usuarios</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Agrega usuarios usando el botón de arriba
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                      <Card key={user.id}>
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {user.first_name} {user.last_name}
                                </h3>
                                {user.newsletter_subscribed && (
                                  <Badge variant="default" className="bg-green-500 mt-1">
                                    Newsletter ✓
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <p className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </p>
                              
                              {user.phone && (
                                <p className="flex items-center gap-2">
                                  <Phone className="h-4 w-4" />
                                  {user.phone}
                                </p>
                              )}

                              {user.address && (
                                <p className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 mt-0.5" />
                                  <span>
                                    {user.address}<br />
                                    {user.city && user.postal_code && `${user.city}, ${user.postal_code}`}<br />
                                    {user.country}
                                  </span>
                                </p>
                              )}

                              {user.date_of_birth && (
                                <p className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(user.date_of_birth).toLocaleDateString('es-MX')}
                                </p>
                              )}
                            </div>

                            <div className="pt-2 border-t text-xs text-muted-foreground">
                              <p>Registrado: {new Date(user.created_at).toLocaleDateString('es-MX')}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="subscribed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.filter(u => u.newsletter_subscribed).map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-1">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.city && user.country && (
                          <p className="text-sm text-muted-foreground mt-2">
                            📍 {user.city}, {user.country}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="not-subscribed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.filter(u => !u.newsletter_subscribed).map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-1">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.city && user.country && (
                          <p className="text-sm text-muted-foreground mt-2">
                            📍 {user.city}, {user.country}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Instructions */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>ℹ️ Información del Sistema de Usuarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Datos Capturados:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>email</code> - Correo electrónico (único, requerido)</li>
                  <li><code>first_name</code>, <code>last_name</code> - Nombre completo</li>
                  <li><code>phone</code> - Teléfono de contacto</li>
                  <li><code>address</code>, <code>city</code>, <code>country</code>, <code>postal_code</code> - Dirección completa</li>
                  <li><code>date_of_birth</code> - Fecha de nacimiento</li>
                  <li><code>newsletter_subscribed</code> - Estado de suscripción al newsletter</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Casos de Uso:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Gestión de clientes y contactos</li>
                  <li>Base de datos para marketing</li>
                  <li>Análisis demográfico por ciudad/país</li>
                  <li>Segmentación por suscripción a newsletter</li>
                  <li>Integración con sistemas de CRM</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EcommerceTemplate>
  )
}