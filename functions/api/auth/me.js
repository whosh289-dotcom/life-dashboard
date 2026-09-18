import { verify } from '../../utils/jwt';

export async function onRequestGet(context) {
    const { request, env } = context;
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    const user = await verify(token, env.JWT_SECRET);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const dbUser = await env.DB.prepare('SELECT id, email, role FROM users WHERE id = ?')
        .bind(user.id).first();
        
    if (!dbUser) return new Response('User not found', { status: 401 });

    return Response.json(dbUser);
}
