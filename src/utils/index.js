import axios from "axios";

export const BASE_URL = "https://ielts.itlive.uz";

export const $api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Интерцептор для автоматического добавления токена
$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Интерцептор для обработки ответов
$api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Удаляем токен из localStorage
            localStorage.clear();

            // Перенаправляем на страницу логина
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);