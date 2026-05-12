import React, { useState, useEffect } from 'react';
import {
    Dialog,
    Box,
    IconButton,
    Typography,
    Avatar,
    LinearProgress
} from '@mui/material';
import { Close, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const StoryViewer = ({ open, stories, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, open]);

    useEffect(() => {
        if (!open || stories.length === 0) return;

        const duration = 5000; // 5 seconds per story
        const interval = 50; // Update every 50ms
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    handleNext();
                    return 0;
                }
                return prev + increment;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, open, stories]);

    const handleNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    };

    if (stories.length === 0) return null;

    const currentStory = stories[currentIndex];

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullScreen 
            PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.9)', boxShadow: 'none' } }}
        >
            <Box sx={{ 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                color: 'white'
            }}>
                {/* Header with Progress Bars */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    width: '100%', 
                    maxWidth: 450, 
                    px: 2, 
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {stories.map((_, idx) => (
                            <Box key={idx} sx={{ flex: 1, height: 2, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1, overflow: 'hidden' }}>
                                <Box sx={{ 
                                    height: '100%', 
                                    width: idx === currentIndex ? `${progress}%` : (idx < currentIndex ? '100%' : '0%'),
                                    bgcolor: 'white'
                                }} />
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={currentStory.user?.avatarUrl} sx={{ width: 32, height: 32 }} />
                            <Typography variant="subtitle2" fontWeight="bold">
                                {currentStory.user?.username || 'user'}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                        <IconButton onClick={onClose} sx={{ color: 'white' }}>
                            <Close />
                        </IconButton>
                    </Box>
                </Box>

                {/* Main Content */}
                <Box sx={{ 
                    width: '100%', 
                    maxWidth: 450, 
                    height: '80vh', 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}>
                    {currentStory.mediaType === 'video' ? (
                        <video 
                            src={currentStory.mediaUrl} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            autoPlay 
                            muted 
                        />
                    ) : (
                        <img 
                            src={currentStory.mediaUrl} 
                            alt="story" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    )}

                    {/* Navigation Areas */}
                    <Box 
                        onClick={handlePrev}
                        sx={{ position: 'absolute', left: 0, top: 0, width: '30%', height: '100%', cursor: 'pointer' }} 
                    />
                    <Box 
                        onClick={handleNext}
                        sx={{ position: 'absolute', right: 0, top: 0, width: '70%', height: '100%', cursor: 'pointer' }} 
                    />
                </Box>

                {/* Desktop Arrows */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'absolute', width: '100%', justifyContent: 'space-between', px: 4 }}>
                    <IconButton onClick={handlePrev} disabled={currentIndex === 0} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                        <ArrowBackIos sx={{ ml: 1 }} />
                    </IconButton>
                    <IconButton onClick={handleNext} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                        <ArrowForwardIos />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default StoryViewer;
