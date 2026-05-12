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
    CircularProgress
} from '@mui/material';
import { Close, CloudUpload, LocationOn } from '@mui/icons-material';
import blogApi from '../api/blogApi';

const CreatePostModal = ({ open, onClose, onPostCreated }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Vui lòng chọn ảnh hoặc video');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('caption', caption);
        formData.append('location', location);
        formData.append('mediaType', file.type.startsWith('video') ? 'video' : 'image');

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
        setFile(null);
        setPreviewUrl(null);
        setCaption('');
        setLocation('');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Tạo bài viết mới</Typography>
                <IconButton onClick={handleClose} disabled={loading}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    {previewUrl ? (
                        <Box sx={{ width: '100%', position: 'relative' }}>
                            {file?.type.startsWith('video') ? (
                                <video src={previewUrl} style={{ width: '100%', borderRadius: 8 }} controls />
                            ) : (
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', borderRadius: 8 }} />
                            )}
                            <Button 
                                variant="contained" 
                                color="secondary" 
                                size="small" 
                                sx={{ position: 'absolute', top: 10, right: 10 }}
                                onClick={() => { setFile(null); setPreviewUrl(null); }}
                            >
                                Thay đổi
                            </Button>
                        </Box>
                    ) : (
                        <Box 
                            sx={{ 
                                width: '100%', 
                                height: 300, 
                                border: '2px dashed #ccc', 
                                borderRadius: 2, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <CloudUpload sx={{ fontSize: 60, color: '#ccc', mb: 1 }} />
                            <Typography>Kéo ảnh hoặc video vào đây</Typography>
                            <Button variant="outlined" sx={{ mt: 2 }}>Chọn từ máy tính</Button>
                        </Box>
                    )}
                    <input 
                        type="file" 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*,video/*"
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Viết chú thích..."
                        variant="outlined"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        placeholder="Thêm vị trí"
                        variant="outlined"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        InputProps={{
                            startAdornment: <LocationOn sx={{ color: 'action.active', mr: 1 }} />,
                        }}
                    />

                    {error && <Typography color="error">{error}</Typography>}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit" disabled={loading}>Hủy</Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={loading || !file}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? 'Đang đăng...' : 'Chia sẻ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePostModal;
