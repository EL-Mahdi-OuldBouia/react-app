import './Chat.css';
import io from 'socket.io-client';
import { useEffect, useState, useContext, useRef } from 'react';
import { IoMdPaperPlane } from 'react-icons/io';
import { AiOutlineAudio, AiOutlineAudioMuted } from 'react-icons/ai';
import { Buffer } from 'buffer';
import axios from 'axios';
import { format } from 'date-fns';
import Friend from '../friend/Friend';
import ChatLeft from './ChatLeft';
import ChatRight from './ChatRight';
import { UserContext } from '../../App';
import MediaPlayer from '../mediaPlayer/MediaPlayer';

const socket = io.connect("http://localhost:8080");


const startConversation = (friendId, userId, message) => {
    const config = {
        headers: {
            'Content-Type': 'application/json', //this should be application/json
        },
    };
    axios.post('http://localhost:8000/api/messages/messages', JSON.stringify({
        userId: userId,
        friendId: friendId,
        message: message
    }), config)
}

function Chat() {
    const [user, , , , ,] = useContext(UserContext);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [audioLinks, setAudioLinks] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [type, setType] = useState('text');
    const audioRef = useRef(null);





    useEffect(() => {
        const getUsers = async () => {
            const res = await axios.get('http://localhost:8000/api/users/users');
            setUsers([...res.data]);
        }
        getUsers();
        console.log('The current user is: ', user);
    }, []);

    useEffect(() => {
        // Initialize Socket.io client with reconnection disabled
        const socket = io({
            reconnection: false,
            reconnect: false
        });

        // Disconnect socket on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);


    useEffect(() => {
        socket.on("receive-message", (data) => {
            setConversation([...conversation, {
                message: data.message,
                username: data.username,
                date: data.date,
                type: data.type
            }]);
            audioRef.current.play();
        })
    }, [socket]);


    useEffect(() => {
        let roomIds = []
        for (let i = 0; i < user.friends?.length; i++) {
            var roomId = [user._id, user.friends[i]].sort()[0] + '' + [user._id, user.friends[i]].sort()[1];
            roomIds.push(roomId);
        }
        socket.emit('join-room', roomIds);

        return () => {
            socket.emit('leave-room', roomIds)
        };
    }, []);

    useEffect(() => {
        setMessages([]);
        axios.get('http://localhost:8000/api/messages/get-conversation/' + user?._id + '/' + currentUser?._id)
            .then((res) => {
                console.log('the res in getting messages for a given user and a friend ', res);
                // setMessages()
            }).catch((error) => {
                console.log('there was an error getting the conversation', error);
            })
    }, [currentUser]);

    const sendMessage = async () => {
        // emit()
        if (message.trim() !== '') {
            const date = new Date(); // create a new Date object with the current date and time
            const formattedDate = format(date, "HH:mm:ss/yyyy-MM-dd"); // format the date as "hour-min-seconds/year-month-day"
            const config = {
                headers: {
                    'Content-Type': 'application/json', //this should be application/json
                },
            };
            socket.emit("send-message", {
                message: message,
                username: user.username,
                userId: user._id,
                friendId: currentUser._id,
                friendName: currentUser.username,
                date: formattedDate,
                type: type
            });
            console.log('currentUser :', currentUser);
            console.log('userId :', user._id);
            const roomId = [user._id, currentUser._id].sort()[0] + '' + [user._id, currentUser._id].sort()[1];
            console.log('RoomId is :', roomId);
            setMessages([...messages, {
                message: message,
                username: user.username,
                date: formattedDate,
                sender: user._id,
                receiver: currentUser._id
            }]);

            axios.post('http://localhost:8000/api/messages/add-message',
                JSON.stringify({
                    message: message,
                    username: user.username,
                    userId: user._id,
                    friendId: currentUser._id,
                    friendName: currentUser.username,
                    date: formattedDate,
                })
                , config).then((res) => {
                    console.log('res data from sending a message', res.data);
                }).catch((error) => console.log('An error occurred :', error));
            setMessage('');
        }
    }

    const getConversation = async (userId, friendId) => {
        axios.get(`http://localhost:8000/api/messages/get-conversation/${userId}/${friendId}`)
            .then((res) => {

                const messages = res.data.messages;
                console.log('The conversation has been retrieved', messages);
                setAudioLinks([]);
                setConversation([]);
                for (let i = 0; i < messages?.length; i++) {
                    if (messages[i].type === 'buffer') {
                        const buffer = Buffer.from(messages[i].message, 'base64');
                        // Create a Blob object from the Buffer data
                        const blobDB = new Blob([buffer], { type: 'audio/wav' });
                        const audioUrlDB = URL.createObjectURL(blobDB);
                        console.log(audioUrlDB);
                        setAudioLinks(links => [...links, audioUrlDB]);
                        setConversation(conv => [...conv, {
                            link: audioUrlDB,
                            date: messages[i].date,
                            sender: messages[i].sender,
                            type: 'buffer'
                        }])
                    } else {
                        setConversation(conv => [...conv, {
                            message: messages[i].message,
                            date: messages[i].date,
                            sender: messages[i].sender,
                            type: 'text'
                        }])
                    }
                }
                console.log('The conversation is : ', conversation);
                console.log('The audioLinks are: ', audioLinks);
                // base64-encoded string
                // from binary data to Buffer
                // const buffer = Buffer.from(messages[6].message, 'base64');

                // // Create a Blob object from the Buffer data
                // const blobDB = new Blob([buffer], { type: 'audio/wav' });
                // const audioUrlDB = URL.createObjectURL(blobDB);
                // setAudioLink(audioUrlDB);
            })
            .catch((error) => {
                console.log('An error was occurred while getting the conversation: ', error);
            })

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // document.body.style.background = 'green';
            sendMessage();
        }
    };


    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    return (
        <div className="chat-container">
            <div className="play-audio">
                <h3>Play Audio</h3>
                <h4>Drag and Drop audio here</h4>
                <MediaPlayer />
            </div>
            <ChatLeft
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setMessages={setMessages}
                getConversation={getConversation}
            />
            {currentUser && <div className="messaging">
                <div className="message-container">
                    <div className="messages">
                        <div className="current-friend-title">{currentUser.username?.toUpperCase()}:</div>
                        {messages.map((msg, index) => {
                            msg.type === 'text' ? <div key={index} className='one-message'>
                                <p className='username'>
                                    {msg.username}
                                </p>
                                <p className='message'>
                                    {msg.message}
                                </p>
                                <p className='date'>
                                    {msg.date}
                                </p>
                            </div>
                                :
                                <div key={index} className='one-message'>
                                    <audio controls src={msg.link}></audio>
                                    <p className='message'>
                                        {msg.message}
                                    </p>
                                    <p className='date'>
                                        {msg.date}
                                    </p>
                                </div>
                        }
                        )}
                    </div>
                </div>
                <textarea className='text-area' id='message' value={message} onChange={handleChange}
                    name='message' size="40"
                    placeholder='write messages' onKeyDown={handleKeyDown}
                    rows="4" cols="50"></textarea>
                <div className="send-msg">
                    <button id='btn' onClick={sendMessage} >Send</button>
                    <AiOutlineAudio className='record-icon icon' />
                    <IoMdPaperPlane className='send-audio-icon icon' />
                </div>
                {/* <div className="message">{output}</div> */}
            </div>}
            <ChatRight users={users} user={user} />
            <audio ref={audioRef}>
                <source src="./assets/media/popup.mp3" type="audio/mpeg" />
            </audio>
        </div>

    );
}

export default Chat;


