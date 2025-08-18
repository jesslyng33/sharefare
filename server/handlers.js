import { supabase } from '../client/supabase.js';

async function accept(req, res) {
  console.log('accept');
}

async function leave(req, res) {
  console.log('leave');
}

module.exports = { accept, leave };
