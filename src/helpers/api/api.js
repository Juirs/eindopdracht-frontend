import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};

// ============================================================================
// AUTHENTICATION / SIGN IN
// ============================================================================
export const authApi = {
    login: async (username, password) => {
        const response = await axios.post(`${API_BASE_URL}/authenticate`, {
            username: username,
            password: password,
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },
};

// ============================================================================
// USERS
// ============================================================================
export const userApi = {
    register: async (userData, isDeveloper = false) => {
        const url = isDeveloper ? '/users/register?isDeveloper=true' : '/users/register';
        await axios.post(`${API_BASE_URL}${url}`, userData, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    getUser: async (username) => {
        const response = await axios.get(`${API_BASE_URL}/users/${username}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    updateUser: async (username, userData) => {
        await axios.put(`${API_BASE_URL}/users/${username}`, userData, {
            headers: getAuthHeaders()
        });
    },

    changePassword: async (username, newPassword) => {
        const response = await axios.put(`${API_BASE_URL}/users/${username}/change-password`,
            { newPassword },
            { headers: getAuthHeaders() }
        );
        return response.data;
    }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
const api = {
    auth: authApi,
    users: userApi,
};

export default api;
