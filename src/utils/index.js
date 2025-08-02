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
    async (error) => {
        const originalRequest = error.config;

        // Если ошибка 401 и это не запрос на обновление токена
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('token');
                const userId = localStorage.getItem('user_id');

                if (!refreshToken || !userId) {
                    throw new Error('No refresh token or user ID available');
                }

                // Отправляем запрос на обновление токена
                const response = await axios.post(`${BASE_URL}/api/user/refresh-token`, {
                    token: refreshToken,
                    user_id: userId
                });

                const newToken = response.data.token;
                localStorage.setItem('token', newToken);

                // Обновляем заголовок Authorization и повторяем запрос
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return $api(originalRequest);

            } catch (refreshError) {
                // Если не удалось обновить токен, очищаем хранилище и перенаправляем на логин
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);