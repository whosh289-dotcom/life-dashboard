import { verify } from '../../utils/jwt';

export async function onRequestPut(context) {
    const { request, env, params } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const data = await request.json();
    
    await env.DB.prepare(`
        UPDATE documents SET name=?, type=?, expiry_date=?, issue_date=?, reference_number=?, file_url=?, notes=?
        WHERE id = ? AND user_id = ?
    `).bind(data.name, data.type, data.expiry_date, data.issue_date, data.reference_number, data.file_url, data.notes, params.id, user.id).run();

    return Response.json({ ...data, id: params.id, user_id: user.id });
}

export async function onRequestDelete(context) {
    const { request, env, params } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    await env.DB.prepare('DELETE FROM documents WHERE id = ? AND user_id = ?').bind(params.id, user.id).run();
    return Response.json({ success: true });
}
