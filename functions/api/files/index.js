import { verify } from '../../utils/jwt';

export async function onRequestPost(context) {
    const { request, env } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.CLERK_SECRET_KEY);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { data } = await request.json();
    if (!data) return new Response('No data', { status: 400 });

    const file_id = crypto.randomUUID();
    const chunkSize = 700000;
    const stmts = [];

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        stmts.push(
            env.DB.prepare('INSERT INTO document_chunks (file_id, chunk_index, chunk_data) VALUES (?, ?, ?)')
              .bind(file_id, i / chunkSize, chunk)
        );
    }

    await env.DB.batch(stmts);
    return Response.json({ file_url: `/api/files/${file_id}` });
}
