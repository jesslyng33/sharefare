import { supabase } from '../client/supabase.js';

export async function accept(req, res) {
  console.log('accept endpoint hit');
  const { id } = req.params;

  const { data: request, error: errorOne } = await supabase
    .from('ride_now_requests')
    .update({
      status: 'accepted',
    })
    .match({ id: id })
    .select('group_id')
    .single()

  if (errorOne) {
    console.error('Error updating row:', errorOne);
  } else {
    console.log('Row updated', request);
  }

  const groupId = request.group_id;

  const { data: requests, error: errorTwo } = await supabase
    .from('ride_now_requests')
    .select('id, user_id, status, group_id')
    .eq('group_id', groupId)

  if (errorTwo) {
    console.error('Error selecting requests:', errorTwo);
  } else {
    console.log('Requests selected');
  }

  let completed = true;
  for (const request of requests) {
    if (request.status !== 'accepted') {
      completed = false;
    }
  }

  if (completed) {
    const { data: requestsUpdated, error: errorThree } = await supabase
      .from('ride_now_requests')
      .update({
        status: 'completed',
      })
      .match({ group_id: groupId })

    if (errorThree) {
      console.error('Error updating requests:', errorThree);
    } else {
      console.log('Requests updated');
    }
  }

  res.json({ ok: true, action: 'accept' });
}

export async function leave(req, res) {
  console.log('leave endpoint hit');
  const { id } = req.params;

  const { data: request, error: errorOne } = await supabase
    .from('ride_now_requests')
    .update({
      status: 'left',
    })
    .match({ id: id })
    .select('group_id')
    .single()

  if (errorOne) {
    console.error('Error updating row:', errorOne);
  } else {
    console.log('Row updated', request);
  }

  const groupId = request.group_id;

  const { data: requests, error: errorTwo } = await supabase
    .from('ride_now_requests')
    .select('id, user_id, status, group_id')
    .eq('group_id', groupId)

  if (errorTwo) {
    console.error('Error selecting requests:', errorTwo);
  } else {
    console.log('Requests selected');
  }

  for (const request of requests) {
    if (request.id === id) {
      requeue(request, true);
    } else{
      requeue(request, false);
    }
  }

  res.json({ ok: true, action: 'leave' });
}

async function requeue(rideRequest, atBack) {
  const id = rideRequest.id;

  if (atBack) {
    const { data: dataOne, error: errorOne } = await supabase
    .from('ride_now_requests')
    .update({
      group_id: '2a5d19c9-2a65-4ba0-a88e-00ebefef70da',
      is_matched: false,
      status: 'left',
      requested_at: new Date().toISOString(),
    })
    .match({ id: id });

    if (errorOne) {
      console.error('Error updating row:', errorOne);
    } else {
      console.log('Row updated');
    }
  } else {
    const { data: dataTwo, error: errorTwo } = await supabase
    .from('ride_now_requests')
    .update({
      group_id: '2a5d19c9-2a65-4ba0-a88e-00ebefef70da',
      is_matched: false,
      status: 'pending',
    })
    .match({ id: id });

    if (errorTwo) {
      console.error('Error updating row:', errorTwo);
    } else {
      console.log('Row updated');
    }
  }
}