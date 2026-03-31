const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.PROJECT_URL;
const supabaseKey = process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] ⚠️  Credentials (PROJECT_URL, SERVICE_ROLE_KEY) are missing. Database functionality will be disabled.');
}

const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })
  : {
      from: () => ({
        select: () => ({ eq: () => ({ order: () => ({ limit: () => Promise.resolve({ data: [], error: { message: 'Supabase disconnected' } }) }) }) }),
        upsert: () => Promise.resolve({ error: { message: 'Supabase disconnected' } }),
        insert: () => Promise.resolve({ error: { message: 'Supabase disconnected' } }),
        update: () => ({ eq: () => Promise.resolve({ error: { message: 'Supabase disconnected' } }) }),
      })
    };

module.exports = supabase;
