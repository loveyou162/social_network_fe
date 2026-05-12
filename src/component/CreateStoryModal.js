import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    CircularProgress
} from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import storyApi from '../api/storyApi';

const CreateStoryModal = ({ open, onClose, onStoryCreated }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
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
        formData.append('mediaType', file.type.startsWith('video') ? 'video' : 'image');

        try {
            await storyApi.createStory(formData);
            setLoading(false);
            handleClose();
            if (onStoryCreated) onStoryCreated();
        } catch (err) {
            setLoading(false);
            setError('Có lỗi xảy ra khi đăng story. Vui lòng thử lại.');
            console.error(err);
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreviewUrl(null);
        setError('');
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="xs" 
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#262626',
                    color: 'white',
                    borderRadius: 3,
                    backgroundImage: 'none'
                }
            }}
        >
            <DialogTitle sx={{ 
                textAlign: 'center', 
                borderBottom: '1px solid #363636',
                py: 1.5,
                fontSize: '16px',
                fontWeight: 'bold'
            }}>
                Tạo Story mới
                <IconButton 
                    onClick={handleClose} 
                    disabled={loading}
                    sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    minHeight: 400,
                    justifyContent: 'center',
                    bgcolor: '#121212'
                }}>
                    {previewUrl ? (
                        <Box sx={{ width: '100%', height: '100%', position: 'relative', aspectRatio: '9/16' }}>
                            {file?.type.startsWith('video') ? (
                                <video src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls />
                            ) : (
                                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                            <Button 
                                variant="contained" 
                                size="small" 
                                sx={{ 
                                    position: 'absolute', 
                                    top: 15, 
                                    right: 15,
                                    bgcolor: 'rgba(0,0,0,0.6)',
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                                }}
                                onClick={() => { setFile(null); setPreviewUrl(null); }}
                            >
                                Thay đổi
                            </Button>
                        </Box>
                    ) : (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                cursor: 'pointer',
                                p: 4
                            }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <CloudUpload sx={{ fontSize: 80, color: 'white', mb: 2, opacity: 0.8 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>Tải lên ảnh hoặc video</Typography>
                            <Typography variant="body2" sx={{ color: '#8e8e8e', mb: 3 }}>Story sẽ biến mất sau 24 giờ</Typography>
                            <Button variant="contained" sx={{ borderRadius: 2, px: 3 }}>Chọn từ thiết bị</Button>
                        </Box>
                    )}
                    <input 
                        type="file" 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*,video/*"
                    />
                </Box>
                {error && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography color="error" variant="caption">{error}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ borderTop: '1px solid #363636', p: 1.5 }}>
                <Button 
                    onClick={handleSubmit} 
                    fullWidth 
                    variant="contained" 
                    disabled={loading || !file}
                    sx={{ 
                        fontWeight: 'bold',
                        py: 1,
                        textTransform: 'none',
                        borderRadius: 2
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Chia sẻ lên Story'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateStoryModal;
