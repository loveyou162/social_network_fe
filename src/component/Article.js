import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './Article.module.scss';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import {
    Dialog,
    Box,
    Avatar,
    Typography,
    IconButton,
    TextField,
    Divider,
    CircularProgress,
    Menu,
    MenuItem
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import blogApi from '../api/blogApi';

const formatTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} giờ trước`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD} ngày trước`;
    return date.toLocaleDateString('vi-VN');
};

const Article = ({ post: initialPost }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [post, setPost] = useState(initialPost);
    const [liked, setLiked] = useState(initialPost?.isLiked || false);
    const [likeCount, setLikeCount] = useState(initialPost?.likesCount || 0);
    const [saved, setSaved] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [open, setOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    
    // Post options menu
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    if (!post) return null;

    const mediaUrls = post.mediaUrls?.length > 0 ? post.mediaUrls : [post.mediaUrl].filter(Boolean);
    const author = post.author || post.user;

    const handleClickOpen = async () => {
        setOpen(true);
        setLoadingComments(true);
        try {
            const res = await blogApi.getPostDetail(post.id);
            const detail = res.data || res;
            setComments(detail.comments || []);
        } catch {
            setComments([]);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleLike = async () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
        setAnimating(true);
        setTimeout(() => setAnimating(false), 600);
        try {
            await blogApi.likePost(post.id);
        } catch {
            setLiked(!newLiked);
            setLikeCount((prev) => (newLiked ? prev - 1 : prev + 1));
        }
    };

    const handleSave = () => setSaved(!saved);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await blogApi.commentPost(post.id, commentText.trim());
            const newComment = res.data || res;
            setComments((prev) => [...prev, {
                ...newComment,
                user: currentUser,
                content: commentText.trim(),
            }]);
            setCommentText('');
        } catch (err) {
            console.error('Bình luận thất bại:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này không?')) {
            try {
                await blogApi.deletePost(post.id);
                // Vì không có state quản lý danh sách post ở đây, ta có thể reload trang
                // hoặc tốt hơn là truyền một callback onUpdate từ Home xuống
                window.location.reload(); 
            } catch (error) {
                console.error('Xóa bài viết thất bại:', error);
                alert('Không thể xóa bài viết. Vui lòng thử lại sau.');
            }
        }
        handleMenuClose();
    };

    return (
        <div className={classes['article']}>
            {/* Header */}
            <div className={classes['article_header']}>
                <div className={classes['article_header-left']}>
                    <span
                        className={classes['article_header_avartar']}
                        onClick={() => navigate(`/profile/${author?.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={author?.avatarUrl || 'https://via.placeholder.com/40'} alt="avatar" />
                    </span>
                    <h5
                        className={classes['article_header_username']}
                        onClick={() => navigate(`/profile/${author?.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        {author?.username || 'user'}
                    </h5>
                    <span className={classes['dot']}>&middot;</span>
                    <p className={classes['article_header_time']}>{formatTime(post.createdAt)}</p>
                </div>
                <div className={classes['article_header-right']}>
                    <IconButton onClick={handleMenuClick} sx={{ color: 'white' }}>
                        <MoreHorizIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: { bgcolor: '#262626', color: 'white' }
                        }}
                    >
                        {author?.id === currentUser?.id ? (
                            [
                                <MenuItem key="edit" onClick={handleMenuClose} sx={{ color: 'white' }}>Chỉnh sửa</MenuItem>,
                                <MenuItem key="delete" onClick={handleDelete} sx={{ color: '#ed4956', fontWeight: 'bold' }}>Xóa</MenuItem>
                            ]
                        ) : (
                            <MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>Báo cáo</MenuItem>
                        )}
                        <MenuItem onClick={handleMenuClose} sx={{ color: 'white' }}>Hủy</MenuItem>
                    </Menu>
                </div>
            </div>

            {/* Media Slider */}
            <div className={classes['article-slider']}>
                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    navigation={mediaUrls.length > 1}
                    observer={true}
                    observeParents={true}
                    resizeObserver={true}
                    autoHeight={true}
                    style={{ '--swiper-navigation-color': 'white', '--swiper-pagination-color': 'white', width: '100%' }}
                >
                    {mediaUrls.map((url, i) => (
                        <SwiperSlide key={i} className={classes['article-slider-item']}>
                            {url?.includes('.mp4') || url?.includes('video') ? (
                                <video src={url} controls style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />
                            ) : (
                                <img src={url} alt={`post-${i}`} />
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Action Bar */}
            <div className={classes['article_group-like']}>
                <div className={classes['article_group-like-left']}>
                    <span onClick={handleLike} title="Thích">
                        {liked ? (
                            <FavoriteIcon className={`${classes['article_group-like-icon']} ${animating ? classes['liked'] : classes['liked']}`} />
                        ) : (
                            <FavoriteBorderOutlinedIcon className={classes['article_group-like-icon']} />
                        )}
                    </span>
                    <span onClick={handleClickOpen} title="Bình luận">
                        <ChatBubbleOutlineOutlinedIcon className={classes['article_group-like-icon']} />
                    </span>
                    <span title="Chia sẻ">
                        <SendOutlinedIcon className={classes['article_group-like-icon']} />
                    </span>
                </div>
                <div className={classes['article_group-like-right']}>
                    <span onClick={handleSave} title="Lưu">
                        {saved ? (
                            <BookmarkIcon className={classes['article_group-like-icon']} style={{ color: 'white' }} />
                        ) : (
                            <BookmarkBorderOutlinedIcon className={classes['article_group-like-icon']} />
                        )}
                    </span>
                </div>
            </div>

            {/* Like count */}
            {likeCount > 0 && (
                <div style={{ padding: '0 12px 4px', color: 'white' }}>
                    <Typography variant="body2" fontWeight="bold">{likeCount} lượt thích</Typography>
                </div>
            )}

            {/* Caption */}
            <div style={{ padding: '0 12px 4px', color: 'white' }}>
                <Typography variant="body2">
                    <span
                        style={{ fontWeight: 'bold', marginRight: 6, cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${author?.id}`)}
                    >
                        {author?.username}
                    </span>
                    {post.caption}
                </Typography>
            </div>

            {/* View comments hint */}
            <div
                style={{ padding: '2px 12px 8px', color: '#8e8e8e', cursor: 'pointer' }}
                onClick={handleClickOpen}
            >
                <Typography variant="body2">
                    {post.commentsCount > 0 ? `Xem tất cả ${post.commentsCount} bình luận` : 'Thêm bình luận...'}
                </Typography>
            </div>

            {/* === POPUP CHI TIẾT BÀI VIẾT === */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { bgcolor: '#1c1c1c', color: 'white', borderRadius: 2, overflow: 'hidden', m: 1 } }}
            >
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '55% 45%' }, height: { md: '85vh' } }}>
                    {/* LEFT - Media */}
                    <Box sx={{ bgcolor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <Swiper
                            modules={[Pagination, Navigation]}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            navigation={mediaUrls.length > 1}
                            observer={true}
                            observeParents={true}
                            resizeObserver={true}
                            style={{ width: '100%', height: '100%', '--swiper-navigation-color': 'white', '--swiper-pagination-color': 'white' }}
                        >
                            {mediaUrls.map((url, i) => (
                                <SwiperSlide key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {url?.includes('.mp4') || url?.includes('video') ? (
                                        <video src={url} controls style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} />
                                    ) : (
                                        <img src={url} alt={`popup-${i}`} style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }} />
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>

                    {/* RIGHT - Info + Comments */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        {/* Popup Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: '10px 12px', borderBottom: '1px solid #363636' }}>
                            <Avatar
                                src={author?.avatarUrl}
                                sx={{ width: 36, height: 36, mr: 1.5, cursor: 'pointer' }}
                                onClick={() => { navigate(`/profile/${author?.id}`); setOpen(false); }}
                            />
                            <Typography
                                fontWeight="bold"
                                fontSize={14}
                                sx={{ cursor: 'pointer', flex: 1 }}
                                onClick={() => { navigate(`/profile/${author?.id}`); setOpen(false); }}
                            >
                                {author?.username}
                            </Typography>
                            <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }} size="small">
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Comments List */}
                        <Box sx={{ flex: 1, overflowY: 'auto', p: '12px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {/* Caption as first comment */}
                            {post.caption && (
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Avatar src={author?.avatarUrl} sx={{ width: 32, height: 32, flexShrink: 0 }} />
                                    <Box>
                                        <Typography variant="body2">
                                            <span style={{ fontWeight: 'bold', marginRight: 6 }}>{author?.username}</span>
                                            {post.caption}
                                        </Typography>
                                        <Typography variant="caption" color="grey.500">{formatTime(post.createdAt)}</Typography>
                                    </Box>
                                </Box>
                            )}

                            <Divider sx={{ borderColor: '#363636' }} />

                            {loadingComments ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                    <CircularProgress size={24} color="inherit" />
                                </Box>
                            ) : comments.length === 0 ? (
                                <Typography color="grey.500" textAlign="center" variant="body2" sx={{ py: 2 }}>
                                    Chưa có bình luận nào. Hãy là người đầu tiên!
                                </Typography>
                            ) : (
                                comments.map((c, i) => (
                                    <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
                                        <Avatar
                                            src={c.user?.avatarUrl}
                                            sx={{ width: 32, height: 32, flexShrink: 0, cursor: 'pointer' }}
                                            onClick={() => { navigate(`/profile/${c.user?.id}`); setOpen(false); }}
                                        />
                                        <Box>
                                            <Typography variant="body2">
                                                <span style={{ fontWeight: 'bold', marginRight: 6 }}>{c.user?.username || 'user'}</span>
                                                {c.content}
                                            </Typography>
                                            <Typography variant="caption" color="grey.500">{formatTime(c.createdAt)}</Typography>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Box>

                        {/* Action Bar in Popup */}
                        <Box sx={{ borderTop: '1px solid #363636', p: '10px 12px' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton onClick={handleLike} sx={{ color: liked ? '#ff4081' : 'white', p: 0.5 }}>
                                        {liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
                                    </IconButton>
                                    <IconButton sx={{ color: 'white', p: 0.5 }}>
                                        <ChatBubbleOutlineOutlinedIcon />
                                    </IconButton>
                                    <IconButton sx={{ color: 'white', p: 0.5 }}>
                                        <SendOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <IconButton onClick={handleSave} sx={{ color: 'white', p: 0.5 }}>
                                    {saved ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}
                                </IconButton>
                            </Box>
                            {likeCount > 0 && (
                                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    {likeCount} lượt thích
                                </Typography>
                            )}
                        </Box>

                        {/* Comment Input */}
                        <Box
                            component="form"
                            onSubmit={handleComment}
                            sx={{ borderTop: '1px solid #363636', display: 'flex', alignItems: 'center', p: '8px 12px', gap: 1 }}
                        >
                            <TextField
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Thêm bình luận..."
                                variant="standard"
                                fullWidth
                                InputProps={{
                                    disableUnderline: true,
                                    sx: { color: 'white', fontSize: 14 },
                                }}
                                sx={{ '& .MuiInputBase-input::placeholder': { color: '#8e8e8e' } }}
                            />
                            <IconButton
                                type="submit"
                                disabled={!commentText.trim() || submittingComment}
                                sx={{ color: '#0095f6', fontWeight: 'bold', p: 0.5 }}
                            >
                                {submittingComment ? <CircularProgress size={18} color="inherit" /> : (
                                    <Typography variant="body2" fontWeight="bold" color={commentText.trim() ? '#0095f6' : '#333'}>
                                        Đăng
                                    </Typography>
                                )}
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
};

export default Article;
