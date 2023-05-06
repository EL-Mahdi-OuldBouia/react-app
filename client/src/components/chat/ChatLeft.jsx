import { useEffect, useState, useContext } from 'react';
import './ChatLeft.css';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';
import { UserContext } from '../../App';
import axios from 'axios';

const ChatLeft = ({ currentUser, setCurrentUser, getConversation }) => {
    const [user, , , ,] = useContext(UserContext);
    const [togDet, setTogDet] = useState(false);
    const [friendsDet, setFriendsDet] = useState([]);

    const setFriendConversation = (friend) => {
        setCurrentUser(friend);
        console.log('The current friend is :', currentUser);
    }
    const setGetConv = (friend) => {
        setCurrentUser(friend);
        getConversation(user._id, friend._id);
    }
    const config = {
        headers: {
            'Content-Type': 'application/json', //this should be application/json
        },
    };
    useEffect(() => {
        const getFriendsDet = async () => {
            try {
                const resData = await axios.post('http://localhost:8000/api/users/get-certain-users', JSON.stringify({
                    users: user.friends
                }), config)
                const users = resData.data.users;
                console.log(users);
                setFriendsDet(friendsDet => [...users]);
                console.log('friends details in friendsDet= ', friendsDet)
            } catch (error) {
                console.log('An error has occurred: ', error);

            }
        }
        getFriendsDet();
    }, []);


    return (
        <div className="chat-left">
            <h1>Your Friends</h1>
            {friendsDet ? <>{togDet ?

                friendsDet.map((friend) => <div key={friend._id} className="friend-conversation-detailed">
                    <div className="username-img"
                        onClick={getConversation} >
                        <img onClick={() => setFriendConversation(friend)}
                            src="./assets/pic-1.png"
                            alt="" />
                        <div className="username">{friend.username.toUpperCase()}</div>
                    </div>
                    <p className='last-message-sender'>Sender:  </p>
                    <p className='lastMsg'>This is the last msg</p>
                    <p>20:20:41/2022-21-05</p>
                </div>)

                :

                friendsDet.map((friend) => <div key={friend._id} className="friends">
                    <div className="username-img">
                        <img onClick={() => setGetConv(friend)}
                            src="./assets/pic-1.png"
                            alt="" />
                        <div className="username">{friend.username.toUpperCase()}</div>
                    </div>
                </div>)}
                {togDet ?
                    <IoMdArrowDropright onClick={() => setTogDet(!togDet)}
                        className='icon-r icon' />
                    :
                    <IoMdArrowDropleft onClick={() => setTogDet(!togDet)}
                        className='icon-l icon' />}</> :
                <div className='no-firends-add-new-ones'>
                    <p>You have no current friends</p>
                    <br />
                    <p>you can always add new friends</p>
                </div>
            }
        </div>
    )
}

export default ChatLeft;