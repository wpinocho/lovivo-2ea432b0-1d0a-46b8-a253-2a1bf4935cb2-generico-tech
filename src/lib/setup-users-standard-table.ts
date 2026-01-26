import { supabase } from './supabase'

/**
 * Setup script for creating the 'users' table
 * 
 * This creates a table with columns:
 * - id (uuid, primary key)
 * - email (text, unique)
 * - first_name (text)
 * - last_name (text)
 * - phone (text, optional)
 * - address (text, optional)
 * - city (text, optional)
 * - country (text, optional)
 * - postal_code (text, optional)
 * - date_of_birth (date, optional)
 * - newsletter_subscribed (boolean, default false)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

export const SQL_CREATE_USERS_TABLE = `
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  date_of_birth DATE,
  newsletter_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on country for analytics
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_users_updated_at_column();
`

export const createUsersTable = async () => {
  try {
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: SQL_CREATE_USERS_TABLE
    })

    if (createError) {
      console.error('Error creating table:', createError)
      throw createError
    }

    console.log('✅ Table "users" created successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error in createUsersTable:', error)
    return { success: false, error }
  }
}

export const insertDummyUsers = async () => {
  try {
    const dummyData = [
      {
        email: 'maria.gonzalez@gmail.com',
        first_name: 'María',
        last_name: 'González',
        phone: '+52 55 1234 5678',
        address: 'Av. Insurgentes Sur 1234',
        city: 'Ciudad de México',
        country: 'México',
        postal_code: '03100',
        date_of_birth: '1990-05-15',
        newsletter_subscribed: true
      },
      {
        email: 'carlos.rodriguez@hotmail.com',
        first_name: 'Carlos',
        last_name: 'Rodríguez',
        phone: '+52 33 9876 5432',
        address: 'Calle Juárez 456',
        city: 'Guadalajara',
        country: 'México',
        postal_code: '44100',
        date_of_birth: '1985-08-22',
        newsletter_subscribed: true
      },
      {
        email: 'ana.martinez@yahoo.com',
        first_name: 'Ana',
        last_name: 'Martínez',
        phone: '+52 81 5555 1234',
        address: 'Av. Constitución 789',
        city: 'Monterrey',
        country: 'México',
        postal_code: '64000',
        date_of_birth: '1992-03-10',
        newsletter_subscribed: false
      },
      {
        email: 'luis.hernandez@outlook.com',
        first_name: 'Luis',
        last_name: 'Hernández',
        phone: '+52 222 444 7777',
        address: 'Blvd. 5 de Mayo 321',
        city: 'Puebla',
        country: 'México',
        postal_code: '72000',
        date_of_birth: '1988-11-30',
        newsletter_subscribed: true
      },
      {
        email: 'sofia.lopez@gmail.com',
        first_name: 'Sofía',
        last_name: 'López',
        phone: '+52 998 333 6666',
        address: 'Av. Tulum 654',
        city: 'Cancún',
        country: 'México',
        postal_code: '77500',
        date_of_birth: '1995-07-18',
        newsletter_subscribed: true
      },
      {
        email: 'pedro.sanchez@gmail.com',
        first_name: 'Pedro',
        last_name: 'Sánchez',
        phone: '+52 442 888 9999',
        address: 'Calle Corregidora 234',
        city: 'Querétaro',
        country: 'México',
        postal_code: '76000',
        date_of_birth: '1987-02-25',
        newsletter_subscribed: false
      },
      {
        email: 'laura.ramirez@hotmail.com',
        first_name: 'Laura',
        last_name: 'Ramírez',
        phone: '+52 664 777 5555',
        address: 'Av. Revolución 876',
        city: 'Tijuana',
        country: 'México',
        postal_code: '22000',
        date_of_birth: '1993-09-12',
        newsletter_subscribed: true
      },
      {
        email: 'diego.torres@yahoo.com',
        first_name: 'Diego',
        last_name: 'Torres',
        phone: '+52 656 222 3333',
        address: 'Calle Tecnológico 543',
        city: 'Ciudad Juárez',
        country: 'México',
        postal_code: '32000',
        date_of_birth: '1991-04-08',
        newsletter_subscribed: false
      },
      {
        email: 'valeria.flores@gmail.com',
        first_name: 'Valeria',
        last_name: 'Flores',
        phone: '+52 667 111 2222',
        address: 'Av. Obregón 987',
        city: 'Culiacán',
        country: 'México',
        postal_code: '80000',
        date_of_birth: '1994-12-20',
        newsletter_subscribed: true
      },
      {
        email: 'miguel.morales@outlook.com',
        first_name: 'Miguel',
        last_name: 'Morales',
        phone: '+52 999 444 5555',
        address: 'Calle 60 #456',
        city: 'Mérida',
        country: 'México',
        postal_code: '97000',
        date_of_birth: '1989-06-14',
        newsletter_subscribed: true
      },
      {
        email: 'fernanda.ruiz@gmail.com',
        first_name: 'Fernanda',
        last_name: 'Ruiz',
        phone: '+52 614 666 7777',
        address: 'Av. Universidad 321',
        city: 'Chihuahua',
        country: 'México',
        postal_code: '31000',
        date_of_birth: '1996-01-05',
        newsletter_subscribed: false
      },
      {
        email: 'roberto.jimenez@hotmail.com',
        first_name: 'Roberto',
        last_name: 'Jiménez',
        phone: '+52 844 888 9999',
        address: 'Blvd. Venustiano Carranza 654',
        city: 'Saltillo',
        country: 'México',
        postal_code: '25000',
        date_of_birth: '1986-10-28',
        newsletter_subscribed: true
      }
    ]

    const { data, error } = await supabase
      .from('users')
      .insert(dummyData)
      .select()

    if (error) {
      console.error('Error inserting dummy data:', error)
      throw error
    }

    console.log(`✅ Inserted ${data.length} dummy users successfully!`)
    return { success: true, data }
  } catch (error) {
    console.error('Error in insertDummyUsers:', error)
    return { success: false, error }
  }
}

// Helper functions for common operations
export const addUser = async (userData: {
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  date_of_birth?: string
  newsletter_subscribed?: boolean
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()

  if (error) {
    console.error('Error adding user:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const searchUsers = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)

  if (error) {
    console.error('Error searching users:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getUsersByCountry = async (country: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('country', country)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users by country:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getUserStats = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('country, city, newsletter_subscribed, created_at')

  if (error) {
    console.error('Error fetching user stats:', error)
    return { success: false, error }
  }

  // Calculate stats
  const totalUsers = data.length
  const subscribedUsers = data.filter(u => u.newsletter_subscribed).length
  
  const countryStats = data.reduce((acc: any, user) => {
    if (user.country) {
      acc[user.country] = (acc[user.country] || 0) + 1
    }
    return acc
  }, {})

  const cityStats = data.reduce((acc: any, user) => {
    if (user.city) {
      acc[user.city] = (acc[user.city] || 0) + 1
    }
    return acc
  }, {})

  return {
    success: true,
    stats: {
      total: totalUsers,
      subscribed: subscribedUsers,
      countries: countryStats,
      cities: cityStats
    }
  }
}