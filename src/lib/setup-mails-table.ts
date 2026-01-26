import { supabase } from './supabase'

/**
 * Setup script for creating the 'mails' table
 * 
 * This creates a table with columns:
 * - id (uuid, primary key)
 * - email (text, unique)
 * - first_name (text, optional)
 * - last_name (text, optional) 
 * - phone (text, optional)
 * - subscribed (boolean, default true)
 * - source (text, e.g., 'newsletter', 'checkout', 'manual')
 * - tags (text array, for segmentation)
 * - notes (text, optional)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

export const createMailsTable = async () => {
  try {
    // Create the table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create mails table
        CREATE TABLE IF NOT EXISTS mails (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          subscribed BOOLEAN DEFAULT true,
          source TEXT DEFAULT 'manual',
          tags TEXT[],
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create index on email for faster lookups
        CREATE INDEX IF NOT EXISTS idx_mails_email ON mails(email);
        
        -- Create index on subscribed status
        CREATE INDEX IF NOT EXISTS idx_mails_subscribed ON mails(subscribed);

        -- Create updated_at trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_mails_updated_at 
          BEFORE UPDATE ON mails 
          FOR EACH ROW 
          EXECUTE PROCEDURE update_updated_at_column();
      `
    })

    if (createError) {
      console.error('Error creating table:', createError)
      throw createError
    }

    console.log('✅ Table "mails" created successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error in createMailsTable:', error)
    return { success: false, error }
  }
}

export const insertDummyMails = async () => {
  try {
    const dummyData = [
      {
        email: 'juan.perez@gmail.com',
        first_name: 'Juan',
        last_name: 'Pérez',
        phone: '+52 55 1234 5678',
        source: 'newsletter',
        tags: ['cliente-activo', 'premium'],
        notes: 'Cliente frecuente, compra tech'
      },
      {
        email: 'maria.garcia@hotmail.com',
        first_name: 'María',
        last_name: 'García',
        phone: '+52 33 9876 5432',
        source: 'checkout',
        tags: ['nueva-cliente'],
        notes: 'Primera compra en diciembre'
      },
      {
        email: 'carlos.martinez@yahoo.com',
        first_name: 'Carlos',
        last_name: 'Martínez',
        source: 'newsletter',
        tags: ['suscriptor'],
      },
      {
        email: 'ana.lopez@outlook.com',
        first_name: 'Ana',
        last_name: 'López',
        phone: '+52 81 5555 1234',
        source: 'manual',
        tags: ['vip', 'recomendado'],
        notes: 'Contacto de evento empresarial'
      },
      {
        email: 'pedro.sanchez@gmail.com',
        first_name: 'Pedro',
        last_name: 'Sánchez',
        source: 'newsletter',
        tags: ['interesado'],
      },
      {
        email: 'laura.rodriguez@gmail.com',
        first_name: 'Laura',
        last_name: 'Rodríguez',
        phone: '+52 55 7777 8888',
        source: 'checkout',
        tags: ['cliente-activo'],
        notes: 'Le gustan los productos de audio'
      },
      {
        email: 'miguel.torres@hotmail.com',
        first_name: 'Miguel',
        last_name: 'Torres',
        subscribed: false,
        source: 'newsletter',
        tags: ['no-suscrito'],
        notes: 'Canceló suscripción en enero'
      },
      {
        email: 'sofia.ramirez@gmail.com',
        first_name: 'Sofía',
        last_name: 'Ramírez',
        phone: '+52 442 123 4567',
        source: 'checkout',
        tags: ['nueva-cliente', 'potencial-vip'],
        notes: 'Hizo compra grande ($3000 MXN)'
      },
      {
        email: 'diego.hernandez@yahoo.com',
        first_name: 'Diego',
        last_name: 'Hernández',
        source: 'manual',
        tags: ['prospecto'],
        notes: 'Contacto de LinkedIn'
      },
      {
        email: 'valeria.morales@outlook.com',
        first_name: 'Valeria',
        last_name: 'Morales',
        phone: '+52 222 999 8888',
        source: 'newsletter',
        tags: ['suscriptor', 'activo'],
        notes: 'Abre todos los emails'
      }
    ]

    const { data, error } = await supabase
      .from('mails')
      .insert(dummyData)
      .select()

    if (error) {
      console.error('Error inserting dummy data:', error)
      throw error
    }

    console.log(`✅ Inserted ${data.length} dummy emails successfully!`)
    return { success: true, data }
  } catch (error) {
    console.error('Error in insertDummyMails:', error)
    return { success: false, error }
  }
}

// Helper functions for common operations
export const addEmail = async (emailData: {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  source?: string
  tags?: string[]
  notes?: string
}) => {
  const { data, error } = await supabase
    .from('mails')
    .insert([emailData])
    .select()

  if (error) {
    console.error('Error adding email:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const getAllMails = async (subscribedOnly: boolean = true) => {
  let query = supabase.from('mails').select('*')
  
  if (subscribedOnly) {
    query = query.eq('subscribed', true)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching mails:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const updateEmailSubscription = async (email: string, subscribed: boolean) => {
  const { data, error } = await supabase
    .from('mails')
    .update({ subscribed })
    .eq('email', email)
    .select()

  if (error) {
    console.error('Error updating subscription:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const searchEmails = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('mails')
    .select('*')
    .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching emails:', error)
    return { success: false, error }
  }

  return { success: true, data }
}