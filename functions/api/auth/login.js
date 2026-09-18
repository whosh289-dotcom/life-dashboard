import { hashPassword } from '../../utils/hash';
import { sign } from '../../utils/jwt';

export async function onRequestPost(context) {
    const { request, env } = context;
    const { email, password } = await request.json();

    const passwordHash = await hashPassword(password);
    
    const user = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND password_hash = ?')
        .bind(email, passwordHash).first();

    if (!user) return new Response('Invalid credentials', { status: 401 });

    const token = await sign({ id: user.id, email: user.email }, env.JWT_SECRET);
    return Response.json({ token, user: { id: user.id, email: user.email } });
}
