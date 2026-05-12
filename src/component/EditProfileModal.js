import React, { useState, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Avatar,
    IconButton,
    CircularProgress,
    Typography
} from '@mui/material';
import { Close, PhotoCamera } from '@mui/icons-material';
import userApi from '../api/userApi';

const EditProfileModal = ({ open, onClose, user, onUpdate }) => {
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
    const fileInputRef = useRef();

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            
            // Tải lên ngay lập tức hoặc để đến khi nhấn Save?
            // Thường thì nên tải lên ngay để cập nhật ảnh
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await userApi.uploadAvatar(formData);
                setUploading(false);
                if (onUpdate) onUpdate();
            } catch (error) {
                setUploading(false);
                console.error('Lỗi upload avatar:', error);
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await userApi.updateProfile(user.id, { fullName, bio });
            setLoading(false);
            onUpdate();
            onClose();
        } catch (error) {
            setLoading(false);
            console.error('Lỗi cập nhật profile:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Chỉnh sửa trang cá nhân</Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar 
                            src={avatarPreview} 
                            sx={{ width: 100, height: 100, mb: 1, border: '1px solid #dbdbdb' }} 
                        />
                        {uploading && (
                            <CircularProgress 
                                size={100} 
                                sx={{ position: 'absolute', top: 0, left: 0, color: 'rgba(255,255,255,0.7)' }} 
                            />
                        )}
                        <IconButton 
                            color="primary" 
                            sx={{ position: 'absolute', bottom: 5, right: -10, bgcolor: 'white', '&:hover': { bgcolor: '#f0f0f0' } }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <PhotoCamera />
                        </IconButton>
                    </Box>
                    <input 
                        type="file" 
                        hidden 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        accept="image/*" 
                    />
                    <Typography variant="caption" color="textSecondary">Nhấn để thay đổi ảnh đại diện</Typography>
                </Box>

                <TextField
                    label="Tên đầy đủ"
                    fullWidth
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Tiểu sử (Bio)"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Hủy</Button>
                <Button 
                    onClick={handleSave} 
                    variant="contained" 
                    disabled={loading || uploading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Lưu thay đổi'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileModal;
