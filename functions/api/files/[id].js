export async function onRequestGet(context) {
    const { env, params } = context;
    const file_id = params.id;

    const { results } = await env.DB.prepare('SELECT chunk_data FROM document_chunks WHERE file_id = ? ORDER BY chunk_index ASC').bind(file_id).all();
    if (!results || results.length === 0) return new Response('Not found', { status: 404 });

    const fullDataUri = results.map(r => r.chunk_data).join('');
    
    const matches = fullDataUri.match(/^data:([a-zA-Z0-9-+/]+);base64,(.+)$/);
    if (!matches) {
        return new Response(fullDataUri);
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }

    return new Response(bytes, {
        headers: {
            'Content-Type': mimeType,
            'Cache-Control': 'public, max-age=31536000'
        }
    });
}
