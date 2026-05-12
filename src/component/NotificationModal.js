import React, { useState, useEffect } from 'react';
import {
    Dialog,
    Box,
    Typography,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Chip,
    Stack,
    Divider,
    CircularProgress,
} from '@mui/material';
import { Close, NavigateNext } from '@mui/icons-material';
import notificationApi from '../api/notificationApi';
import { useNavigate } from 'react-router-dom';

const NotificationModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('Tất cả');

    const filters = ['Tất cả', 'Người mà bạn theo dõi', 'Bình luận', 'Lượt theo dõi'];

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await notificationApi.getNotifications();
            const data = res.data || res;
            setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Lỗi khi lấy thông báo:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hôm nay';
        if (diffDays < 7) return `${diffDays} ngày`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần`;
        return `${date.getDate()} thg ${date.getMonth() + 1}`;
    };

    // Phân nhóm thông báo (giả lập theo UI)
    const groupedNotifications = {
        'Yêu cầu theo dõi': notifications.filter(n => n.type === 'follow_request'),
        'Tuần này': notifications.filter(n => {
            const diff = (new Date() - new Date(n.createdAt)) / (1000 * 60 * 60 * 24);
            return diff <= 7 && n.type !== 'follow_request';
        }),
        'Tháng này': notifications.filter(n => {
            const diff = (new Date() - new Date(n.createdAt)) / (1000 * 60 * 60 * 24);
            return diff > 7 && n.type !== 'follow_request';
        })
    };

    const handleAction = (n) => {
        if (n.targetId) {
            navigate(`/profile/${n.actorId}`);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#000',
                    color: 'white',
                    borderRadius: 3,
                    height: '80vh',
                    maxHeight: '700px',
                    backgroundImage: 'none',
                    boxShadow: '0 0 10px rgba(255,255,255,0.1)'
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">Thông báo</Typography>
                    <IconButton onClick={onClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>

                {/* Filters */}
                <Box sx={{ mb: 2, overflowX: 'auto', pb: 1 }}>
                    <Stack direction="row" spacing={1}>
                        {filters.map((f) => (
                            <Chip
                                key={f}
                                label={f}
                                onClick={() => setFilter(f)}
                                sx={{
                                    bgcolor: filter === f ? '#262626' : 'transparent',
                                    color: 'white',
                                    border: '1px solid #363636',
                                    '&:hover': { bgcolor: '#363636' },
                                    fontWeight: filter === f ? 'bold' : 'normal'
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* List */}
                <Box sx={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress color="inherit" />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Typography sx={{ textAlign: 'center', color: '#8e8e8e', mt: 4 }}>
                            Chưa có thông báo nào.
                        </Typography>
                    ) : (
                        Object.entries(groupedNotifications).map(([group, items]) => (
                            items.length > 0 && (
                                <Box key={group} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>{group}</Typography>
                                    <List disablePadding>
                                        {items.map((n) => (
                                            <ListItem
                                                key={n.id}
                                                sx={{
                                                    px: 0,
                                                    py: 1.5,
                                                    '&:hover': { bgcolor: '#121212' },
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => handleAction(n)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        src={n.actor?.avatarUrl}
                                                        sx={{
                                                            width: 44,
                                                            height: 44,
                                                            border: n.type === 'follow' ? '2px solid' : 'none',
                                                            borderColor: n.type === 'follow' ? '#d300c5' : 'transparent'
                                                        }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" sx={{ fontSize: '13.5px' }}>
                                                            <span style={{ fontWeight: 'bold' }}>{n.actor?.username}</span>{' '}
                                                            {n.type === 'like' && 'đã thích bài viết của bạn.'}
                                                            {n.type === 'comment' && 'đã bình luận về bài viết của bạn.'}
                                                            {n.type === 'follow' && 'đã bắt đầu theo dõi bạn.'}
                                                            {n.type === 'follow_request' && 'Yêu cầu theo dõi'}
                                                            <span style={{ color: '#8e8e8e', marginLeft: '5px' }}>{formatTime(n.createdAt)}</span>
                                                        </Typography>
                                                    }
                                                />
                                                {/* Action Buttons based on type */}
                                                <Box sx={{ ml: 1 }}>
                                                    {n.type === 'follow' && (
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            sx={{
                                                                textTransform: 'none',
                                                                bgcolor: '#363636',
                                                                color: 'white',
                                                                borderRadius: 2,
                                                                fontWeight: 'bold',
                                                                '&:hover': { bgcolor: '#262626' }
                                                            }}
                                                        >
                                                            Đang theo dõi
                                                        </Button>
                                                    )}
                                                    {n.type === 'follow_request' && (
                                                        <Stack direction="row" spacing={1}>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                sx={{ textTransform: 'none', bgcolor: '#0095f6', borderRadius: 1 }}
                                                            >
                                                                Xác nhận
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                sx={{ textTransform: 'none', bgcolor: '#262626', borderRadius: 1 }}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </Stack>
                                                    )}
                                                    {n.type === 'like' && n.targetId && (
                                                        <Box 
                                                            component="img"
                                                            src={n.postMediaUrl || 'https://via.placeholder.com/40'}
                                                            sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                                                        />
                                                    )}
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                    <Divider sx={{ borderColor: '#262626', mt: 1 }} />
                                </Box>
                            )
                        ))
                    )}
                </Box>
            </Box>
        </Dialog>
    );
};

export default NotificationModal;
