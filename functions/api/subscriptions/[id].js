import { verify } from '../../utils/jwt';

export async function onRequestPut(context) {
    const { request, env, params } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const data = await request.json();
    
    await env.DB.prepare(`
        UPDATE subscriptions SET name=?, category=?, cost=?, billing_cycle=?, next_billing_date=?, status=?, notes=?
        WHERE id = ? AND user_id = ?
    `).bind(data.name, data.category, data.cost, data.billing_cycle, data.next_billing_date, data.status, data.notes, params.id, user.id).run();

    return Response.json({ ...data, id: params.id, user_id: user.id });
}

export async function onRequestDelete(context) {
    const { request, env, params } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    await env.DB.prepare('DELETE FROM subscriptions WHERE id = ? AND user_id = ?').bind(params.id, user.id).run();
    return Response.json({ success: true });
}
