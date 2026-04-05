import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import classes from './home.module.css'
import StorySlider from '../../component/storie';
import Article from '../../component/Article';
const HomePage = () => {
    const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));

    const fetchMoreData = () => {
        setTimeout(() => {
            const newItems = Array.from({ length: 10 }, (_, i) => items.length + i + 1);
            setItems((prev) => [...prev, ...newItems]);
        }, 1000);
    };
    console.log(items);
    return (
        <div className={classes.HomePage}>
            <StorySlider />
            <InfiniteScroll
                dataLength={items.length}
                next={fetchMoreData}
                hasMore={true}
                loader={<h4>Đang tải...</h4>}
            >
                {items.map((item) => (
                    // {/* <div key={item} style={{ padding: 20, borderBottom: '1px solid #ccc', color: 'white' }}> */}
                    <div style={{ borderBottom: '1px solid #ccc', color: 'white' }}>
                        <Article />
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};
export default HomePage;