import { verifyToken } from '@clerk/backend';

export async function verify(token, secret) {
    if (!token) return null;
    try {
        const verified = await verifyToken(token, {
            secretKey: secret
        });
        return { id: verified.sub };
    } catch (e) {
        console.error("Clerk token verification failed", e);
        return null;
    }
}
