import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlqpybcbujtvifyiijay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscXB5YmNidWp0dmlmeWlpamF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDgxMDYsImV4cCI6MjA2ODgyNDEwNn0.A-iXDiM3faEBagP2HVSMnG0DItvzlCQtbPjwWIIuj1k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
