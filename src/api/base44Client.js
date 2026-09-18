export const getToken = () => localStorage.getItem('auth_token');

async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
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
    auth: {
        me: () => apiFetch('/api/auth/me'),
        login: async (email, password) => {
            const data = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            localStorage.setItem('auth_token', data.token);
            return data.user;
        },
        register: async (email, password) => {
            const data = await apiFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            localStorage.setItem('auth_token', data.token);
            return data.user;
        },
        redirectToLogin: () => { window.location.href = '/login'; },
        logout: () => { 
            localStorage.removeItem('auth_token');
            window.location.href = '/login'; 
        }
    },
    integrations: {
        Core: {
            UploadFile: async ({ file }) => {
                const formData = new FormData();
                formData.append('file', file);
                const token = getToken();
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
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
