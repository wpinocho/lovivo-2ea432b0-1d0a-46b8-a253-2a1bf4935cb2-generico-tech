# 📧 Base de Datos de Correos - Instrucciones

## 🎯 Acceso

Visita: **`/admin/correos`** en tu sitio

## 📋 Estructura de la Tabla `mails`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | ID único (generado automáticamente) |
| `email` | TEXT | Correo electrónico (único, requerido) |
| `first_name` | TEXT | Nombre (opcional) |
| `last_name` | TEXT | Apellido (opcional) |
| `phone` | TEXT | Teléfono (opcional) |
| `subscribed` | BOOLEAN | Estado de suscripción (default: true) |
| `source` | TEXT | Origen: 'newsletter', 'checkout', 'manual' |
| `tags` | TEXT[] | Array de etiquetas para segmentación |
| `notes` | TEXT | Notas adicionales (opcional) |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

## 🚀 Configuración Inicial

1. **Crear la Tabla**
   - Ve a `/admin/correos`
   - Haz clic en "1. Crear Tabla 'mails'"
   - Esto creará la tabla en Supabase con todos los índices necesarios

2. **Agregar Datos Dummy**
   - Haz clic en "2. Agregar 10 Correos Dummy"
   - Esto insertará 10 contactos de ejemplo con diferentes perfiles

## 💡 Funciones Disponibles

### En el código (`src/lib/setup-mails-table.ts`):

```typescript
import { 
  createMailsTable, 
  insertDummyMails, 
  getAllMails, 
  addEmail,
  searchEmails,
  updateEmailSubscription 
} from '@/lib/setup-mails-table'

// Obtener todos los correos
const result = await getAllMails(true) // true = solo suscritos

// Agregar un nuevo email
await addEmail({
  email: 'nuevo@correo.com',
  first_name: 'Nombre',
  last_name: 'Apellido',
  source: 'newsletter',
  tags: ['potencial-cliente']
})

// Buscar emails
await searchEmails('juan')

// Cambiar estado de suscripción
await updateEmailSubscription('email@ejemplo.com', false)
```

## 🎨 Características de la Interfaz

- ✅ **Búsqueda** por email, nombre o apellido
- ✅ **Estadísticas** en tiempo real (total, suscritos, no suscritos)
- ✅ **Badges** para estado de suscripción
- ✅ **Tags** de segmentación
- ✅ **Notas** para contexto adicional
- ✅ **Fuente** de origen del contacto

## 🔗 Integraciones Sugeridas

### 1. Conectar con Newsletter
```typescript
// En tu componente de newsletter
import { addEmail } from '@/lib/setup-mails-table'

const handleSubscribe = async (email: string) => {
  await addEmail({
    email,
    source: 'newsletter',
    tags: ['suscriptor-nuevo']
  })
}
```

### 2. Conectar con Checkout
```typescript
// En checkout, después de completar pedido
await addEmail({
  email: customerEmail,
  first_name: firstName,
  last_name: lastName,
  phone: phone,
  source: 'checkout',
  tags: ['cliente']
})
```

## 🛡️ Seguridad

- ✅ El campo `email` tiene constraint UNIQUE (no duplicados)
- ✅ Índices creados para búsquedas rápidas
- ✅ Trigger automático para `updated_at`
- ⚠️ **Importante**: Configura Row Level Security (RLS) en Supabase para proteger los datos

## 📊 Exportar Datos

Para exportar tus correos:

1. Ve al Dashboard de Supabase
2. Table Editor > `mails`
3. Botón "Export" > CSV

O usa el código:
```typescript
const { data } = await getAllMails(true)
// Convertir a CSV y descargar
```

## 🎯 Próximos Pasos Sugeridos

1. **Segmentación**: Crear vistas filtradas por tags
2. **Campañas**: Integrar con Mailchimp/SendGrid
3. **Analytics**: Tracking de emails abiertos
4. **GDPR**: Agregar botón de "Eliminar mis datos"
5. **Importación**: Subir CSV de emails existentes

## 📝 Datos Dummy Incluidos

Los 10 correos dummy incluyen:
- Clientes activos con tags
- Usuarios no suscritos
- Contactos de diferentes fuentes
- Ejemplos de notas y segmentación

---

**¿Necesitas ayuda?** Revisa `src/lib/setup-mails-table.ts` para ver todas las funciones disponibles.