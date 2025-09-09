// Supabase Client Configuration
// Creates and exports configured Supabase client for database operations

import { createClient } from '@supabase/supabase-js'
import { APP_CONFIG } from './config/app.config'

// Create Supabase client only if credentials are provided
let supabase = null;

if (APP_CONFIG.database.enabled) {
  supabase = createClient(
    APP_CONFIG.database.supabaseUrl, 
    APP_CONFIG.database.supabaseKey
  );
} else {
  // Create a mock client for local-only mode
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Local-only mode: No database configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Local-only mode: No database configured' } }),
      upsert: () => Promise.resolve({ data: null, error: { message: 'Local-only mode: No database configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Local-only mode: No database configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Local-only mode: No database configured' } }),
    })
  };
}

export { supabase };
export const isDatabaseEnabled = APP_CONFIG.database.enabled;