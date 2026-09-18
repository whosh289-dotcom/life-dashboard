const DEFAULT_SECRET = 'super-secret-local-dev-key';

function base64UrlEncode(str) {
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return atob(s);
}

export async function sign(payload, secret = DEFAULT_SECRET) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encHeader = base64UrlEncode(JSON.stringify(header));
    const encPayload = base64UrlEncode(JSON.stringify(payload));
    const data = encHeader + '.' + encPayload;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw', encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const encSignature = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    return data + '.' + encSignature;
}

export async function verify(token, secret = DEFAULT_SECRET) {
    if (!token) return null;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const [encHeader, encPayload, encSignature] = parts;
        const data = encHeader + '.' + encPayload;

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
            'raw', encoder.encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false, ['verify']
        );
        
        const signatureBytes = Uint8Array.from(atob(encSignature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(data));
        if (!isValid) return null;

        return JSON.parse(base64UrlDecode(encPayload));
    } catch (e) {
        return null;
    }
}
