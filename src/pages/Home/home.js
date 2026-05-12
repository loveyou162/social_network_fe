import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import classes from './home.module.css'
import StorySlider from '../../component/storie';
import Article from '../../component/Article';
import blogApi from '../../api/blogApi';

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await blogApi.getFeed();
            // Backend thường trả về response.data
            const data = response.data || response;
            setPosts(data);
            setLoading(false);
            // Nếu số lượng bài viết ít hơn mong đợi, có thể không còn bài viết nào khác
            if (data.length < 10) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Lỗi khi lấy bài viết:', error);
            setLoading(false);
            setHasMore(false);
        }
    };
    console.log(posts);
    const fetchMoreData = () => {
        // Tạm thời chưa có pagination thực sự từ backend trong hướng dẫn
        // nên chúng ta chỉ dừng lại ở lần fetch đầu tiên hoặc fetch lại
        setHasMore(false);
    };

    return (
        <div className={classes.HomePage}>
            <StorySlider />
            {loading ? (
                <h4 style={{ color: 'white', textAlign: 'center' }}>Đang tải bảng tin...</h4>
            ) : posts.length === 0 ? (
                <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
                    <h3>Chưa có bài viết nào.</h3>
                    <p>Hãy bắt đầu bằng cách follow mọi người!</p>
                </div>
            ) : (
                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4 style={{ color: 'white' }}>Đang tải thêm...</h4>}
                >
                    {posts.map((post) => (
                        <div key={post.id || post._id} style={{ borderBottom: '1px solid #333', color: 'white' }}>
                            <Article post={post} />
                        </div>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    );
};
export default HomePage;