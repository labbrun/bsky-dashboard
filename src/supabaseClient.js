// Supabase Client Configuration
// Creates and exports configured Supabase client for database operations

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key'

// Create Supabase client (will work in offline mode if env vars not set)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)