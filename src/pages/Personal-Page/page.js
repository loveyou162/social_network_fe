import React from 'react';
import { Box, Typography, Button, Avatar, Stack } from '@mui/material';

const PersonalPage = () => {
    const LinkImg = 'https://images.unsplash.com/photo-1774387981914-c5a133e7380b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzOXx8fGVufDB8fHx8fA%3D%3D';

    const posts = Array(6).fill(LinkImg);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <Avatar
                        src={LinkImg}
                        sx={{ width: 150, height: 150 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
                            thangpham.pham
                        </Typography>
                        <Stack direction="row" spacing={2.5}>
                            <Typography>10 posts</Typography>
                            <Typography>100 followers</Typography>
                            <Typography>100 following</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '16px' }}>
                            bio
                        </Typography>
                    </Box>
                </Box>
                <Stack
                    direction="row"
                    spacing={2.5}
                    sx={{ width: '100%', padding: '20px', justifyContent: 'center' }}
                >
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            padding: '8px 60px',
                            bgcolor: 'rgba(104, 104, 104, 0.301)',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '5px',
                            fontWeight: 'normal',
                            fontSize: '1rem',
                            '&:hover': { bgcolor: 'rgba(104, 104, 104, 0.5)' }
                        }}
                    >
                        Chỉnh sửa trang cá nhân
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            padding: '8px 60px',
                            bgcolor: 'rgba(104, 104, 104, 0.301)',
                            color: 'white',
                            textTransform: 'none',
                            borderRadius: '5px',
                            fontWeight: 'normal',
                            fontSize: '1rem',
                            '&:hover': { bgcolor: 'rgba(104, 104, 104, 0.5)' }
                        }}
                    >
                        Xem kho lưu trữ
                    </Button>
                </Stack>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '15px',
                    padding: '10px 20px'
                }}
            >
                {posts.map((imgSrc, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: '100%',
                            aspectRatio: '4/5',
                            overflow: 'hidden',
                            borderRadius: '8px'
                        }}
                    >
                        <img
                            src={imgSrc}
                            alt={`Post ${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PersonalPage;