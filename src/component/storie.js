import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import classes from './storie.module.css';
import storyApi from '../api/storyApi';
import CreateStoryModal from './CreateStoryModal';
import StoryViewer from './StoryViewer';
import { useSelector } from 'react-redux';
import { Add } from '@mui/icons-material';

export default function StorySlider() {
    const [groupedStories, setGroupedStories] = useState({});
    const [storyUsers, setStoryUsers] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [activeUserStories, setActiveUserStories] = useState([]);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await storyApi.getStoryFeed();
            const rawStories = response.data || response;
            
            // Nhóm story theo userId
            const groups = rawStories.reduce((acc, story) => {
                const userId = story.user?.id;
                if (!acc[userId]) {
                    acc[userId] = {
                        user: story.user,
                        stories: []
                    };
                }
                acc[userId].stories.push(story);
                return acc;
            }, {});

            setGroupedStories(groups);
            setStoryUsers(Object.values(groups));
        } catch (error) {
            console.error('Lỗi khi lấy stories:', error);
        }
    };

    const handleUserClick = (userGroup) => {
        setActiveUserStories(userGroup.stories);
        setIsViewerOpen(true);
    };

    return (
        <div className={classes['Storie']}>
            <Swiper
                modules={[Navigation]}
                spaceBetween={5}
                slidesPerView={6}
                slidesPerGroup={4}
                navigation
                observer={true}
            >
                {/* Nút tạo story */}
                <SwiperSlide>
                    <div className={classes['group-item']} onClick={() => setIsCreateModalOpen(true)} style={{ cursor: 'pointer' }}>
                        <div className={classes['story-avatar']} style={{ position: 'relative' }}>
                            <img
                                src={user?.avatarUrl || "https://via.placeholder.com/150"}
                                alt=""
                                style={{ backgroundColor: '#262626' }}
                                className="rounded-full border-2 border-gray-300 p-[2px] w-16 h-16 object-cover"
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                background: '#0095f6',
                                borderRadius: '50%',
                                border: '2px solid black',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 22,
                                height: 22
                            }}>
                                <Add sx={{ color: 'white', fontSize: 18 }} />
                            </div>
                        </div>
                        <p className={classes['username']}>Tin của bạn</p>
                    </div>
                </SwiperSlide>

                {storyUsers.map((userGroup) => (
                    <SwiperSlide key={userGroup.user?.id}>
                        <div className={classes['group-item']} onClick={() => handleUserClick(userGroup)} style={{ cursor: 'pointer' }}>
                            <div className={classes['story-avatar']} style={{
                                padding: '2px',
                                borderRadius: '50%',
                                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
                            }}>
                                <img
                                    src={userGroup.user?.avatarUrl || 'https://via.placeholder.com/150'}
                                    alt={userGroup.user?.username || 'user'}
                                    style={{ border: '2px solid black' }}
                                    className="rounded-full w-16 h-16 object-cover"
                                />
                            </div>
                            <p className={classes['username']}>{userGroup.user?.username || 'user'}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Modal tạo story */}
            <CreateStoryModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onStoryCreated={fetchStories}
            />

            {/* Viewer xem story */}
            <StoryViewer
                open={isViewerOpen}
                stories={activeUserStories}
                initialIndex={0}
                onClose={() => setIsViewerOpen(false)}
            />
        </div>
    );
}