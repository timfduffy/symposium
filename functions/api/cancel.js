export async function onRequestPost(context) {
  // Note: In serverless functions, true cancellation of ongoing requests
  // is more complex than in traditional servers. This endpoint primarily
  // serves to acknowledge the cancellation request.
  
  return new Response(JSON.stringify({ 
    message: "Cancellation requested",
    note: "In serverless functions, ongoing requests may complete even after cancellation is requested"
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 