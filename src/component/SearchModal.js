import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    Box,
    TextField,
    InputAdornment,
    Avatar,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    IconButton,
    Button,
} from '@mui/material';
import { Search, Close, PersonAdd, PersonRemove } from '@mui/icons-material';
import userApi from '../api/userApi';
import { useSelector } from 'react-redux';

const SearchModal = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [followingMap, setFollowingMap] = useState({});

    useEffect(() => {
        if (!open) {
            setQuery('');
            setResults([]);
        }
    }, [open]);

    useEffect(() => {
        const debounce = setTimeout(async () => {
            if (query.trim().length < 1) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await userApi.searchUsers(query.trim());
                const data = res.data || res;
                setResults(Array.isArray(data) ? data : []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleFollow = async (userId) => {
        try {
            const res = await userApi.followUser(userId);
            const data = res.data || res;
            setFollowingMap((prev) => ({ ...prev, [userId]: data.following }));
        } catch (err) {
            console.error('Follow error:', err);
        }
    };

    const handleGoToProfile = (userId) => {
        navigate(`/profile/${userId}`);
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
                    bgcolor: '#1c1c1c',
                    color: 'white',
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', p: '12px 16px', borderBottom: '1px solid #363636' }}>
                <Typography variant="h6" fontWeight="bold" flex={1}>
                    Tìm kiếm
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            </Box>

            {/* Search Input */}
            <Box sx={{ p: '12px 16px' }}>
                <TextField
                    autoFocus
                    fullWidth
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tìm kiếm người dùng..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: '#8e8e8e' }} />
                            </InputAdornment>
                        ),
                        endAdornment: query && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setQuery('')} sx={{ color: '#8e8e8e' }}>
                                    <Close fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        ),
                        sx: {
                            bgcolor: '#2a2a2a',
                            borderRadius: 2,
                            color: 'white',
                            '& fieldset': { border: 'none' },
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInputBase-input::placeholder': { color: '#8e8e8e' },
                        },
                    }}
                />
            </Box>

            {/* Results */}
            <Box sx={{ minHeight: 200, maxHeight: 400, overflowY: 'auto' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress color="inherit" size={28} />
                    </Box>
                ) : results.length === 0 && query.length > 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography color="grey.500">Không tìm thấy kết quả nào</Typography>
                    </Box>
                ) : results.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Search sx={{ fontSize: 48, color: '#363636', mb: 1 }} />
                        <Typography color="grey.600" variant="body2">Nhập tên để tìm kiếm</Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {results.map((user) => {
                            const isOwn = user.id === currentUser?.id;
                            const isFollowing = followingMap[user.id] ?? false;
                            return (
                                <ListItem
                                    key={user.id}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        '&:hover': { bgcolor: '#2a2a2a' },
                                        cursor: 'pointer',
                                    }}
                                    secondaryAction={
                                        !isOwn && (
                                            <Button
                                                size="small"
                                                variant={isFollowing ? 'outlined' : 'contained'}
                                                onClick={(e) => { e.stopPropagation(); handleFollow(user.id); }}
                                                startIcon={isFollowing ? <PersonRemove fontSize="small" /> : <PersonAdd fontSize="small" />}
                                                sx={{
                                                    textTransform: 'none',
                                                    borderRadius: 2,
                                                    fontSize: 12,
                                                    borderColor: isFollowing ? '#363636' : undefined,
                                                    color: isFollowing ? 'white' : undefined,
                                                    bgcolor: isFollowing ? 'transparent' : '#0095f6',
                                                    '&:hover': {
                                                        bgcolor: isFollowing ? '#2a2a2a' : '#1877f2',
                                                    },
                                                }}
                                            >
                                                {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                                            </Button>
                                        )
                                    }
                                    onClick={() => handleGoToProfile(user.id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={user.avatarUrl}
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                border: '2px solid',
                                                borderColor: 'transparent',
                                                backgroundImage: 'linear-gradient(black, black), linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                                backgroundOrigin: 'border-box',
                                                backgroundClip: 'padding-box, border-box',
                                            }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body2" fontWeight="bold" color="white">
                                                {user.username}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="grey.500">
                                                {user.fullName || `${user.followersCount || 0} người theo dõi`}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Dialog>
    );
};

export default SearchModal;
