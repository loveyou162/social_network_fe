import {
    Box,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Badge,
    useMediaQuery,
    useTheme,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Home,
    Search,
    Explore,
    Movie,
    Message,
    FavoriteBorder,
    AddBox,
    Logout,
    MoreHoriz,
} from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import appConfig from '../config/appConfig';
import CreatePostModal from './CreatePostModal';
import SearchModal from './SearchModal';
import NotificationModal from './NotificationModal';

export default function SidebarInstagram() {
    const theme = useTheme();
    const isTablet = useMediaQuery('(max-width: 1200px)');
    const isMobile = useMediaQuery('(max-width: 900px)');

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const allMenuItems = [
        { id: 'home',     text: 'Trang chủ',  icon: <Home />,          path: '/' },
        { id: 'search',   text: 'Tìm kiếm',   icon: <Search />,         path: null, onClick: () => setIsSearchOpen(true) },
        { id: 'explore',  text: 'Khám phá',   icon: <Explore />,        path: null },
        { id: 'reels',    text: 'Reels',       icon: <Movie />,          path: null },
        { id: 'messages', text: 'Tin nhắn',   icon: <Message />,        path: '/messages' },
        {
            id: 'notify',
            text: 'Thông báo',
            icon: <FavoriteBorder />,
            path: null,
            onClick: () => setIsNotificationOpen(true)
        },
        { id: 'create',   text: 'Tạo',         icon: <AddBox />,         path: null, onClick: () => setIsCreateModalOpen(true) },
        {
            id: 'profile',
            text: user?.username || 'Trang cá nhân',
            icon: <Avatar src={user?.avatarUrl} sx={{ width: 24, height: 24 }} />,
            path: '/personal',
        },
    ];

    // Mobile hiện các item chính (thêm messages để người dùng dễ truy cập)
    const mobileItems = allMenuItems.filter(i => ['home', 'search', 'messages', 'create', 'profile'].includes(i.id));

    const handleMenuClick = (item) => {
        if (item.onClick) {
            item.onClick();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    const isActive = (item) => item.path && location.pathname === item.path;

    const handleLogout = () => {
        const { url, realm, clientId } = appConfig.keycloak;
        dispatch(logout());
        const logoutUrl = `${url}/realms/${realm}/protocol/openid-connect/logout`
            + `?client_id=${clientId}`
            + `&post_logout_redirect_uri=${encodeURIComponent('http://localhost:3000/login')}`;
        window.location.href = logoutUrl;
    };

    const Modals = () => (
        <>
            <CreatePostModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onPostCreated={() => window.location.reload()}
            />
            <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <NotificationModal open={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        </>
    );

    /* ===== MOBILE: Bottom Navigation ===== */
    if (isMobile) {
        return (
            <>
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 56,
                        bgcolor: '#000',
                        borderTop: '1px solid #262626',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        zIndex: 1200,
                    }}
                >
                    {mobileItems.map((item) => (
                        <IconButton
                            key={item.id}
                            onClick={() => handleMenuClick(item)}
                            sx={{
                                color: isActive(item) ? 'white' : '#737373',
                                p: 1.5,
                                '&:hover': { color: 'white' },
                            }}
                        >
                            {item.icon}
                        </IconButton>
                    ))}
                </Box>
                <Modals />
            </>
        );
    }

    /* ===== TABLET: Icon-only Sidebar ===== */
    if (isTablet) {
        return (
            <>
                <Box
                    sx={{
                        width: 72,
                        height: '100vh',
                        bgcolor: '#000',
                        borderRight: '1px solid #262626',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                        position: 'sticky',
                        top: 0,
                    }}
                >
                    {/* Logo */}
                    <Box>
                        <Box
                            sx={{
                                fontSize: 22,
                                fontWeight: 900,
                                color: 'white',
                                mb: 3,
                                fontFamily: 'cursive',
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => navigate('/')}
                        >
                            Z
                        </Box>
                        {allMenuItems.map((item) => (
                            <Tooltip key={item.id} title={item.text} placement="right">
                                <IconButton
                                    onClick={() => handleMenuClick(item)}
                                    sx={{
                                        color: isActive(item) ? 'white' : '#737373',
                                        display: 'flex',
                                        mb: 0.5,
                                        p: 1.5,
                                        borderRadius: 2,
                                        bgcolor: isActive(item) ? '#1a1a1a' : 'transparent',
                                        '&:hover': { color: 'white', bgcolor: '#1a1a1a' },
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Box>

                    {/* Logout */}
                    <Tooltip title="Đăng xuất" placement="right">
                        <IconButton
                            onClick={handleLogout}
                            sx={{ color: '#737373', '&:hover': { color: 'white' } }}
                        >
                            <Logout />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Modals />
            </>
        );
    }

    /* ===== DESKTOP: Full Sidebar ===== */
    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    bgcolor: '#000',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderRight: '1px solid #262626',
                    position: 'sticky',
                    top: 0,
                    p: 2,
                    overflowY: 'auto',
                }}
            >
                <Box>
                    {/* Logo */}
                    <Box
                        sx={{ fontSize: 28, fontWeight: 900, mb: 3, ml: 1, fontFamily: 'cursive', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    >
                        Zuno
                    </Box>

                    <List disablePadding>
                        {allMenuItems.map((item) => (
                            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => handleMenuClick(item)}
                                    sx={{
                                        borderRadius: 2,
                                        bgcolor: isActive(item) ? '#1a1a1a' : 'transparent',
                                        '&:hover': { bgcolor: '#1a1a1a' },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: isActive(item) ? 'white' : '#737373',
                                            minWidth: 40,
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: isActive(item) ? 700 : 400,
                                            fontSize: 15,
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box>
                    <Divider sx={{ bgcolor: '#262626', my: 1 }} />
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{ borderRadius: 2, '&:hover': { bgcolor: '#1a1a1a' } }}
                        >
                            <ListItemIcon sx={{ color: '#737373', minWidth: 40 }}>
                                <Logout />
                            </ListItemIcon>
                            <ListItemText
                                primary="Đăng xuất"
                                primaryTypographyProps={{ color: '#737373', fontSize: 15 }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            sx={{ borderRadius: 2, '&:hover': { bgcolor: '#1a1a1a' } }}
                        >
                            <ListItemIcon sx={{ color: '#737373', minWidth: 40 }}>
                                <MoreHoriz />
                            </ListItemIcon>
                            <ListItemText
                                primary="Xem thêm"
                                primaryTypographyProps={{ color: '#737373', fontSize: 15 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </Box>
            </Box>
            <Modals />
        </>
    );
}
