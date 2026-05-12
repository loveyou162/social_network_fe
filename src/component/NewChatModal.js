import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Typography,
    Box,
    CircularProgress,
    Divider
} from '@mui/material';
import { Close, Search } from '@mui/icons-material';
import userApi from '../api/userApi';

const NewChatModal = ({ open, onClose, onSelectUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setUsers([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await userApi.searchUsers(searchTerm);
                setUsers(res.data || res);
            } catch (error) {
                console.error('Lỗi khi tìm kiếm user:', error);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSelect = (user) => {
        onSelectUser(user);
        setSearchTerm('');
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="xs" 
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 3, 
                    bgcolor: '#262626', 
                    color: 'white',
                    minHeight: '400px'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid #363636'
            }}>
                <Typography variant="h6" fontWeight="bold">Tin nhắn mới</Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Box sx={{ p: 2, borderBottom: '1px solid #363636' }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm..."
                    variant="standard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: <Typography sx={{ mr: 2, fontWeight: 'bold' }}>Tới:</Typography>,
                        sx: { color: 'white', fontSize: 14 }
                    }}
                />
            </Box>

            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : users.length > 0 ? (
                    <List>
                        {users.map((user) => (
                            <ListItem 
                                key={user.id} 
                                button 
                                onClick={() => handleSelect(user)}
                                sx={{ '&:hover': { bgcolor: '#1a1a1a' } }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={user.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={user.username} 
                                    secondary={user.fullName}
                                    primaryTypographyProps={{ fontWeight: 'bold', color: 'white' }}
                                    secondaryTypographyProps={{ color: '#8e8e8e', fontSize: 12 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : searchTerm.trim() ? (
                    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
                        <Typography variant="body2">Không tìm thấy người dùng nào</Typography>
                    </Box>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.6 }}>
                        <Typography variant="body2">Tìm kiếm bạn bè để bắt đầu trò chuyện</Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NewChatModal;
