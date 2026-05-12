import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
    Box, 
    Typography, 
    Avatar, 
    TextField, 
    IconButton, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText,
    CircularProgress,
    Divider
} from '@mui/material';
import { 
    Send as SendIcon, 
    Info as InfoIcon, 
    Edit as EditIcon,
    InsertEmoticon as EmojiIcon,
    Image as ImageIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import classes from './messages.module.css';
import messengerApi from '../../api/messengerApi';
import { useSocket } from '../../context/SocketContext';
import NewChatModal from '../../component/NewChatModal';

const formatLastSeen = (dateString) => {
    if (!dateString) return '';
    const lastSeen = new Date(dateString);
    const now = new Date();
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa mới hoạt động';
    if (diffMins < 60) return `Hoạt động ${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hoạt động ${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hoạt động ${diffDays} ngày trước`;
};

const MessagesPage = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const { socket, onlineUsers } = useSocket();
    
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Lấy danh sách hội thoại
    const fetchConversations = async () => {
        try {
            const res = await messengerApi.getConversations();
            setConversations(res.data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Lấy lịch sử tin nhắn khi chọn conversation
    useEffect(() => {
        if (!selectedConversation) return;

        // Join room
        if (socket && selectedConversation.id) {
            socket.emit('room:join', { conversationId: selectedConversation.id });
        }

        const fetchHistory = async () => {
            if (!selectedConversation.id) {
                setMessages([]);
                return;
            }
            setHistoryLoading(true);
            try {
                const res = await messengerApi.getConversationMessages(selectedConversation.id);
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [selectedConversation, socket]);

    // Xử lý WebSocket
    useEffect(() => {
        if (!socket) return;

        socket.on('message:receive', (msg) => {
            console.log('MessagesPage: Received message:', msg);
            
            // Nếu tin nhắn thuộc conversation đang mở
            if (selectedConversation && msg.conversationId === selectedConversation.id) {
                setMessages(prev => {
                    const exists = prev.find(m => (m.id && m.id === msg.id) || (m.tempId && m.tempId === msg.tempId));
                    if (exists) return prev;
                    return [...prev, msg];
                });
            }

            // Cập nhật danh sách hội thoại ở Sidebar
            fetchConversations();
        });

        return () => {
            socket.off('message:receive');
        };
    }, [socket, selectedConversation]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedConversation) return;
        if (!socket) {
            console.error('Socket not connected');
            return;
        }
        const tempId = Date.now();
        const newMessage = {
            conversationId: selectedConversation.id,
            content: messageText,
            senderId: currentUser.id,
            sender: currentUser,
            createdAt: new Date().toISOString(),
            tempId,
            status: 'sending'
        };

        // Optimistic Update
        setMessages(prev => [...prev, newMessage]);
        const currentText = messageText;
        setMessageText('');

        // Emit qua Socket
        socket.emit('message:send', {
            conversationId: selectedConversation.id,
            receiverId: selectedConversation.type === 'private' ? selectedConversation.members.find(m => m.userId !== currentUser.id)?.userId : null,
            content: currentText,
            tempId
        }, (response) => {
            if (response.success && !selectedConversation.id) {
                // Nếu là hội thoại mới, cập nhật lại conversationId
                setSelectedConversation(prev => ({...prev, id: response.message.conversationId}));
                fetchConversations();
            }
        });
    };

    const handleSelectUserFromSearch = (otherUser) => {
        // Tìm xem đã có hội thoại với người này chưa
        const existing = conversations.find(c => 
            c.type === 'private' && c.members.some(m => m.userId === otherUser.id)
        );

        if (existing) {
            setSelectedConversation(existing);
        } else {
            // Tạo một conversation giả định (chưa có ID) để hiển thị UI
            setSelectedConversation({
                id: null,
                type: 'private',
                name: otherUser.username,
                avatar: otherUser.avatarUrl,
                members: [
                    { userId: currentUser.id, user: currentUser },
                    { userId: otherUser.id, user: otherUser }
                ]
            });
        }
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <Box className={classes.messagesPage} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className={`${classes.messagesPage} ${selectedConversation ? classes.chatOpen : ''}`}>
            {/* Sidebar */}
            <Box className={classes.sidebar}>
                <Box className={classes.sidebarHeader}>
                    <Typography variant="h6">{currentUser.username}</Typography>
                    <IconButton onClick={() => setIsModalOpen(true)} className={classes.newMessageBtn}>
                        <EditIcon />
                    </IconButton>
                </Box>
                
                <List className={classes.conversationList}>
                    {conversations.map((conv) => (
                        <ListItem 
                            key={conv.id} 
                            button 
                            className={`${classes.conversationItem} ${selectedConversation?.id === conv.id ? classes.active : ''}`}
                            onClick={() => setSelectedConversation(conv)}
                        >
                                <Box className={classes.avatarWrapper}>
                                    <Avatar 
                                        src={conv.avatar} 
                                        className={classes.avatar}
                                    >
                                        {conv.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    {conv.type === 'private' && onlineUsers.includes(conv.members.find(m => m.userId !== currentUser.id)?.userId) && (
                                        <Box className={classes.onlineDot} />
                                    )}
                                </Box>
                            <ListItemText 
                                primary={<Typography className={classes.name}>{conv.name}</Typography>}
                                secondary={
                                    <Typography className={`${classes.lastMessage} ${conv.unreadCount > 0 ? classes.unread : ''}`}>
                                        {conv.lastMessage?.content || 'Chưa có tin nhắn'}
                                    </Typography>
                                }
                            />
                            {conv.unreadCount > 0 && <Box className={classes.unreadBadge}>{conv.unreadCount}</Box>}
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Chat Area */}
            <Box className={classes.chatArea}>
                {selectedConversation ? (
                    <>
                        <Box className={classes.chatHeader}>
                            <Box className={classes.chatUserInfo}>
                                <IconButton 
                                    className={classes.backBtn} 
                                    onClick={() => setSelectedConversation(null)}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                                <Box className={classes.avatarWrapper}>
                                    <Avatar src={selectedConversation.avatar} className={classes.chatAvatar} />
                                    {selectedConversation.type === 'private' && onlineUsers.includes(selectedConversation.members.find(m => m.userId !== currentUser.id)?.userId) && (
                                        <Box className={classes.onlineDot} />
                                    )}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography className={classes.chatUserName}>{selectedConversation.name}</Typography>
                                    <Typography className={classes.userStatus}>
                                        {onlineUsers.includes(selectedConversation.members.find(m => m.userId !== currentUser.id)?.userId) 
                                            ? 'Đang hoạt động' 
                                            : formatLastSeen(selectedConversation.members.find(m => m.userId !== currentUser.id)?.user?.lastSeenAt)}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton className={classes.infoBtn}><InfoIcon /></IconButton>
                        </Box>

                        <Box className={classes.messagesContainer}>
                            {historyLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress size={24} /></Box>
                            ) : (
                                messages.map((msg, index) => (
                                    <Box 
                                        key={msg.id || msg.tempId || index} 
                                        className={`${classes.message} ${msg.senderId === currentUser.id ? classes.myMessage : classes.otherMessage}`}
                                    >
                                        {msg.senderId !== currentUser.id && (
                                            <Avatar src={msg.sender?.avatarUrl} className={classes.messageAvatar} />
                                        )}
                                        <Box className={classes.messageContent}>
                                            <Typography className={classes.messageText}>
                                                {msg.content}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        <form className={classes.messageInputContainer} onSubmit={handleSendMessage}>
                            <Box className={classes.inputWrapper}>
                                <IconButton className={classes.emojiBtn}><EmojiIcon /></IconButton>
                                <input
                                    placeholder="Nhắn tin..."
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    className={classes.customInput}
                                    autoComplete="off"
                                />
                                {messageText.trim() ? (
                                    <button type="submit" className={classes.sendBtnText}>Gửi</button>
                                ) : (
                                    <Box sx={{ display: 'flex' }}>
                                        <IconButton className={classes.actionBtn}><ImageIcon /></IconButton>
                                    </Box>
                                )}
                            </Box>
                        </form>
                    </>
                ) : (
                    <Box className={classes.noChat}>
                        <Box className={classes.noChatContent}>
                            <Typography variant="h5">Tin nhắn của bạn</Typography>
                            <Typography variant="body2">Gửi ảnh và tin nhắn riêng tư cho bạn bè.</Typography>
                            <button className={classes.sendMessageBtn} onClick={() => setIsModalOpen(true)}>Gửi tin nhắn</button>
                        </Box>
                    </Box>
                )}
            </Box>

            <NewChatModal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSelectUser={handleSelectUserFromSearch} 
            />
        </Box>
    );
};

export default MessagesPage;
