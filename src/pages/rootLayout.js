import { Outlet, useLocation, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";
import InstagramNavbar from "../component/navbar";
import classes from './rootLayout.module.css'
import { Box, LinearProgress } from "@mui/material";

function RootLayout() {
    const location = useLocation();
    const navigation = useNavigation();
    const [isNavigating, setIsNavigating] = useState(false);

    // Kích hoạt thanh loading mỗi khi route (pathname) thay đổi
    useEffect(() => {
        setIsNavigating(true);
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 500); // Giả lập thời gian tải trang mượt mà khoảng 0.5s
        
        return () => clearTimeout(timer);
    }, [location.pathname]);

    // Hiển thị nếu React Router đang load data thật HOẶC đang trong tgian giả lập chuyển trang
    const isLoading = navigation.state === "loading" || isNavigating;

    return (
        <div className={classes.container}>
            {isLoading && (
                <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
                    <LinearProgress 
                        sx={{
                            height: '3px',
                            backgroundColor: 'transparent',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)'
                            }
                        }}
                    />
                </Box>
            )}
            <InstagramNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;