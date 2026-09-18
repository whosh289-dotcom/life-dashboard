import { verify } from '../../utils/jwt';

export async function onRequestGet(context) {
    const { request, env } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { results } = await env.DB.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_date DESC').bind(user.id).all();
    return Response.json(results);
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const data = await request.json();
    const id = crypto.randomUUID();
    
    await env.DB.prepare(`
        INSERT INTO documents (id, user_id, name, type, expiry_date, issue_date, reference_number, file_url, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, user.id, data.name, data.type, data.expiry_date, data.issue_date, data.reference_number, data.file_url, data.notes).run();

    return Response.json({ ...data, id, user_id: user.id });
}
