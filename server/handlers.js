import { supabase } from '../client/supabase.js';

export async function accept(req, res) {
  console.log('accept');
  res.json({ ok: true, action: 'accept' });
}

export async function leave(req, res) {
  console.log('leave');
  res.json({ ok: true, action: 'leave' });
}
