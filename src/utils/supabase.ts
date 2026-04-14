import { createClient } from '@supabase/supabase-js';

//const supabaseUrl = 'https://dmwiewbouomfzovlbcme.supabase.co';
//const supabaseAnonKey = 'sb_publishable_bEhtxCWVLsWosp30Zc9jzg_lbSsv9xm';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);