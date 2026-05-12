import axiosInstance from './axiosInstance';

/**
 * Story API Service
 */
const storyApi = {
    /**
     * Tạo story mới
     * @param {FormData} formData - FormData chứa file
     */
    createStory: (formData) => {
        return axiosInstance.post('/story', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 giây cho upload ảnh
        });
    },

    /**
     * Lấy danh sách story từ bảng tin
     */
    getStoryFeed: () => {
        return axiosInstance.get('/story/feed');
    }
};

export default storyApi;
