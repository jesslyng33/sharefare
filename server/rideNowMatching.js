const { supabase } = require('../client/supabase.js');

async function poll() {
  console.log("Polling start");

  const { data, error } = await supabase.from('ride_now_requests').select('*');
  
  if (error) {
    console.error('Supabase connection failed:', error.message);
  } else {
    console.log('Supabase connection successful ✅', data);
  }

  setTimeout(poll, 10000);
}

poll();