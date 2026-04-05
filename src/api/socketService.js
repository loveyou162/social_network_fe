import io from 'socket.io-client';

/**
 * Socket.IO Service for Messenger
 * Quản lý kết nối và các sự kiện real-time cho tính năng nhắn tin
 */
class SocketService {
    constructor() {
        this.socket = null;
        this.userId = null;
        this.eventHandlers = new Map();
    }

    /**
     * Khởi tạo kết nối Socket.IO
     * @param {number} userId - ID của user hiện tại
     * @param {string} serverUrl - URL của Socket.IO server
     */
    connect(userId, serverUrl = 'http://localhost:5000/messenger') {
        if (this.socket && this.socket.connected) {
            console.warn('Socket đã được kết nối rồi');
            return;
        }

        this.userId = userId;

        // Tạo socket instance với cấu hình
        this.socket = io(serverUrl, {
            autoConnect: true,
            query: { userId },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this._setupDefaultListeners();
    }

    /**
     * Ngắt kết nối Socket.IO
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.userId = null;
            this.eventHandlers.clear();
        }
    }

    /**
     * Thiết lập các listener mặc định
     */
    _setupDefaultListeners() {
        this.socket.on('connect', () => {
            console.log('✅ Socket.IO connected:', this.socket.id);
            this._emit('connection:success', { userId: this.userId });
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket.IO connection error:', error.message);
            this._emit('connection:error', { error: error.message });
        });

        this.socket.on('disconnect', (reason) => {
            console.warn('⚠️ Socket.IO disconnected:', reason);
            this._emit('connection:lost', { reason });
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log('🔄 Socket.IO reconnected after', attemptNumber, 'attempts');
            this._emit('connection:reconnected', { attemptNumber });
        });
    }

    /**
     * Đăng ký event handler
     * @param {string} event - Tên sự kiện
     * @param {function} handler - Hàm xử lý
     */
    on(event, handler) {
        if (!this.socket) {
            console.error('Socket chưa được khởi tạo');
            return;
        }

        // Lưu handler để có thể remove sau
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, []);
        }
        this.eventHandlers.get(event).push(handler);

        // Đăng ký với socket
        this.socket.on(event, handler);
    }

    /**
     * Hủy đăng ký event handler
     * @param {string} event - Tên sự kiện
     * @param {function} handler - Hàm xử lý (optional)
     */
    off(event, handler) {
        if (!this.socket) return;

        if (handler) {
            this.socket.off(event, handler);
            const handlers = this.eventHandlers.get(event);
            if (handlers) {
                const index = handlers.indexOf(handler);
                if (index > -1) handlers.splice(index, 1);
            }
        } else {
            this.socket.off(event);
            this.eventHandlers.delete(event);
        }
    }

    /**
     * Emit sự kiện nội bộ (cho component)
     */
    _emit(event, data) {
        const handlers = this.eventHandlers.get(event);
        if (handlers) {
            handlers.forEach((handler) => handler(data));
        }
    }

    // ==========================================
    // MESSENGER EVENTS - Gửi tin nhắn
    // ==========================================

    /**
     * Gửi tin nhắn
     * @param {object} message - { senderId, receiverId, content, type }
     */
    sendMessage(message) {
        if (!this.socket || !this.socket.connected) {
            console.error('Socket chưa kết nối');
            return;
        }

        this.socket.emit('message:send', {
            senderId: this.userId,
            receiverId: message.receiverId,
            content: message.content,
            type: message.type || 'text',
        });
    }

    /**
     * Đánh dấu tin nhắn đã đọc
     * @param {number} messageId - ID của tin nhắn
     */
    markAsRead(messageId) {
        if (!this.socket || !this.socket.connected) return;

        this.socket.emit('message:read', {
            messageId,
            userId: this.userId,
        });
    }

    // ==========================================
    // TYPING INDICATORS
    // ==========================================

    /**
     * Bắt đầu typing
     * @param {number} receiverId - ID người nhận
     */
    startTyping(receiverId) {
        if (!this.socket || !this.socket.connected) return;

        this.socket.emit('typing:start', {
            senderId: this.userId,
            receiverId,
        });
    }

    /**
     * Dừng typing
     * @param {number} receiverId - ID người nhận
     */
    stopTyping(receiverId) {
        if (!this.socket || !this.socket.connected) return;

        this.socket.emit('typing:stop', {
            senderId: this.userId,
            receiverId,
        });
    }

    // ==========================================
    // ONLINE USERS
    // ==========================================

    /**
     * Lấy danh sách user online
     */
    getOnlineUsers() {
        if (!this.socket || !this.socket.connected) return;

        this.socket.emit('users:online');
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    /**
     * Kiểm tra trạng thái kết nối
     */
    isConnected() {
        return this.socket && this.socket.connected;
    }

    /**
     * Lấy socket ID hiện tại
     */
    getSocketId() {
        return this.socket ? this.socket.id : null;
    }

    /**
     * Lấy user ID hiện tại
     */
    getUserId() {
        return this.userId;
    }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
