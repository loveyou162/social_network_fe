import axiosInstance from './axiosInstance';

/**
 * Notification API Service
 */
const notificationApi = {
    /**
     * Lấy danh sách thông báo của người dùng
     */
    getNotifications: () => {
        return axiosInstance.get('/notification');
    },

    /**
     * Đánh dấu thông báo là đã đọc (nếu backend hỗ trợ)
     * @param {string} id - ID thông báo
     */
    markAsRead: (id) => {
        return axiosInstance.patch(`/notification/${id}/read`);
    },

    /**
     * Đánh dấu tất cả thông báo là đã đọc (nếu backend hỗ trợ)
     */
    markAllAsRead: () => {
        return axiosInstance.patch('/notification/read-all');
    }
};

export default notificationApi;
