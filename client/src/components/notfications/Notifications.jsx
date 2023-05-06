import React from 'react';
import axios from 'axios';


const Notifications = ({ user, notification, setNotifications, notifications }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json', //this should be application/json
        },
    };
    const acceptInvitation = () => {
        console.log('notification is:', notification);

        axios.post('http://localhost:8000/api/users/acc-invitation',
            JSON.stringify({
                userId: user._id,
                friendId: notification._id
            }), config).then((res) => {
                console.log('The response :', res.data);
                setNotifications(notifications.filter((not) => not !== user._d)
                );
            }).catch((error) => {
                console.log('An Error has occurred', error);
            })
    }

    const declineInvitation = () => {
        axios.post('http://localhost:8000/api/users/dec-invitation',
            JSON.stringify({
                userId: user._id,
                friendId: notification._id
            }), config).then((res) => {
                setNotifications(...[notifications.filter((not) => not !== user._d)]);
            }).catch((error) => {
                console.log('An Error has occurred', error);
            })
    }

    return (
        <div className="one-notification">
            <img src="./assets/pic-1.png" alt="" />
            <div className="friendshipReq">
                <p> <h3>{notification?.username}</h3>  wants to be a friend</p>
                <div className="acc-dec">
                    <button onClick={acceptInvitation} className='acc-invitation'>accept</button>
                    <button onClick={declineInvitation} className='dec-invitation'>decline</button>
                </div>
            </div>
        </div>
    )
}

export default Notifications;