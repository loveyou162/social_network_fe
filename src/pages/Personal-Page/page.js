import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Avatar, Stack, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import userApi from '../../api/userApi';
import EditProfileModal from '../../component/EditProfileModal';

const PersonalPage = () => {
    const { id } = useParams();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    const targetUserId = id || currentUser?.id;
    const isOwnProfile = !id || Number(id) === currentUser?.id;

    useEffect(() => {
        if (targetUserId) {
            fetchProfile();
        }
    }, [targetUserId]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await userApi.getUserProfile(targetUserId);
            const data = response.data || response;
            setProfile(data);
            
            // Kiểm tra xem đã follow chưa (giả sử backend trả về field này hoặc check trong followers)
            if (currentUser && data.followers) {
                const following = data.followers.some(f => f.followerId === currentUser.id);
                setIsFollowing(following);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin cá nhân:', error);
            setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        try {
            const response = await userApi.followUser(profile.id);
            setIsFollowing(response.data.following);
            // Refresh counts
            fetchProfile();
        } catch (error) {
            console.error('Lỗi khi follow:', error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!profile) {
        return <Typography color="white">Không tìm thấy thông tin người dùng.</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', p: { xs: '10px', md: '20px' }, color: 'white' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: '20px', md: '40px' }, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    py: { xs: 2, md: 4 } 
                }}>
                    <Avatar
                        src={profile.avatarUrl || 'https://via.placeholder.com/150'}
                        sx={{ width: { xs: 80, md: 150 }, height: { xs: 80, md: 150 }, border: '1px solid #363636' }}
                    />
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '15px',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        textAlign: { xs: 'center', md: 'left' }
                    }}>
                        <Typography sx={{ fontSize: { xs: '20px', md: '24px' }, fontWeight: 'bold' }}>
                            {profile.username}
                        </Typography>
                        <Stack direction="row" spacing={{ xs: 2, md: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography fontWeight="bold">{profile.blogs?.length || 0}</Typography>
                                <Typography variant="caption">bài viết</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography fontWeight="bold">{profile.followersCount || 0}</Typography>
                                <Typography variant="caption">người theo dõi</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography fontWeight="bold">{profile.followingCount || 0}</Typography>
                                <Typography variant="caption">đang theo dõi</Typography>
                            </Box>
                        </Stack>
                        <Box>
                            <Typography sx={{ fontSize: '16px', fontWeight: 'bold' }}>
                                {profile.fullName || profile.username}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                {profile.bio || 'Chưa có tiểu sử.'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ width: '100%', padding: '10px', justifyContent: 'center' }}
                >
                    {isOwnProfile ? (
                        <>
                            <Button
                                variant="contained"
                                onClick={() => setIsEditModalOpen(true)}
                                sx={{
                                    padding: '6px 24px',
                                    bgcolor: '#363636',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': { bgcolor: '#262626' }
                                }}
                            >
                                Chỉnh sửa trang cá nhân
                            </Button>
                            <Button
                                variant="contained"
                                sx={{
                                    padding: '6px 24px',
                                    bgcolor: '#363636',
                                    color: 'white',
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    width: { xs: '100%', sm: 'auto' },
                                    '&:hover': { bgcolor: '#262626' }
                                }}
                            >
                                Xem kho lưu trữ
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleFollowToggle}
                            sx={{
                                padding: '6px 24px',
                                bgcolor: isFollowing ? '#363636' : '#0095f6',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                width: { xs: '100%', sm: 'auto' },
                                '&:hover': { bgcolor: isFollowing ? '#262626' : '#1877f2' }
                            }}
                        >
                            {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
                        </Button>
                    )}
                </Stack>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: { xs: '1px', md: '4px' },
                    maxWidth: '935px',
                    margin: '0 auto',
                    width: '100%',
                    borderTop: '1px solid #262626',
                    pt: { xs: 2, md: 4 }
                }}
            >
                {profile.blogs?.map((post) => (
                    <Box
                        key={post.id}
                        sx={{
                            width: '100%',
                            aspectRatio: '1/1',
                            overflow: 'hidden',
                            position: 'relative',
                            cursor: 'pointer'
                        }}
                    >
                        <img
                            src={post.mediaUrl}
                            alt={post.caption}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                ))}
            </Box>

            <EditProfileModal 
                open={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                user={profile} 
                onUpdate={fetchProfile}
            />
        </Box>
    );
};

export default PersonalPage;