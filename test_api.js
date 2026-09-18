const url = 'https://life-dashboard-8hq.pages.dev';

async function run() {
    // 1. Register
    const email = `test-${Date.now()}@test.com`;
    console.log('Registering:', email);
    const reg = await fetch(`${url}/api/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ email, password: 'password123' })
    });
    const regData = await reg.json();
    const token = regData.token;
    console.log('Token:', token ? 'Got token' : 'No token');

    if (!token) {
        console.log(regData);
        return;
    }

    // 2. Create Contact
    const contactRes = await fetch(`${url}/api/contacts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: 'Test Contact', role: 'Agent', email: 'test@test.com' })
    });
    console.log('Create Contact Status:', contactRes.status);
    console.log(await contactRes.text());

    // 3. Fetch Contacts
    const getRes = await fetch(`${url}/api/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Fetch Contacts Status:', getRes.status);
    console.log(await getRes.text());
}
run();
