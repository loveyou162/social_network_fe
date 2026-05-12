import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { Snackbar, Alert, Avatar } from '@mui/material';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { user, token } = useSelector((state) => state.auth);
    const [socket, setSocket] = useState(null);
    const [notification, setNotification] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (user && token) {
            // Kết nối tới namespace /messenger (theo cấu hình backend)
            const newSocket = io('http://localhost:5000/messenger', {
                query: { userId: user.id },
                auth: { token },
                transports: ['websocket'],
            });

            newSocket.on('connect', () => {
                console.log('Connected to WebSocket');
            });

            // Lắng nghe thông báo
            newSocket.on('notification:receive', (data) => {
                console.log('New notification received:', data);
                setNotification(data);
                setOpen(true);
            });

            // Lắng nghe tin nhắn (nếu cần dùng sau này)
            newSocket.on('message:receive', (msg) => {
                console.log('New message:', msg);
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
        <SocketContext.Provider value={socket}>
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
