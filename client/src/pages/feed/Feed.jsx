import React from 'react';
import './Feed.css';
import LeftFeed from '../../components/leftFeed/LeftFeed';
import RightFeed from '../../components/rightFeed/RightFeed';
import Post from '../../components/post/Post';
import SwiperC from '../../components/swiperC/SwiperC';

const Feed = () => {
    return (
        <div className='feed'>
            <LeftFeed />
            {/* <Feed /> */}
            <div className="stories-posts">
                <div className="stories">
                    <SwiperC />
                </div>
                <div className="posts">
                    <Post />
                </div>
            </div>
            <RightFeed />
        </div>
    )
}

export default Feed