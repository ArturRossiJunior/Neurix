import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dmwiewbouomfzovlbcme.supabase.co';
const supabaseAnonKey = 'sb_publishable_bEhtxCWVLsWosp30Zc9jzg_lbSsv9xm';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);