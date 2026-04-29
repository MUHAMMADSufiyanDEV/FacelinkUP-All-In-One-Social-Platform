import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryuybekaowbxfgihpqft.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('test').select('*').limit(1);
    if (error && !error.message.includes('relation "public.test" does not exist')) {
      console.error('Supabase connection error:', error);
    }
  } catch (error) {
    console.error('Supabase connection test failed:', error);
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  table: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailConfirmedAt?: string | null;
    phone?: string | null;
    confirmedAt?: string | null;
    lastSignInAt?: string | null;
    appMetadata?: any;
    userMetadata?: any;
    aud?: string | null;
    role?: string | null;
  }
}

export function handleSupabaseError(error: unknown, operationType: OperationType, table: string | null) {
  const errInfo: SupabaseErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    table,
    authInfo: {
      userId: supabase.auth.user()?.id || null,
      email: supabase.auth.user()?.email || null,
      emailConfirmedAt: supabase.auth.user()?.email_confirmed_at || null,
      phone: supabase.auth.user()?.phone || null,
      confirmedAt: supabase.auth.user()?.confirmed_at || null,
      lastSignInAt: supabase.auth.user()?.last_sign_in_at || null,
      appMetadata: supabase.auth.user()?.app_metadata || null,
      userMetadata: supabase.auth.user()?.user_metadata || null,
      aud: supabase.auth.user()?.aud || null,
      role: supabase.auth.user()?.role || null,
    }
  };

  console.error('Supabase Error:', errInfo);
}