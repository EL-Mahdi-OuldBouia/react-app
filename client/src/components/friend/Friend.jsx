import React from 'react';
import './Friend.css';
import { AiFillPlusCircle } from 'react-icons/ai';
import { TiCancel } from 'react-icons/ti';
import axios from 'axios';

const Friend = ({ without, potentialFriend, userId, friend }) => {


    const config = {
        headers: {
            'Content-Type': 'application/json', //this should be application/json
        },
    };

    if (!potentialFriend) {
        return (
            <div className={without ? 'friend-comp' : 'friend-comp friend-comp-without'}>
                <div className="img-name">
                    <img src="./assets/pic-1.png" alt="" />
                    <p className='name'>Adam</p>
                </div>
                {without && <div className="time-msg">
                    <p className='msg-sample'>HEllo friend, long time no see</p>
                    <p className='time'>20:32:32</p>
                </div>}
            </div>
        )
    } else {
        const sendInvitation = async () => {
            console.log('In send invitation');
            const res = await axios.post('http://localhost:8000/api/users/add-user', JSON.stringify({
                friendId: potentialFriend._id,
                userId: userId
            }), config);
            console.log(res);
        }
        const cancelInvitation = async () => {
            console.log('In send invitation');
            const res = await axios.delete('http://localhost:8000/api/users/add-user', JSON.stringify({
                friendId: potentialFriend._id,
                userId: userId
            }), config);
            console.log(res);
        }
        return (
            <div className="all-users-friends">
                <img src={`./assets/pic-${Math.floor(Math.random() * 8) + 1}.png`} alt="" />
                <p className='name'>{
                    potentialFriend.username.length < 8 ? potentialFriend.username :
                        potentialFriend.username.slice(0, 6) + '..'
                }</p>
                <div className="add-remove">
                    {potentialFriend.friendshipRequests.includes(userId) ?
                        <TiCancel onClick={cancelInvitation} className='icon' id='cancel' /> :
                        <AiFillPlusCircle onClick={sendInvitation} className='icon' id='add' />}
                </div>
            </div>
        )
    }

}

export default Friend