import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Avatar,
    Divider,
} from '@mui/material';
import { Close, CloudUpload, LocationOn, ArrowBack } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import blogApi from '../api/blogApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CreatePostModal = ({ open, onClose, onPostCreated }) => {
    const { user } = useSelector((state) => state.auth);
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
            const urls = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (files.length === 0) {
            setError('Vui lòng chọn ít nhất một ảnh hoặc video');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('caption', caption);
        formData.append('location', location);
        formData.append('mediaType', files[0].type.startsWith('video') ? 'video' : 'image');

        try {
            await blogApi.createPost(formData);
            setLoading(false);
            handleClose();
            if (onPostCreated) onPostCreated();
        } catch (err) {
            setLoading(false);
            setError('Có lỗi xảy ra khi đăng bài. Vui lòng thử lại.');
            console.error(err);
        }
    };

    const handleClose = () => {
        setFiles([]);
        setPreviewUrls([]);
        setCaption('');
        setLocation('');
        setError('');
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth={previewUrls.length > 0 ? "md" : "sm"} 
            fullWidth
            PaperProps={{
                sx: { 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    bgcolor: '#262626',
                    color: 'white'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 1.5,
                borderBottom: '1px solid #363636',
                textAlign: 'center'
            }}>
                {previewUrls.length > 0 ? (
                    <IconButton onClick={() => { setFiles([]); setPreviewUrls([]); }} sx={{ color: 'white' }}>
                        <ArrowBack />
                    </IconButton>
                ) : <Box sx={{ width: 40 }} />}
                
                <Typography variant="subtitle1" fontWeight="bold">
                    {previewUrls.length > 0 ? "Tạo bài viết mới" : "Chọn ảnh/video"}
                </Typography>

                {previewUrls.length > 0 ? (
                    <Button 
                        onClick={handleSubmit} 
                        disabled={loading}
                        sx={{ fontWeight: 'bold', color: '#0095f6' }}
                    >
                        {loading ? <CircularProgress size={20} /> : "Chia sẻ"}
                    </Button>
                ) : (
                    <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                )}
            </DialogTitle>

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: 400 }}>
                {/* Left side: Media */}
                <Box sx={{ 
                    flex: previewUrls.length > 0 ? 1.5 : 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    bgcolor: '#121212',
                    position: 'relative',
                    height: { xs: '300px', md: '500px' }, // Cố định chiều cao để Swiper hoạt động ổn định
                    overflow: 'hidden'
                }}>
                    {previewUrls.length > 0 ? (
                        <Swiper
                            modules={[Pagination, Navigation]}
                            spaceBetween={0}
                            slidesPerView={1}
                            pagination={{ clickable: true }}
                            navigation={previewUrls.length > 1}
                            observer={true}
                            observeParents={true}
                            style={{ 
                                width: '100%', 
                                height: '100%',
                                '--swiper-navigation-size': '20px',
                                '--swiper-navigation-color': 'black',
                                '--swiper-pagination-color': 'white'
                            }}
                            className="create-post-swiper"
                        >
                            <style>{`
                                .create-post-swiper .swiper-button-next,
                                .create-post-swiper .swiper-button-prev {
                                    background-color: rgba(255, 255, 255, 0.7);
                                    width: 30px;
                                    height: 30px;
                                    border-radius: 50%;
                                }
                                .create-post-swiper .swiper-button-next:after,
                                .create-post-swiper .swiper-button-prev:after {
                                    font-size: 12px;
                                    font-weight: bold;
                                }
                                .create-post-swiper .swiper-pagination-bullet {
                                    width: 6px;
                                    height: 6px;
                                    background: white;
                                }
                            `}</style>
                            {previewUrls.map((url, index) => (
                                <SwiperSlide key={url} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                    {files[index]?.type.startsWith('video') ? (
                                        <video src={url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} controls />
                                    ) : (
                                        <img src={url} alt={`Preview ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                textAlign: 'center',
                                p: 4
                            }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <CloudUpload sx={{ fontSize: 96, color: 'white', mb: 2 }} />
                            <Typography variant="h5" sx={{ mb: 3 }}>Kéo ảnh và video vào đây</Typography>
                            <Button variant="contained" sx={{ bgcolor: '#0095f6', '&:hover': { bgcolor: '#1877f2' } }}>
                                Chọn từ máy tính
                            </Button>
                        </Box>
                    )}
                    <input 
                        type="file" 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*,video/*"
                        multiple
                    />
                </Box>

                {/* Right side: Details (Only visible when media selected) */}
                {previewUrls.length > 0 && (
                    <Box sx={{ 
                        flex: 1, 
                        borderLeft: '1px solid #363636', 
                        p: 2, 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 2,
                        bgcolor: '#262626'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <Avatar src={user?.avatarUrl} sx={{ width: 28, height: 28 }} />
                            <Typography variant="subtitle2" fontWeight="bold">{user?.username}</Typography>
                        </Box>

                        <TextField
                            fullWidth
                            multiline
                            rows={8}
                            placeholder="Viết chú thích..."
                            variant="standard"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                sx: { color: 'white', fontSize: 14 }
                            }}
                            sx={{ '& .MuiInputBase-input::placeholder': { color: '#8e8e8e' } }}
                        />

                        <Divider sx={{ borderColor: '#363636' }} />

                        <TextField
                            fullWidth
                            placeholder="Thêm vị trí"
                            variant="standard"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                startAdornment: <LocationOn sx={{ color: 'white', mr: 1, fontSize: 20 }} />,
                                sx: { color: 'white', fontSize: 14 }
                            }}
                            sx={{ '& .MuiInputBase-input::placeholder': { color: '#8e8e8e' } }}
                        />

                        <Divider sx={{ borderColor: '#363636' }} />

                        {error && <Typography color="error" variant="caption">{error}</Typography>}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CreatePostModal;
