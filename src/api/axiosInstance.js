import axios from 'axios';

// Tạo instance mặc định
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com', // URL gốc của API
    timeout: 10000, // 10 giây
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🧠 Thêm interceptor cho request
axiosInstance.interceptors.request.use(
    (config) => {
        // Nếu có token -> gắn vào header
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
            // Xử lý lỗi 401 (token hết hạn)
            if (status === 401) {
                console.warn('Token hết hạn hoặc không hợp lệ');
                localStorage.removeItem('access_token');
                // Có thể redirect về trang login tại đây
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
