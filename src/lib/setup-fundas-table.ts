import { supabase } from './supabase'

/**
 * Setup script for creating the 'fundas' table
 * 
 * This creates a table with columns:
 * - id (uuid, primary key)
 * - name (text, nombre de la funda)
 * - phone_model (text, modelo compatible)
 * - material (text, material de la funda)
 * - color (text, color)
 * - price (numeric, precio)
 * - image_url (text, URL de imagen)
 * - description (text, descripción)
 * - stock (integer, inventario)
 * - brand (text, marca opcional)
 * - features (text array, características especiales)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

export const createFundasTable = async () => {
  try {
    // Create the table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create fundas table
        CREATE TABLE IF NOT EXISTS fundas (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          phone_model TEXT NOT NULL,
          material TEXT,
          color TEXT,
          price NUMERIC(10, 2) NOT NULL DEFAULT 0,
          image_url TEXT,
          description TEXT,
          stock INTEGER DEFAULT 0,
          brand TEXT,
          features TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index on phone_model for faster lookups
        CREATE INDEX IF NOT EXISTS idx_fundas_phone_model ON fundas(phone_model);
        
        -- Create index on material
        CREATE INDEX IF NOT EXISTS idx_fundas_material ON fundas(material);
        
        -- Create index on color
        CREATE INDEX IF NOT EXISTS idx_fundas_color ON fundas(color);

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_fundas_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_fundas_updated_at 
          BEFORE UPDATE ON fundas 
          FOR EACH ROW 
          EXECUTE PROCEDURE update_fundas_updated_at_column();
      `
    })

    if (createError) {
      console.error('Error creating table:', createError)
      throw createError
    }

    console.log('✅ Table "fundas" created successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error in createFundasTable:', error)
    return { success: false, error }
  }
}

export const insertDummyFundas = async () => {
  try {
    const dummyData = [
      {
        name: 'Funda Silicona Suave',
        phone_model: 'iPhone 16',
        material: 'Silicona',
        color: 'Negro',
        price: 299.00,
        description: 'Funda de silicona suave al tacto, protección total',
        stock: 50,
        brand: 'Apple',
        features: ['Protección anti-golpes', 'Suave al tacto', 'Acceso a todos los botones']
      },
      {
        name: 'Funda Transparente Ultra Delgada',
        phone_model: 'iPhone 16 Pro',
        material: 'TPU',
        color: 'Transparente',
        price: 199.00,
        description: 'Protección invisible que muestra el diseño original',
        stock: 75,
        brand: 'Spigen',
        features: ['Ultra delgada', 'Cristal claro', 'Anti-amarilleo']
      },
      {
        name: 'Funda Cuero Premium',
        phone_model: 'iPhone 16 Pro Max',
        material: 'Cuero',
        color: 'Marrón',
        price: 899.00,
        description: 'Elegante funda de cuero genuino con acabado premium',
        stock: 30,
        brand: 'Apple',
        features: ['Cuero genuino', 'Envejecimiento natural', 'Ranuras para tarjetas']
      },
      {
        name: 'Funda Resistente MIL-STD',
        phone_model: 'Phone 16',
        material: 'TPU + Policarbonato',
        color: 'Negro',
        price: 499.00,
        description: 'Protección militar contra caídas hasta 3 metros',
        stock: 40,
        brand: 'OtterBox',
        features: ['Certificación militar', 'Doble capa', 'Esquinas reforzadas', 'Protector de pantalla']
      },
      {
        name: 'Funda Líquida Brillante',
        phone_model: 'iPhone 16',
        material: 'Silicona líquida',
        color: 'Rosa',
        price: 349.00,
        description: 'Acabado sedoso con brillo elegante',
        stock: 60,
        brand: 'CaseNerd',
        features: ['Acabado sedoso', 'Colores vibrantes', 'Interior suave']
      },
      {
        name: 'Funda con Soporte MagSafe',
        phone_model: 'iPhone 16 Pro',
        material: 'Policarbonato',
        color: 'Azul',
        price: 599.00,
        description: 'Compatible con MagSafe y soporte integrado',
        stock: 35,
        brand: 'Apple',
        features: ['Compatible MagSafe', 'Soporte integrado', 'Carga inalámbrica']
      },
      {
        name: 'Funda Minimalista',
        phone_model: 'Phone 16 Pro',
        material: 'Plástico duro',
        color: 'Blanco',
        price: 149.00,
        description: 'Diseño ultra delgado y minimalista',
        stock: 100,
        brand: 'Peel',
        features: ['Ultra delgada 0.35mm', 'Peso mínimo', 'Mate']
      },
      {
        name: 'Funda Efecto Mármol',
        phone_model: 'iPhone 16',
        material: 'TPU',
        color: 'Blanco/Gris',
        price: 279.00,
        description: 'Diseño elegante con efecto mármol',
        stock: 45,
        brand: 'Velvet Caviar',
        features: ['Diseño único', 'Protección flexible', 'Grip mejorado']
      },
      {
        name: 'Funda Biodegradable Eco',
        phone_model: 'Phone 16',
        material: 'Bioplástico',
        color: 'Verde',
        price: 399.00,
        description: 'Funda ecológica 100% biodegradable',
        stock: 25,
        brand: 'Pela Case',
        features: ['100% compostable', 'Ecológica', 'Sin plástico']
      },
      {
        name: 'Funda Gaming RGB',
        phone_model: 'Phone 16 Pro Max',
        material: 'TPU + Metal',
        color: 'Negro/RGB',
        price: 799.00,
        description: 'Funda gaming con luces LED RGB personalizables',
        stock: 20,
        brand: 'Razer',
        features: ['Luces RGB', 'Gatillos gaming', 'Ventilación mejorada', 'App de control']
      }
    ]

    const { data, error } = await supabase
      .from('fundas')
      .insert(dummyData)
      .select()

    if (error) {
      console.error('Error inserting dummy data:', error)
      throw error
    }

    console.log(`✅ Inserted ${data.length} fundas dummy successfully!`)
    return { success: true, data }
  } catch (error) {
    console.error('Error in insertDummyFundas:', error)
    return { success: false, error }
  }
}

// Helper functions for common operations
export const addFunda = async (fundaData: {
  name: string
  phone_model: string
  material?: string
  color?: string
  price: number
  image_url?: string
  description?: string
  stock?: number
  brand?: string
  features?: string[]
}) => {
  const { data, error } = await supabase
    .from('fundas')
    .insert([fundaData])
    .select()

  if (error) {
    console.error('Error adding funda:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const getAllFundas = async () => {
  const { data, error } = await supabase
    .from('fundas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching fundas:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getFundasByModel = async (phoneModel: string) => {
  const { data, error } = await supabase
    .from('fundas')
    .select('*')
    .eq('phone_model', phoneModel)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching fundas by model:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getFundasByMaterial = async (material: string) => {
  const { data, error } = await supabase
    .from('fundas')
    .select('*')
    .eq('material', material)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching fundas by material:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const searchFundas = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('fundas')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,phone_model.ilike.%${searchTerm}%,color.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching fundas:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const updateStock = async (fundaId: string, newStock: number) => {
  const { data, error } = await supabase
    .from('fundas')
    .update({ stock: newStock })
    .eq('id', fundaId)
    .select()

  if (error) {
    console.error('Error updating stock:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}