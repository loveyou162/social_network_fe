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
} from '@mui/material';
import {
    Home,
    Search,
    Explore,
    Movie,
    Message,
    FavoriteBorder,
    AddBox,
    SmartToy,
    Forum,
    MoreHoriz,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function SidebarInstagram() {
    const navigate = useNavigate();

    const mainMenu = [
        { text: 'Trang chủ', icon: <Home />, path: '/' },
        { text: 'Tìm kiếm', icon: <Search />, path: null },
        { text: 'Khám phá', icon: <Explore />, path: null },
        { text: 'Reels', icon: <Movie />, path: null },
        { text: 'Tin nhắn', icon: <Message />, path: '/messages' },
        { text: 'Thông báo', icon: <FavoriteBorder />, path: null },
        { text: 'Tạo', icon: <AddBox />, path: null },
        {
            text: 'Trang cá nhân',
            icon: (
                <Avatar
                    src="https://via.placeholder.com/40"
                    sx={{ width: 24, height: 24 }}
                />
            ),
            path: "/personal",
        },
    ];

    const handleMenuClick = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const bottomMenu = [
        { text: 'Meta AI', icon: <SmartToy /> },
        {
            text: 'Threads',
            icon: (
                <Badge badgeContent={4} color="error">
                    <Forum />
                </Badge>
            ),
        },
        { text: 'Xem thêm', icon: <MoreHoriz /> },
    ];

    return (
        <Box
            sx={{
                // width: 240,
                height: '100vh',
                bgcolor: 'black',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRight: '1px solid #262626',
                // backgroundColor: 'green',
                position: 'sticky',
                top: 0,
                minWidth: '150px',
                maxWidth: '300px',
                // left: 0,
                p: 2,
            }}
        >
            {/* Logo + Menu */}
            <Box>

                <Box sx={{ fontSize: 28, fontWeight: '900', mb: 3, ml: 1, fontFamily: 'cursive' }}>
                    Zuno
                </Box>

                <List>
                    {mainMenu.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                sx={{ borderRadius: 2 }}
                                onClick={() => handleMenuClick(item.path)}
                            >
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Menu cuối */}
            <Box>
                <Divider sx={{ bgcolor: 'grey.800', my: 1 }} />
                <List>
                    {bottomMenu.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton sx={{ borderRadius: 2 }}>
                                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}
