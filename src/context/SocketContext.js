import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { Snackbar, Alert, Avatar } from '@mui/material';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user, token } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // Danh sách user IDs đang online
    const [notification, setNotification] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user && token) {
            const newSocket = io('http://localhost:5000/messenger', {
                query: { userId: user.id },
                auth: { token },
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('Connected to WebSocket');
                // Lấy danh sách online ban đầu
                newSocket.emit('users:online');
            });

            // Lắng nghe danh sách online
            newSocket.on('users:online', (data) => {
                setOnlineUsers(data.userIds || []);
            });

            // Lắng nghe có người mới online
            newSocket.on('user:online', (data) => {
                setOnlineUsers(prev => prev.includes(data.userId) ? prev : [...prev, data.userId]);
            });

            // Lắng nghe có người offline
            newSocket.on('user:offline', (data) => {
                setOnlineUsers(prev => prev.filter(id => id !== data.userId));
            });

            // Lắng nghe thông báo
            newSocket.on('notification:receive', (data) => {
                setNotification(data);
                setOpen(true);
            });

            // Lắng nghe tin nhắn
            newSocket.on('message:receive', (msg) => {
                setNotification({
                    actor: msg.sender,
                    displayContent: `<b>${msg.sender?.username || 'Ai đó'}</b> đã gửi tin nhắn: ${msg.content}`,
                    type: 'message'
                });
                setOpen(true);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user, token]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
            
            {/* Hiển thị thông báo nhanh (Toast) */}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleClose}
                    severity="info"
                    icon={notification?.actor?.avatarUrl ? (
                        <Avatar src={notification.actor.avatarUrl} sx={{ width: 24, height: 24 }} />
                    ) : undefined}
                    sx={{
                        width: '100%',
                        bgcolor: '#262626',
                        color: 'white',
                        '& .MuiAlert-message': { width: '100%' }
                    }}
                >
                    <span dangerouslySetInnerHTML={{ __html: notification?.displayContent || notification?.content || 'Bạn có thông báo mới' }} />
                </Alert>
            </Snackbar>
        </SocketContext.Provider>
    );
};
