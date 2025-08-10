import { supabase } from '../../supabase.js';

async function testConnection() {
  console.log('testConnection');
  
  const { data, error } = await supabase.from('ride_now_requests').select('*').limit(1);

  if (error) {
    console.error('Supabase connection failed:', error.message);
  } else {
    console.log('Supabase connection successful ✅', data);
  }
}

testConnection();