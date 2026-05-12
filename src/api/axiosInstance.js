import axios from 'axios';
import keycloak from '../keycloak';
import appConfig from '../config/appConfig';

// Tạo instance mặc định
const axiosInstance = axios.create({
    baseURL: appConfig.apiUrl, // URL gốc của API
    timeout: 10000, // 10 giây
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🧠 Thêm interceptor cho request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🧱 Thêm interceptor cho response
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                console.warn('Token hết hạn hoặc không hợp lệ, đang đăng xuất...');
                localStorage.removeItem('access_token');
                // Chuyển hướng người dùng về trang login nếu cần
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
