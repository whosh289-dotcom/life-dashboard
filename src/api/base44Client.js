export const getToken = async () => window.Clerk?.session ? await window.Clerk.session.getToken() : null;

async function apiFetch(url, options = {}) {
    const token = await getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        if (response.status === 401) {
            // Let Clerk handle unauthenticated redirects or just reload
        }
        throw new Error(await response.text());
    }
    return response.json();
}

const createEntityApi = (name) => ({
    list: () => apiFetch(`/api/${name}`),
    create: (data) => apiFetch(`/api/${name}`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch(`/api/${name}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch(`/api/${name}/${id}`, { method: 'DELETE' })
});

export const base44 = {
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                const token = await getToken();
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                const res = await fetch('/api/files', {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: base64 })
                });
                if (!res.ok) throw new Error('Upload failed');
                return await res.json();
            }
        }
    },
    entities: {
        Subscription: createEntityApi('subscriptions'),
        Document: createEntityApi('documents'),
        Contact: createEntityApi('contacts')
    }
};
