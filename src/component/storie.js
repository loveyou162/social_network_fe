// components/StorySlider.tsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // Import module Navigation để có nút điều hướng
import 'swiper/css'; // Import CSS cơ bản
import 'swiper/css/navigation'; // Import CSS cho navigation
import classes from './storie.module.css';

const stories = [
    {
        id: 1,
        username: '_thnhhuyen',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/07/14/18/waterfall-9453143_640.jpg',
    },
    {
        id: 2,
        username: 'ggotbban...',
        avatar: 'https://cdn.pixabay.com/photo/2024/11/30/15/55/eiffel-tower-9235220_1280.jpg',
    },
    {
        id: 3,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2022/02/13/17/22/cartoon-easter-bunny-7011655_640.jpg',
    },
    {
        id: 4,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2022/02/13/17/22/cartoon-easter-bunny-7011655_640.jpg',
    },
    {
        id: 5,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2022/02/13/17/22/cartoon-easter-bunny-7011655_640.jpg',
    },
    {
        id: 6,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2022/02/13/17/22/cartoon-easter-bunny-7011655_640.jpg',
    },
    {
        id: 7,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2022/02/13/17/22/cartoon-easter-bunny-7011655_640.jpg',
    },
    {
        id: 8,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2023/02/04/07/38/cherry-blossoms-7766587_640.jpg',
    },
    {
        id: 9,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2022/02/13/17/22/cartoon-easter-bunny-7011655_640.jpg',
    },
    {
        id: 10,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    {
        id: 11,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    {
        id: 12,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    {
        id: 13,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    {
        id: 14,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    {
        id: 15,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    {
        id: 16,
        username: 'peary_pinn',
        avatar: 'https://cdn.pixabay.com/photo/2025/03/19/16/52/hands-9481149_640.jpg',
    },
    // thêm nhiều người nữa
];

export default function StorySlider() {
    return (
        <div className={classes['Storie']}>
            <Swiper
                modules={[Navigation]} // Kích hoạt module Navigation
                spaceBetween={5} // Khoảng cách giữa các slide
                slidesPerView={6} // Hiển thị 5 slide cùng lúc
                slidesPerGroup={4} // Cuộn 2 slide mỗi lần
                navigation // Bật nút điều hướng
                // loop={true}
                observer={true}
            // breakpoints={{
            //     768: {
            //         slidesPerView: 4,
            //         slidesPerGroup: 1,
            //     },
            //     480: {
            //         slidesPerView: 3,
            //         slidesPerGroup: 1,
            //     },
            // }}
            >
                {stories.map((story) => (
                    <SwiperSlide key={story.id}>
                        <div className={classes['group-item']}>
                            <div className={classes['story-avatar']}>
                                <img
                                    src={story.avatar}
                                    alt={story.username}
                                    className="rounded-full border-2 border-pink-500 p-[2px] w-16 h-16 object-cover"
                                />
                            </div>
                            <p className={classes['username']}>{story.username}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}