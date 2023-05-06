import React from 'react';
import './LeftFeed.css';
import { BsThreeDots } from 'react-icons/bs';


const LeftFeed = () => {
  return (
    <div className='left-feed'>
      <div className="my-groups">
        <div className='groups-params'>
          <h5>My Groups</h5>
          <BsThreeDots className='three-dots-icon' />
        </div>

        <div className="group">
          <img src="./assets/pic-2.png" alt="" />
          <span className='group-name'>group name 1</span>
        </div>
        <div className="group">
          <img src="./assets/pic-2.png" alt="" />
          <span className='group-name'>group name 2</span>
        </div>
        <div className="group">
          <img src="./assets/pic-2.png" alt="" />
          <span className='group-name'>group name 3</span>
        </div>
        <div className="group">
          <img src="./assets/pic-2.png" alt="" />
          <span className='group-name'>group name 4</span>
        </div>
      </div>
      <div className="my-online-friends">
        <div className='friends-params'>
          <h5>My Friends</h5>
          <BsThreeDots className='three-dots-icon' />

        </div>
        <div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 1</span>
        </div>
        <div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 2</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 3</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 2</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 5</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 6</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 7</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 8</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 9</span>
        </div><div className="online-friend">
          <img src="./assets/pic-1.png" alt="" />
          <span className='friend-name'>Friend name 10</span>
        </div>
      </div>
    </div>
  )
}

export default LeftFeed;