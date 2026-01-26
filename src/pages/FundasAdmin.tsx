import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EcommerceTemplate } from '@/templates/EcommerceTemplate'
import { 
  createFundasTable, 
  insertDummyFundas, 
  getAllFundas, 
  searchFundas,
  getFundasByModel,
  getFundasByMaterial
} from '@/lib/setup-fundas-table'
import { Search, Package, Database, ShoppingBag, Box } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function FundasAdmin() {
  const [fundas, setFundas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSetup, setShowSetup] = useState(true)
  const [filterModel, setFilterModel] = useState<string>('all')
  const [filterMaterial, setFilterMaterial] = useState<string>('all')
  const { toast } = useToast()

  const handleCreateTable = async () => {
    setLoading(true)
    const result = await createFundasTable()
    if (result.success) {
      toast({
        title: '✅ Tabla creada',
        description: 'La tabla "fundas" se creó correctamente',
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
    const result = await insertDummyFundas()
    if (result.success) {
      toast({
        title: '✅ Datos insertados',
        description: '10 fundas dummy agregadas correctamente',
      })
      loadFundas()
    } else {
      toast({
        title: '❌ Error',
        description: 'No se pudieron insertar los datos',
        variant: 'destructive'
      })
    }
    setLoading(false)
  }

  const loadFundas = async () => {
    setLoading(true)
    const result = await getAllFundas()
    if (result.success && result.data) {
      setFundas(result.data)
      setShowSetup(false)
    } else {
      setShowSetup(true)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadFundas()
      return
    }
    
    setLoading(true)
    const result = await searchFundas(searchTerm)
    if (result.success && result.data) {
      setFundas(result.data)
    }
    setLoading(false)
  }

  const handleFilterByModel = async (model: string) => {
    setFilterModel(model)
    if (model === 'all') {
      loadFundas()
      return
    }
    
    setLoading(true)
    const result = await getFundasByModel(model)
    if (result.success && result.data) {
      setFundas(result.data)
    }
    setLoading(false)
  }

  const handleFilterByMaterial = async (material: string) => {
    setFilterMaterial(material)
    if (material === 'all') {
      loadFundas()
      return
    }
    
    setLoading(true)
    const result = await getFundasByMaterial(material)
    if (result.success && result.data) {
      setFundas(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadFundas()
  }, [])

  // Get unique models and materials for filters
  const uniqueModels = [...new Set(fundas.map(f => f.phone_model))]
  const uniqueMaterials = [...new Set(fundas.map(f => f.material).filter(Boolean))]

  return (
    <EcommerceTemplate>
      <div className="min-h-screen bg-[#f5f5f7] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-primary/10 rounded-full p-4">
                <Package className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Base de Datos de Fundas
            </h1>
            <p className="text-xl text-muted-foreground">
              Gestiona tu catálogo de fundas para celular
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
                  {loading ? 'Creando...' : '1. Crear Tabla "fundas"'}
                </Button>
                <Button 
                  onClick={handleInsertDummy}
                  disabled={loading}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Insertando...' : '2. Agregar 10 Fundas Dummy'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Search & Filters */}
          {!showSetup && (
            <div className="mb-8 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por nombre, modelo, color, marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch} disabled={loading}>
                  Buscar
                </Button>
                <Button onClick={loadFundas} variant="outline" disabled={loading}>
                  Ver Todos
                </Button>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <Select value={filterModel} onValueChange={handleFilterByModel}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los modelos</SelectItem>
                    {uniqueModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterMaterial} onValueChange={handleFilterByMaterial}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los materiales</SelectItem>
                    {uniqueMaterials.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Stats */}
          {!showSetup && fundas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Fundas
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fundas.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    En Stock
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {fundas.filter(f => f.stock > 0).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Agotados
                  </CardTitle>
                  <Box className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {fundas.filter(f => f.stock === 0).length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Valor Inventario
                  </CardTitle>
                  <Database className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${fundas.reduce((sum, f) => sum + (f.price * f.stock), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fundas Grid */}
          {!showSetup && (
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Cargando...</p>
                  </CardContent>
                </Card>
              ) : fundas.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No se encontraron fundas</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Intenta con otro término de búsqueda o filtro
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fundas.map((funda) => (
                    <Card key={funda.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {funda.image_url && (
                          <img 
                            src={funda.image_url} 
                            alt={funda.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold">{funda.name}</h3>
                            {funda.brand && (
                              <p className="text-sm text-muted-foreground">
                                por {funda.brand}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{funda.phone_model}</Badge>
                            {funda.material && (
                              <Badge variant="secondary">{funda.material}</Badge>
                            )}
                            {funda.color && (
                              <Badge>{funda.color}</Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {funda.description}
                          </p>

                          {funda.features && funda.features.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {funda.features.slice(0, 3).map((feature: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  ✓ {feature}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div>
                              <p className="text-2xl font-bold text-primary">
                                ${funda.price.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Stock: {funda.stock > 0 ? (
                                  <span className="text-green-600 font-medium">{funda.stock} unidades</span>
                                ) : (
                                  <span className="text-red-600 font-medium">Agotado</span>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="text-right text-xs text-muted-foreground">
                            <p>Agregado: {new Date(funda.created_at).toLocaleDateString('es-MX')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                  <li><code>name</code> - Nombre de la funda (requerido)</li>
                  <li><code>phone_model</code> - Modelo compatible (requerido)</li>
                  <li><code>material</code> - Material (silicona, cuero, TPU, etc.)</li>
                  <li><code>color</code> - Color de la funda</li>
                  <li><code>price</code> - Precio (requerido)</li>
                  <li><code>image_url</code> - URL de la imagen</li>
                  <li><code>description</code> - Descripción detallada</li>
                  <li><code>stock</code> - Cantidad en inventario</li>
                  <li><code>brand</code> - Marca del fabricante</li>
                  <li><code>features</code> - Características especiales (array)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Funcionalidades Disponibles:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Búsqueda por nombre, modelo, color o marca</li>
                  <li>Filtros por modelo de teléfono</li>
                  <li>Filtros por material</li>
                  <li>Estadísticas de inventario</li>
                  <li>Cálculo automático de valor total</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EcommerceTemplate>
  )
}