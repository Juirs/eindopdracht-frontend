import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// ============================================================================
// AUTHENTICATION HEADERS
// ============================================================================

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    return headers;
};

const getFileUploadHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {};
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
            username,
            password
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
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
// USERS
// ============================================================================

export const userApi = {
    register: async (username, password, email, isDeveloper = false) => {
        const url = isDeveloper ? '/users/register?isDeveloper=true' : '/users/register';
        await axios.post(`${API_BASE_URL}${url}`, {
            username,
            password,
            email
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
    },

    getUser: async (username) => {
        const response = await axios.get(`${API_BASE_URL}/users/${username}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },
};

// ============================================================================
// USER PROFILES
// ============================================================================

export const profileApi = {
    getProfile: async (username) => {
        const response = await axios.get(`${API_BASE_URL}/users/${username}/profile`);
        return response.data;
    },

    updateProfile: async (username, profileData) => {
        const response = await axios.put(`${API_BASE_URL}/users/${username}/profile`, profileData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    uploadAvatar: async (username, avatarFile) => {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await axios.post(`${API_BASE_URL}/users/${username}/profile/avatar`, formData, {
            headers: getFileUploadHeaders()
        });
        return response.data;
    },

    getUserAvatarUrl: (username) => {
        return `${API_BASE_URL}/users/${username}/profile/avatar`;
    },
};

// ============================================================================
// GAMES
// ============================================================================

export const gameApi = {
    getAllGames: async (category = null) => {
        const url = category ? `/games?category=${category}` : '/games';
        const response = await axios.get(`${API_BASE_URL}${url}`);
        return response.data;
    },

    getGameById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/games/${id}`);
        return response.data;
    },

    createGameWithFiles: async (gameData, imageFile = null, gameFile = null, screenshotFiles = []) => {
        const formData = new FormData();
        formData.append('title', gameData.title);
        formData.append('description', gameData.description || '');
        formData.append('category', gameData.category);

        if (gameData.trailerUrl) {
            formData.append('trailerUrl', gameData.trailerUrl);
        }

        if (imageFile) formData.append('image', imageFile);
        if (gameFile) formData.append('gameFile', gameFile);

        screenshotFiles.forEach((file, index) => {
            if (file && index < 4) {
                formData.append('screenshots', file);
            }
        });

        const response = await axios.post(`${API_BASE_URL}/games/with-files`, formData, {
            headers: getFileUploadHeaders()
        });
        return response.data;
    },

    deleteGame: async (id) => {
        await axios.delete(`${API_BASE_URL}/games/${id}`, {
            headers: getAuthHeaders()
        });
    },

    getGameImageUrl: (gameId) => {
        const token = localStorage.getItem('token');
        const url = `${API_BASE_URL}/games/${gameId}/image`;
        if (token) {
            return `${url}?token=${token}`;
        }
        return url;
    },

    getScreenshotUrl: (gameId, screenshotIndex) => {
        const token = localStorage.getItem('token');
        const url = `${API_BASE_URL}/games/${gameId}/screenshot/${screenshotIndex}`;
        if (token) {
            return `${url}?token=${token}`;
        }
        return url;
    },

    downloadGameFile: async (gameId) => {
        const response = await axios.get(`${API_BASE_URL}/games/${gameId}/download`, {
            headers: getAuthHeaders(),
            responseType: 'blob'
        });
        return response.data;
    },

    triggerGameDownload: async (gameId, gameTitle) => {
        try {
            const game = await gameApi.getGameById(gameId);
            if (!game.gameFilePath) {
                throw new Error('No downloadable file available for this game');
            }

            const blob = await gameApi.downloadGameFile(gameId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${gameTitle.replace(/[^a-zA-Z0-9]/g, '_')}_game`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading game:', error);
            throw error;
        }
    },
};

// ============================================================================
// REVIEWS
// ============================================================================

export const reviewApi = {
    getReviewsForGame: async (gameId) => {
        const response = await axios.get(`${API_BASE_URL}/games/${gameId}/reviews`);
        return response.data;
    },

    createReview: async (gameId, reviewData) => {
        const response = await axios.post(`${API_BASE_URL}/games/${gameId}/reviews`, reviewData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    deleteReview: async (reviewId) => {
        await axios.delete(`${API_BASE_URL}/games/reviews/${reviewId}`, {
            headers: getAuthHeaders()
        });
    },

    upvoteReview: async (reviewId) => {
        const response = await axios.post(`${API_BASE_URL}/games/reviews/${reviewId}/upvote`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    downvoteReview: async (reviewId) => {
        const response = await axios.post(`${API_BASE_URL}/games/reviews/${reviewId}/downvote`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

// ============================================================================
// GAME JAMS
// ============================================================================

export const gameJamApi = {
    getAllGameJams: async () => {
        const response = await axios.get(`${API_BASE_URL}/gamejams`);
        return response.data;
    },

    createGameJam: async (gameJamData) => {
        const response = await axios.post(`${API_BASE_URL}/gamejams`, gameJamData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    joinGameJam: async (id) => {
        const response = await axios.post(`${API_BASE_URL}/gamejams/${id}/join`, {}, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const api = {
    auth: authApi,
    users: userApi,
    profiles: profileApi,
    games: gameApi,
    reviews: reviewApi,
    gameJams: gameJamApi,
};

export default api;
