import { supabase } from './supabase'

/**
 * Setup script for creating the 'users_tracking' table
 * 
 * This creates a table with columns:
 * - id (uuid, primary key)
 * - email (text, optional - for registered users)
 * - first_name (text, optional)
 * - last_name (text, optional)
 * - phone (text, optional)
 * - session_id (text, unique session identifier)
 * - user_agent (text, browser and device info)
 * - ip_address (text, IP address)
 * - referrer (text, where they came from)
 * - landing_page (text, first page visited)
 * - current_page (text, last page visited)
 * - visit_count (integer, number of visits)
 * - last_visit (timestamp, last visit time)
 * - country (text, optional)
 * - city (text, optional)
 * - device_type (text, mobile/desktop/tablet)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

export const SQL_CREATE_USERS_TRACKING_TABLE = `
-- Create users_tracking table
CREATE TABLE IF NOT EXISTS users_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  session_id TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  landing_page TEXT,
  current_page TEXT,
  visit_count INTEGER DEFAULT 1,
  last_visit TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  country TEXT,
  city TEXT,
  device_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_tracking_session ON users_tracking(session_id);

-- Create index on email for registered users
CREATE INDEX IF NOT EXISTS idx_users_tracking_email ON users_tracking(email);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_users_tracking_created ON users_tracking(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_users_tracking_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_tracking_updated_at 
  BEFORE UPDATE ON users_tracking 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_users_tracking_updated_at_column();
`

export const createUsersTrackingTable = async () => {
  try {
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: SQL_CREATE_USERS_TRACKING_TABLE
    })

    if (createError) {
      console.error('Error creating table:', createError)
      throw createError
    }

    console.log('✅ Table "users_tracking" created successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error in createUsersTrackingTable:', error)
    return { success: false, error }
  }
}

export const insertDummyUsers = async () => {
  try {
    const dummyData = [
      {
        email: 'ana.lopez@gmail.com',
        first_name: 'Ana',
        last_name: 'López',
        session_id: 'sess_001_ana',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        ip_address: '192.168.1.100',
        referrer: 'https://www.google.com',
        landing_page: '/',
        current_page: '/productos/phone-16',
        visit_count: 5,
        device_type: 'mobile',
        country: 'México',
        city: 'Ciudad de México'
      },
      {
        session_id: 'sess_002_anon',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        ip_address: '192.168.1.101',
        referrer: 'https://www.facebook.com',
        landing_page: '/',
        current_page: '/',
        visit_count: 1,
        device_type: 'desktop',
        country: 'México',
        city: 'Guadalajara'
      },
      {
        email: 'carlos.mendez@outlook.com',
        first_name: 'Carlos',
        last_name: 'Méndez',
        phone: '+52 33 8888 9999',
        session_id: 'sess_003_carlos',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
        ip_address: '192.168.1.102',
        referrer: 'https://www.instagram.com',
        landing_page: '/productos/watch-series-11',
        current_page: '/carrito',
        visit_count: 3,
        device_type: 'desktop',
        country: 'México',
        city: 'Monterrey'
      },
      {
        session_id: 'sess_004_anon2',
        user_agent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) Safari/604.1',
        ip_address: '192.168.1.103',
        referrer: 'direct',
        landing_page: '/productos/pad-air',
        current_page: '/productos/pad-air',
        visit_count: 1,
        device_type: 'tablet',
        country: 'México',
        city: 'Puebla'
      },
      {
        email: 'sofia.ramirez@hotmail.com',
        first_name: 'Sofía',
        last_name: 'Ramírez',
        session_id: 'sess_005_sofia',
        user_agent: 'Mozilla/5.0 (Android 13; Mobile) Chrome/120.0.0.0',
        ip_address: '192.168.1.104',
        referrer: 'https://www.tiktok.com',
        landing_page: '/',
        current_page: '/productos/bookpro-de-14',
        visit_count: 7,
        device_type: 'mobile',
        country: 'México',
        city: 'Cancún'
      }
    ]

    const { data, error } = await supabase
      .from('users_tracking')
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
export const trackUser = async (userData: {
  session_id: string
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  user_agent?: string
  ip_address?: string
  referrer?: string
  landing_page?: string
  current_page?: string
  device_type?: string
  country?: string
  city?: string
}) => {
  const { data, error } = await supabase
    .from('users_tracking')
    .insert([userData])
    .select()

  if (error) {
    console.error('Error tracking user:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const updateUserVisit = async (session_id: string, current_page: string) => {
  const { data, error } = await supabase
    .from('users_tracking')
    .update({ 
      current_page,
      last_visit: new Date().toISOString(),
      visit_count: supabase.rpc('increment', { x: 1 })
    })
    .eq('session_id', session_id)
    .select()

  if (error) {
    console.error('Error updating user visit:', error)
    return { success: false, error }
  }

  return { success: true, data: data[0] }
}

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users_tracking')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getUserBySession = async (session_id: string) => {
  const { data, error } = await supabase
    .from('users_tracking')
    .select('*')
    .eq('session_id', session_id)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getUsersByDevice = async (device_type: string) => {
  const { data, error } = await supabase
    .from('users_tracking')
    .select('*')
    .eq('device_type', device_type)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users by device:', error)
    return { success: false, error }
  }

  return { success: true, data }
}

export const getUserStats = async () => {
  const { data, error } = await supabase
    .from('users_tracking')
    .select('device_type, country, city, created_at')

  if (error) {
    console.error('Error fetching user stats:', error)
    return { success: false, error }
  }

  // Calculate stats
  const totalUsers = data.length
  const deviceStats = data.reduce((acc: any, user) => {
    acc[user.device_type] = (acc[user.device_type] || 0) + 1
    return acc
  }, {})

  const countryStats = data.reduce((acc: any, user) => {
    if (user.country) {
      acc[user.country] = (acc[user.country] || 0) + 1
    }
    return acc
  }, {})

  return {
    success: true,
    stats: {
      total: totalUsers,
      devices: deviceStats,
      countries: countryStats
    }
  }
}