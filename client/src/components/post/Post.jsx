import React from 'react';
import './Post.css';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { FaRegShareSquare } from 'react-icons/fa';
const Post = () => {
    return (
        <div className='one-post'>
            <div className="profile-username-dots">
                <div className="profile-username">
                    <img id='profile-image' src="./assets/pic-1.png" alt="" />
                    <span className='username'>username</span>
                </div>
                <BsThreeDots className='three-dots icon' />
            </div>
            <img id='post-img' src="./assets/posts/post (1).jpg" alt="" />
            <p className='description'>Lorem sit amet consectetur adipisicing elit.
                Iure quod optio expedita fuga dignissimos
                nesciunt sint quis culpa,
                alias earum fugit.</p>
            <div className="img-comment-like-share">
                <div className="img-input">
                    <img src="./assets/pic-1.png" alt="" />
                    <input type="text" className='comment' />
                </div>
                <AiOutlineHeart className='heart icon' />
                <AiOutlineMessage className='message icon' />
                <FaRegShareSquare className='share icon' />
            </div>
        </div>
    )
}

export default Post