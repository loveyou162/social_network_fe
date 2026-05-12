import axiosInstance from './axiosInstance';

/**
 * User API Service
 */
const userApi = {
    /**
     * Tìm kiếm người dùng theo từ khóa
     * @param {string} query - Từ khóa tìm kiếm
     */
    searchUsers: (query) => {
        return axiosInstance.get(`/user/search?q=${query}`);
    },

    /**
     * Lấy thông tin profile chi tiết của một người dùng
     * @param {string} id - ID người dùng
     */
    getUserProfile: (id) => {
        return axiosInstance.get(`/user/${id}`);
    },

    /**
     * Follow hoặc Unfollow người dùng (Toggle)
     * @param {string} id - ID người dùng cần follow/unfollow
     */
    followUser: (id) => {
        return axiosInstance.post(`/user/${id}/follow`);
    },

    /**
     * Lấy danh sách người đang follow (nếu backend hỗ trợ)
     */
    getFollowing: () => {
        return axiosInstance.get('/user/following');
    },

    /**
     * Lấy danh sách người đang follow mình (nếu backend hỗ trợ)
     */
    getFollowers: () => {
        return axiosInstance.get('/user/followers');
    },

    /**
     * Cập nhật thông tin profile
     * @param {string} id - ID người dùng
     * @param {object} data - Dữ liệu cần cập nhật
     */
    updateProfile: (id, data) => {
        return axiosInstance.patch(`/user/${id}`, data);
    },

    /**
     * Tải lên ảnh đại diện
     * @param {FormData} formData - FormData chứa file
     */
    uploadAvatar: (formData) => {
        return axiosInstance.post('/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default userApi;
