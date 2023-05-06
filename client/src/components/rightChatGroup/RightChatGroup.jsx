import React from 'react';
import './RightChatGroup.css';
import { format } from 'date-fns';

const RightChatGroup = ({ currentGroup }) => {
    const date = new Date(currentGroup?.createdAt);
    const formattedDate = currentGroup?.createdAt ? format(date, 'HH:mm/yyyy-MM-dd') : '';
    return (
        <div className='right-group-chat'>
            <div className="img-name">
                <img src="./assets/pic-1.png" alt="" />
                <h4>{currentGroup?.groupName}</h4>
            </div>
            <div className="general-details">
                <h4>general information</h4>
                <div className="description">
                    <h6>Description:</h6>
                    <p>
                        {currentGroup?.groupDescription}
                    </p>
                </div>
                <div className="admin detail">
                    <h6>Admin:</h6>
                    <p>{currentGroup?.admin.toUpperCase()}</p>
                </div>
                <div className="member-count detail">
                    <h6>Member Count:</h6>
                    <p>{currentGroup?.members.length}</p>
                </div>
                <div className="last-interaction-date detail">
                    <h6>Last being active date:</h6>
                    <p>{currentGroup?.messages[currentGroup.messages.length - 1]?.date || '0000/00'}</p>
                </div>
                <div className="creation-date detail">
                    <h6>Creation date:</h6>
                    <p>{formattedDate}</p>
                </div>
            </div>
        </div>
    )
}

export default RightChatGroup;