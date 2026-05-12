import axiosInstance from './axiosInstance';

const messengerApi = {
    // Lấy danh sách cuộc trò chuyện (Inbox)
    getConversations: () => {
        return axiosInstance.get('/messenger');
    },

    // Lấy hoặc tạo cuộc trò chuyện riêng tư với 1 user
    getOrCreatePrivateConversation: (userId) => {
        return axiosInstance.get(`/messenger/conversation/private/${userId}`);
    },

    // Lấy lịch sử tin nhắn của 1 cuộc trò chuyện
    getConversationMessages: (conversationId) => {
        return axiosInstance.get(`/messenger/${conversationId}/messages`);
    },

    // Gửi tin nhắn (thường dùng socket, API này dự phòng hoặc gửi file)
    sendMessage: (data) => {
        return axiosInstance.post('/messenger/messages', data);
    },

    // Xóa tin nhắn (Cần update logic backend sau)
    deleteMessage: (id) => {
        return axiosInstance.delete(`/messenger/${id}`);
    }
};

export default messengerApi;
