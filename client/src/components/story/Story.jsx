import React from 'react';
import './Story.css';

const Story = ({ storyNumber }) => {
    return (
        <div className='story'>
            <img src="" alt="" />
            <div className="img-username">
                <img id='img-of-story' src={`./assets/stories/story (${storyNumber}).jpg`} alt="" />
                <div className="username-story">

                    <img id='img-for-profile' src="./assets/pic-1.png" alt="" />

                    <span className='username'>Username</span>
                </div>
            </div>
        </div>
    )
}

export default Story;