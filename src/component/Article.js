import React, { useState } from 'react';
import classes from './Article.module.scss';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Swiper, SwiperSlide } from 'swiper/react';  // Import Swiper và SwiperSlide từ swiper/react
import 'swiper/css';  // Import CSS của Swiper
import 'swiper/css/pagination';  // Import CSS của Pagination
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Dialog from '@mui/material/Dialog';
// import Button from '@mui/material/Button';
const Article = () => {
    const [liked, setLiked] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => { setOpen(!open); };
    const handleLike = () => {
        setLiked(!liked); // Chỉ set true khi chưa like
        setAnimating(true);

        setTimeout(() => {
            setAnimating(false); // Reset animation
        }, 600);
    };
    console.log(liked, animating);

    return (
        <div className={classes["article"]}>
            <div className={classes["article_header"]}>
                <div className={classes["article_header-left"]}>
                    <span className={classes["article_header_avartar"]}>
                        <img src='https://images.unsplash.com/photo-1744429523595-2c06b8611242?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8' />
                    </span>
                    <h5 className={classes["article_header_username"]}>peary_pinn</h5>
                    <span className={classes["dot"]}>&middot;</span>
                    <p className={classes["article_header_time"]}>1 giờ trước</p>
                </div>
                <div className={classes["article_header-right"]}>
                    <span className={classes["article_header_avartar"]}>
                        <MenuOutlinedIcon />
                    </span>
                </div>
            </div>
            <div className={classes["article-slider"]}>
                <Swiper
                    spaceBetween={40} //
                    slidesPerView={1}
                    pagination={{ clickable: true, type: "bullets", }}  // Bật Pagination
                >
                    <SwiperSlide className={classes["article-slider-item"]}>
                        <img
                            src="https://images.unsplash.com/photo-1745337014221-bbbd3bf4581a?w=500&auto=format&fit=crop&q=60"
                            alt="Ảnh 1"
                        />
                    </SwiperSlide>
                    <SwiperSlide className={classes["article-slider-item"]}>
                        <img
                            src="https://images.unsplash.com/photo-1745407863651-e7c49ef1c8df?w=500&auto=format&fit=crop&q=60"
                            alt="Ảnh 2"
                        />
                    </SwiperSlide>
                    <SwiperSlide className={classes["article-slider-item"]}>
                        <img
                            src="https://images.unsplash.com/photo-1745407863651-e7c49ef1c8df?w=500&auto=format&fit=crop&q=60"
                            alt="Ảnh 3"
                        />
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className={classes["article_group-like"]}>
                <div className={classes["article_group-like-left"]}>
                    <span onClick={handleLike}>
                        {liked ? (
                            <FavoriteIcon
                                className={`${classes["article_group-like-icon"]} ${animating ? classes["liked"] : classes["liked"]}`}
                            />
                        ) : (
                            <FavoriteBorderOutlinedIcon className={classes["article_group-like-icon"]} />
                        )}
                    </span>

                    <span onClick={handleClickOpen}>
                        <ChatBubbleOutlineOutlinedIcon className={classes["article_group-like-icon"]} />
                    </span>
                    <span>
                        <SendOutlinedIcon className={classes["article_group-like-icon"]} />
                    </span>
                </div>
                <div className={classes["article_group-like-right"]}>
                    <span className={classes["article_group-like_avartar"]}>
                        <BookmarkBorderOutlinedIcon className={classes["article_group-like-icon"]} />
                    </span>
                </div>
            </div>
            <Dialog open={open} onClose={handleClickOpen} maxWidth="md" fullWidth>
                <div className={classes["article_popup"]}>
                    <div className={classes["article_popup-left"]}>
                        <Swiper
                            spaceBetween={40}
                            slidesPerView={1}
                            pagination={{ clickable: true, type: "bullets" }}
                        >
                            <SwiperSlide className={classes["article-slider-item"]}>
                                <img
                                    src="https://images.unsplash.com/photo-1745337014221-bbbd3bf4581a?w=500&auto=format&fit=crop&q=60"
                                    alt="Ảnh 1"
                                />
                            </SwiperSlide>
                            <SwiperSlide className={classes["article-slider-item"]}>
                                <img
                                    src="https://images.unsplash.com/photo-1745407863651-e7c49ef1c8df?w=500&auto=format&fit=crop&q=60"
                                    alt="Ảnh 2"
                                />
                            </SwiperSlide>
                            <SwiperSlide className={classes["article-slider-item"]}>
                                <img
                                    src="https://images.unsplash.com/photo-1745407863651-e7c49ef1c8df?w=500&auto=format&fit=crop&q=60"
                                    alt="Ảnh 3"
                                />
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    <div className={classes["article_popup-right"]}>
                        {/* Comment section */}
                        <div className={classes["article_popup-comments"]}>
                            <p><b>user1</b> Comment mẫu nè</p>
                            <p><b>user2</b> Comment mẫu nữa nè</p>
                        </div>
                        <div className={classes["article_popup-actions"]}>
                            {/* Nút like, gửi tin nhắn... */}
                            <button>Like</button>
                            <button>Send</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div >
    );
};

export default Article;
