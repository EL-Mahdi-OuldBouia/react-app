import React from 'react';
import './RightFeed.css';
import { MdVideoLibrary } from 'react-icons/md';
import { BsImages } from 'react-icons/bs';
import { RiLiveFill } from 'react-icons/ri';
import { SiPurescript } from 'react-icons/si';

const RightFeed = () => {
    return (
        <div className='right-feed'>
            <div className="cover-profile-username-title-about">
                <img id='cover-img' src="./assets/stories/story (8).jpg" alt="" />
                <div className="profile-username">
                    <img src="./assets/pic-1.png" alt="" />
                    <div className="username-title">
                        <span className="username">Username</span>
                        <span className="title">Gate To Innovation
                            <SiPurescript className='dev-icon icon' />
                        </span>
                    </div>
                </div>
                <div className="about-you">
                    <h4>Bio</h4>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Quasi inventore molestiae enim eligendi! Facilis commodi
                        repudiandae sequi eveniet, eaque nulla eos omnis
                        officiis unde tempora quam distinctio!
                    </p>
                </div>

            </div>
            <div className="share-express">
                <textarea name="your-thoughts" id="your-thoughts"
                    placeholder="What's in your mind Username"
                    cols="20" rows="5">

                </textarea>
            </div>
            <div className="share-video-image-goLive">
                <div className="image-video">
                    <span className='share-image'>
                        <BsImages className='icon-image icon' />
                        Image
                    </span>
                    <div id='separate'>|</div>
                    <span className='share-video'>
                        <MdVideoLibrary className='icon-video icon' />
                        Video
                    </span>
                </div>
                <div className="go-live">
                    <RiLiveFill className='icon-live icon' />
                </div>
            </div>
        </div>
    )
}

export default RightFeed