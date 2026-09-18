export async function onRequestPost({ request, env }) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return new Response('Unauthorized', { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return new Response('No file provided', { status: 400 });

    const fileName = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload to R2
    await env.BUCKET.put(fileName, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // We assume the bucket is connected to a public domain, or we fetch it via another API endpoint.
    // To keep it simple, we'll return a path that our API can serve, or if they have a public R2.dev link.
    // Actually, serving via R2 directly requires making the bucket public or writing a GET handler.
    // Let's write a GET handler in the same file!

    return new Response(JSON.stringify({ file_url: `/api/upload?file=${fileName}` }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const fileName = url.searchParams.get('file');
  if (!fileName) return new Response('Not found', { status: 404 });

  const object = await env.BUCKET.get(fileName);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);

  return new Response(object.body, { headers });
}
