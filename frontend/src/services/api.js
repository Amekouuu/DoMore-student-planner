import axios from 'axios';
import router from '../routing/router.js';

// Base API URL from environment variable
const API_URL = `${import.meta.env.VITE_API_URL}/api`;
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
console.log("API_URL used by axios =", API_URL);
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRedirecting = false;

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            if (!isRedirecting) {
                isRedirecting = true;
                router.push({ name: 'Login' })
                    .catch(err => {
                        if (err.name !== 'NavigationDuplicated') {
                            console.error('Router push error after 401:', err);
                        }
                    })
                    .finally(() => {
                        isRedirecting = false;
                    });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
