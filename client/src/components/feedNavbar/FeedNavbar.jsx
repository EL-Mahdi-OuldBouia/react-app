import React from 'react';
import './FeedNavbar.css';
import { FaHome, FaUsers, FaSearch, FaBell, FaFacebookMessenger } from 'react-icons/fa';

const FeedNavbar = () => {
    return (
        <div className='feed-navbar'>
            <div className="name-home">
                <span className='app-name'>JSiT<span>-</span>Easy</span>
            </div>
            <div className="friendshipRequests-chats">
                <FaHome className='home-icon icon' />
                <FaUsers className='users-icon icon' />
                <FaFacebookMessenger  className='message-icon icon'/>
            </div>
            <div className="search-container-1">
                <input type="text" placeholder="Search..." />
                <button type="submit"><FaSearch className="fa fa-search" /></button>
            </div>
            <div className="bell-img-username">
                <FaBell className='bell-icon icon'/>
                <div className="img-username">
                    <img src="./assets/pic-1.png" alt="" />
                    <span className='username'>Username</span>
                </div>
            </div>
        </div>
    )
}

export default FeedNavbar;