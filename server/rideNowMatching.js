import { supabase } from '../client/supabase.js';
import { v4 as uuid } from 'uuid';

function closeEnough(requestOne, requestTwo) {
  return requestOne.destination === requestTwo.destination;
}

async function group(queue, requests) {
  const newId = uuid();
  
  for (const request of requests) {
    queue = await groupHelper(queue, request, newId);
  }

  return queue;
}

async function groupHelper(queue, request, newId) {
  const { data, error } = await supabase
    .from('ride_now_requests')
    .update({
      group_id: newId,
      is_matched: true,
    })
    .match({ id: request.id });

  if (error) {
    console.error('Error updating row:', error);
  } else {
    console.log('Row updated');
  }

  const idx = queue.indexOf(request);
  if (idx > -1) queue.splice(idx, 1);

  return queue;
}

async function poll() {
  console.log("Polling start");

  const { data, error } = await supabase
    .from('ride_now_requests')
    .select('*')
    .eq('is_matched', false);
  
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

  for (let [key, queue] of queues.entries()) {
    let leftoverReqs = [];

    while (queue.length > 0) {
      const requests = [];
      const request = queue[0];
      requests.push(request);
      let count = 1;

      let i = 1;
      while (queue.length > i && count < 3) {
        if (closeEnough(request, queue[i])) {
          requests.push(queue[i]); 
          count++;
        }
        i++;
      }

      if (count === 3) {
        queue = await group(queue, requests);
      } else {
        leftoverReqs.push(queue.shift());
      }
    }

    queues.set(key, leftoverReqs);
  }

  console.log(queues);

  setTimeout(poll, 3000);
}

poll();