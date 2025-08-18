import { supabase } from '../client/supabase.js';

export async function accept(req, res) {
  console.log('accept endpoint hit');
  const { id } = req.params;

  const { data, error } = await supabase
    .from('ride_now_requests')
    .update({
      status: 'accepted',
    })
    .match({ id: id });

  if (error) {
    console.error('Error updating row:', error);
  } else {
    console.log('Row updated');
  }

  res.json({ ok: true, action: 'accept' });
}

export async function leave(req, res) {
  console.log('leave endpoint hit');
  const { id } = req.params;

  const { data, error } = await supabase
    .from('ride_now_requests')
    .update({
      status: 'left',
    })
    .match({ id: id });

  if (error) {
    console.error('Error updating row:', error);
  } else {
    console.log('Row updated');
  }

  res.json({ ok: true, action: 'leave' });
}

async function requeue(rideRequest, atBack) {
  const { id } = rideRequest.id;

  if (atBack) {
    const { data, error } = await supabase
    .from('ride_now_requests')
    .update({
      group_id: null,
      is_matched: false,
      status: 'left',
      requested_at: new Date().toISOString(),
    })
    .match({ id: id });
  } else {
    const { data, error } = await supabase
    .from('ride_now_requests')
    .update({
      group_id: null,
      is_matched: false,
      status: 'pending',
    })
    .match({ id: id });
  }

  if (error) {
    console.error('Error updating row:', error);
  } else {
    console.log('Row updated');
  }
}