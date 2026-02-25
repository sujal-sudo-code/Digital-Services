const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
    return localStorage.getItem('auth_token');
}

function setToken(token) {
    localStorage.setItem('auth_token', token);
}

function clearToken() {
    localStorage.removeItem('auth_token');
}

function authHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ===== Auth =====

export async function login(email, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    return data.user;
}

export async function getSession() {
    const token = getToken();
    if (!token) return null;

    try {
        const res = await fetch(`${API_URL}/api/auth/session`, {
            headers: authHeaders(),
        });
        if (!res.ok) {
            clearToken();
            return null;
        }
        const data = await res.json();
        return data.user;
    } catch {
        clearToken();
        return null;
    }
}

export function logout() {
    clearToken();
}

// ===== Submissions =====

export async function getSubmissions() {
    const res = await fetch(`${API_URL}/api/submissions`, {
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch submissions');
    return data.submissions;
}

export async function createSubmission(formData) {
    const res = await fetch(`${API_URL}/api/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit');
    return data.submission;
}

export async function updateSubmission(id, updates) {
    const res = await fetch(`${API_URL}/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update');
    return data.submission;
}

export async function deleteSubmission(id) {
    const res = await fetch(`${API_URL}/api/submissions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete');
    return data;
}
