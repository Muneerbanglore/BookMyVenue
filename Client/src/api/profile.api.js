import { refreshSession } from './auth.api';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://bookmyvenue-2c0a.onrender.com/api/v1';

// Intelligent wrapper to handle 401s and auto-refresh the token
const fetchWithAuth = async (url, options = {}) => {
    // 1. First attempt with provided options (which should include the current token)
    let res = await fetch(url, options);
    
    // 2. If 401 Unauthorized, attempt to refresh
    if (res.status === 401) {
        try {
            const savedUserStr = localStorage.getItem('currentUser');
            if (savedUserStr) {
                const currentUser = JSON.parse(savedUserStr);
                if (currentUser.refreshToken) {
                    // Try to refresh the session
                    const refreshData = await refreshSession(currentUser.refreshToken);
                    
                    if (refreshData?.data?.accessToken) {
                        // Update local storage with new tokens
                        currentUser.accessToken = refreshData.data.accessToken;
                        currentUser.refreshToken = refreshData.data.refreshToken || currentUser.refreshToken;
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        // Retry original request with new token
                        const newOptions = {
                            ...options,
                            headers: {
                                ...options.headers,
                                'Authorization': `Bearer ${refreshData.data.accessToken}`
                            }
                        };
                        res = await fetch(url, newOptions);
                    }
                }
            }
        } catch (error) {
            console.error('Session refresh failed:', error);
            // If refresh fails, we will let it fall through and return the 401 error
        }
    }
    
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'API Request Failed');
    return data;
};

export const getUserProfile = async (token) => {
    console.log("token",token);
    return await fetchWithAuth(`${BASE_URL}/users/profile`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

export const updateUserProfile = async (token, updateData) => {
    return await fetchWithAuth(`${BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    });
};

export const triggerHeavyTask = async (token, iterations = 50000000) => {
    return await fetchWithAuth(`${BASE_URL}/users/heavy-task`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ iterations })
    });
};

// Keeping the old one just in case
export const profileDetails = async (email) => {
    const res = await fetch(`${BASE_URL}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Profile Details Unavailable');
    return data;
};
