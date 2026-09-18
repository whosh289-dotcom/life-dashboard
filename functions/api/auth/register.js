import { hashPassword } from '../../utils/hash';
import { sign } from '../../utils/jwt';

export async function onRequestPost(context) {
    const { request, env } = context;
    const { email, password } = await request.json();

    if (!email || !password) return new Response('Missing fields', { status: 400 });

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    try {
        await env.DB.prepare('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)')
            .bind(id, email, passwordHash).run();
            
        const token = await sign({ id, email }, env.JWT_SECRET);
        return Response.json({ token, user: { id, email } });
    } catch (e) {
        return new Response('Email already exists', { status: 400 });
    }
}
