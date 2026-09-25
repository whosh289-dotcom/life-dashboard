import { verify } from '../../utils/jwt';

export async function onRequestGet(context) {
    const { request, env } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.CLERK_SECRET_KEY);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { results } = await env.DB.prepare('SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_date DESC').bind(user.id).all();
    return Response.json(results);
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const user = await verify(request.headers.get('Authorization')?.replace('Bearer ', ''), env.CLERK_SECRET_KEY);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const data = await request.json();
    const id = crypto.randomUUID();
    
    await env.DB.prepare(`
        INSERT INTO subscriptions (id, user_id, name, category, cost, billing_cycle, next_billing_date, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, user.id, data.name, data.category, data.cost, data.billing_cycle, data.next_billing_date, data.status, data.notes).run();

    return Response.json({ ...data, id, user_id: user.id });
}
