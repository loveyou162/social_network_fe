import axiosInstance from './axiosInstance';

/**
 * Blog/Post API Service
 */
const blogApi = {
    /**
     * Tạo bài viết mới kèm media (ảnh/video)
     * @param {FormData} formData - FormData chứa file, caption, location, mediaType
     */
    createPost: (formData) => {
        return axiosInstance.post('/blog', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // 60 giây cho upload ảnh
        });
    },

    /**
     * Lấy bảng tin (các bài viết từ những người đang follow)
     */
    getFeed: () => {
        return axiosInstance.get('/blog/feed');
    },

    /**
     * Like hoặc Unlike bài viết (Toggle)
     * @param {string} id - ID bài viết
     */
    likePost: (id) => {
        return axiosInstance.post(`/blog/${id}/like`);
    },

    /**
     * Thêm bình luận vào bài viết
     * @param {string} id - ID bài viết
     * @param {string} content - Nội dung bình luận
     */
    commentPost: (id, content) => {
        return axiosInstance.post(`/blog/${id}/comment`, { content });
    },

    /**
     * Lấy chi tiết một bài viết (nếu backend hỗ trợ)
     * @param {string} id - ID bài viết
     */
    getPostDetail: (id) => {
        return axiosInstance.get(`/blog/${id}`);
    }
};

export default blogApi;
