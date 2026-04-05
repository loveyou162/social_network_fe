import React, { useState } from 'react';
import classes from './messages.module.css';

const MessagesPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageText, setMessageText] = useState('');

    // Dữ liệu mẫu cho danh sách chat
    const [conversations] = useState([
        {
            id: 1,
            name: 'Nguyễn Văn A',
            avatar: 'https://i.pravatar.cc/150?img=1',
            lastMessage: 'Chào bạn!',
            time: '10:30',
            unread: 2,
        },
        {
            id: 2,
            name: 'Trần Thị B',
            avatar: 'https://i.pravatar.cc/150?img=2',
            lastMessage: 'Hẹn gặp lại nhé',
            time: '09:15',
            unread: 0,
        },
        {
            id: 3,
            name: 'Lê Văn C',
            avatar: 'https://i.pravatar.cc/150?img=3',
            lastMessage: 'Cảm ơn bạn!',
            time: 'Hôm qua',
            unread: 1,
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            avatar: 'https://i.pravatar.cc/150?img=4',
            lastMessage: 'OK, tôi hiểu rồi',
            time: 'Hôm qua',
            unread: 0,
        },
    ]);

    // Dữ liệu mẫu cho tin nhắn
    const [messages] = useState({
        1: [
            { id: 1, text: 'Chào bạn!', sender: 'other', time: '10:28' },
            { id: 2, text: 'Bạn khỏe không?', sender: 'other', time: '10:29' },
            { id: 3, text: 'Chào! Tôi khỏe, cảm ơn bạn', sender: 'me', time: '10:30' },
        ],
        2: [
            { id: 1, text: 'Hôm nay gặp nhau nhé', sender: 'me', time: '09:10' },
            { id: 2, text: 'OK, mấy giờ thế?', sender: 'other', time: '09:12' },
            { id: 3, text: '2 giờ chiều được không?', sender: 'me', time: '09:13' },
            { id: 4, text: 'Hẹn gặp lại nhé', sender: 'other', time: '09:15' },
        ],
        3: [
            { id: 1, text: 'Cảm ơn bạn đã giúp đỡ!', sender: 'other', time: '08:45' },
            { id: 2, text: 'Không có gì, sẵn sàng giúp đỡ bất cứ lúc nào', sender: 'me', time: '08:50' },
        ],
        4: [
            { id: 1, text: 'Tài liệu đã gửi cho bạn rồi', sender: 'me', time: '07:30' },
            { id: 2, text: 'OK, tôi hiểu rồi', sender: 'other', time: '07:35' },
        ],
    });

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageText.trim() && selectedChat) {
            // Logic gửi tin nhắn sẽ được thêm ở đây
            console.log('Gửi tin nhắn:', messageText);
            setMessageText('');
        }
    };

    return (
        <div className={classes.messagesPage}>
            {/* Sidebar - Danh sách cuộc trò chuyện */}
            <div className={classes.sidebar}>
                <div className={classes.sidebarHeader}>
                    <h2>Tin nhắn</h2>
                    <button className={classes.newMessageBtn}>✏️</button>
                </div>
                <div className={classes.conversationList}>
                    {conversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`${classes.conversationItem} ${selectedChat === conv.id ? classes.active : ''
                                }`}
                            onClick={() => setSelectedChat(conv.id)}
                        >
                            <img src={conv.avatar} alt={conv.name} className={classes.avatar} />
                            <div className={classes.conversationInfo}>
                                <div className={classes.conversationHeader}>
                                    <span className={classes.name}>{conv.name}</span>
                                    <span className={classes.time}>{conv.time}</span>
                                </div>
                                <div className={classes.conversationFooter}>
                                    <span
                                        className={`${classes.lastMessage} ${conv.unread > 0 ? classes.unread : ''
                                            }`}
                                    >
                                        {conv.lastMessage}
                                    </span>
                                    {conv.unread > 0 && (
                                        <span className={classes.unreadBadge}>{conv.unread}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area - Khu vực chat */}
            <div className={classes.chatArea}>
                {selectedChat ? (
                    <>
                        <div className={classes.chatHeader}>
                            <div className={classes.chatUserInfo}>
                                <img
                                    src={
                                        conversations.find((c) => c.id === selectedChat)?.avatar
                                    }
                                    alt="avatar"
                                    className={classes.chatAvatar}
                                />
                                <span className={classes.chatUserName}>
                                    {conversations.find((c) => c.id === selectedChat)?.name}
                                </span>
                            </div>
                            <button className={classes.infoBtn}>ℹ️</button>
                        </div>

                        <div className={classes.messagesContainer}>
                            {messages[selectedChat]?.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`${classes.message} ${msg.sender === 'me' ? classes.myMessage : classes.otherMessage
                                        }`}
                                >
                                    {msg.sender === 'other' && (
                                        <img
                                            src={
                                                conversations.find((c) => c.id === selectedChat)
                                                    ?.avatar
                                            }
                                            alt="avatar"
                                            className={classes.messageAvatar}
                                        />
                                    )}
                                    <div className={classes.messageContent}>
                                        <div className={classes.messageText}>{msg.text}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form className={classes.messageInputContainer} onSubmit={handleSendMessage}>
                            <button type="button" className={classes.emojiBtn}>
                                😊
                            </button>
                            <input
                                type="text"
                                placeholder="Nhắn tin..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                className={classes.messageInput}
                            />
                            <button
                                type="submit"
                                className={classes.sendBtn}
                                disabled={!messageText.trim()}
                            >
                                Gửi
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={classes.noChat}>
                        <div className={classes.noChatContent}>
                            <h2>Tin nhắn của bạn</h2>
                            <p>Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm</p>
                            <button className={classes.sendMessageBtn}>Gửi tin nhắn</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;

const STATUS_HTML_MAP: Record<string, string> = {
    PENDING:  // Chờ duyệt
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#FEF9C2;color:#FFA600;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #BAB046;">Chờ phê duyệt</div>',

    WAIT_SIGN:  // Chờ tiếp nhận (hoặc Chờ ký)
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#E6F7FF;color:#0369A1;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #A8D8FF;">Chờ tiếp nhận</div>',

    WAIT_COMMANDER:  // Chờ chỉ huy → Đổi sang nâu
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#FFE8CC;color:#C05600;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #C05600;">Chờ chỉ huy</div>',

    WAIT_RECEIVE:  // Chờ tiếp nhận (nếu có key riêng)
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#E6F7FF;color:#0369A1;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #A8D8FF;">Chờ tiếp nhận</div>',

    IN_USE:  // Đang sử dụng
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#ACCBFF;color:#002089;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #579FFF;">Đang sử dụng</div>',

    APPROVED:  // Đã phê duyệt (nếu vẫn dùng key này, mình giữ màu xanh dương giống Đang sử dụng)
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#DBEAFE;color:#0062AD;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #82B8FF;">Đã phê duyệt</div>',

    COMPLETED:  // Hoàn tất
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#E0F7FA;color:#F44336;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #FFA2A2;">Hoàn tất</div>',

    REJECTED:  // Từ chối
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#FFDCD9;color:#F44336;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #FFA2A2;">Từ chối</div>',

    CANCELLED:  // Đã hủy
        '<div style="display:flex;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;align-items:center;justify-content:center;width:100%;height:30px;padding:0 16px;background:#E0E0E0;color:#555555;font-weight:700;font-size:14px;border-radius:15px;border:1px solid #AEB5BE;">Đã hủy</div>',
};
