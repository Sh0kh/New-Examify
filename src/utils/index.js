import axios from "axios";

export const BASE_URL = "https://ielts.itlive.uz";

export const $api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавление access token в заголовки
$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Обработка ответа
$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token'); // здесь нужен refresh_token!

                if (!refreshToken) {
                    throw new Error('Refresh token yoki user ID topilmadi');
                }

                // Отправляем запрос на обновление токена
                const response = await axios.post(`${BASE_URL}/api/user/refresh-token`, {
                    refresh_token: refreshToken,
                });

                const newToken = response.data.token;

                // Сохраняем новый токен
                localStorage.setItem('token', newToken);

                // Обновляем заголовок и повторяем запрос
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return $api(originalRequest);

            } catch (refreshError) {
                // localStorage.clear();
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
