import axiosInstance from './axiosInstance';

/**
 * Authentication API Service
 */
const authApi = {
    /**
     * Đăng ký người dùng mới
     * @param {Object} userData - { username, email, password, fullName }
     */
    register: (userData) => {
        return axiosInstance.post('/auth/register', userData);
    },

    /**
     * Đăng nhập người dùng
     * @param {Object} credentials - { username, password }
     */
    login: (credentials) => {
        return axiosInstance.post('/auth/login', credentials);
    },

    /**
     * Đăng xuất người dùng (tùy chọn, chủ yếu xóa token ở client)
     */
    logout: () => {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    }
};

export default authApi;
