import { supabase } from '../client/supabase.js';
import { v4 as uuid } from 'uuid';

function closeEnough(requestOne, requestTwo) {
  return requestOne.destination === requestTwo.destination;
}

function group(queue, requestOne, requestTwo) {
  requestOne.matched = true;
  requestTwo.matched = true;
  
  newId = uuid();
  requestOne.group_id = newId;
  requestTwo.group_id = newId;

  queue = queue.filter(req => req !== requestOne && req !== requestTwo);
}

async function poll() {
  console.log("Polling start");

  const { data, error } = await supabase.from('ride_now_requests').select('*');
  
  if (error) {
    console.error('Supabase connection failed:', error.message);
  } else {
    console.log('Supabase connection successful ✅');
  }

  const queues = new Map();

  for (const request of data) {
    if (!queues.has(request.starting_point)) {
      queues.set(request.starting_point, []);
    }

    queues.get(request.starting_point).push(request);
  }

  console.log(queues);

  // setTimeout(poll, 10000);
}

poll();