import React, { useEffect, useState } from 'react'
import './LeftChatGroup.css';
import { BsChatSquare, BsGraphUpArrow } from 'react-icons/bs';
// import { FaRegListAlt } from 'react-icons/fa';
import { HiOutlineUserGroup, HiOutlineViewGridAdd } from 'react-icons/hi';
import { AiOutlineSetting, AiOutlineDash } from 'react-icons/ai'; // create a group
// import { MdGroupAdd, MdGroupRemove } from 'react-icons/md'; // add-remove a member 
import axios from 'axios';
import { Buffer } from 'buffer';
const userId = "642a32c3af8447a65c3199d6";

const LeftChatGroup = ({ setCreateGroup, setCurrentGroup, setAllMsgGivenGroup }) => {
    const [myGroups, setMyGroups] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/groups/groups/' + userId).then((response) => {
            setMyGroups(response.data);
        }).catch((error) => {
            console.log('There was an error during getting groups: ', error);
        })
    }, [])

    return (
        <div className='left-chat-group'>
            <div className="sections">
                <div className="chat-section section">
                    <BsChatSquare className='icon' />
                </div>
                <div className="stats-section section">
                    <BsGraphUpArrow className='icon' />
                </div>
                <div className="create-group-section section">
                    <HiOutlineViewGridAdd onClick={() => setCreateGroup(true)} className='icon' />
                </div>
                <AiOutlineDash className='dashed-icon' />
                <div className="existing-groups-section section">
                    <HiOutlineUserGroup className='icon' />
                </div>
                <div className="settings-section section">
                    <AiOutlineSetting className='icon ' />
                </div>
                <div className="you-section">
                    <img src="./assets/pic-1.png" alt="" />
                    <span id='online-span'></span>
                </div>

            </div>
            <div className="section-details">
                <div className="my-groups">
                    <h5>My groups</h5>
                    {myGroups.map((group) => <MyGroup
                        key={group.groupName} group={group}
                        setCurrentGroup={setCurrentGroup}
                        setAllMsgGivenGroup={setAllMsgGivenGroup}
                    />)}
                </div>
            </div>
        </div>
    )
}


const MyGroup = ({ group, setCurrentGroup, setAllMsgGivenGroup }) => {
    const imgBlob = new Blob([group.groupImg])
    const imgUrl = URL.createObjectURL(imgBlob);
    const sizeMsg = (messages) => {

        if (messages.length > 0) {
            const msg = messages[messages.length - 1];
            if (msg?.type === 'text') {
                return msg.msg.length < 25 ? msg.msg : msg.msg.slice(0, 22) + '...';
            }
            return 'audio from ' + msg?.sender;
        }
        return 'Start a Chat';
    }
    /////////////////
    const sizeName = (groupName) => {
        if (groupName.length <= 10) {
            return groupName;
        }
        return groupName.slice(0, 7) + '...';
    }
    /////////////////
    const setCurrentGroupFun = () => {
        setAllMsgGivenGroup([]);
        group.messages.forEach((message) => {
            if (message.type === 'audio') {
                const buffer = Buffer.from(message.msg, 'base64');

                const audioBlob = new Blob([buffer], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                console.log('The url for the audio is: ', audioUrl);
                const msg = {
                    sender: message.sender,
                    msg: audioUrl,
                    date: message.date,
                    type: message.type
                };
                setAllMsgGivenGroup(allMsgGivenGroup => [...allMsgGivenGroup, msg]);
            } else {
                const msg = {
                    sender: message.sender,
                    msg: message.msg,
                    date: message.date,
                    type: message.type
                };
                setAllMsgGivenGroup(allMsgGivenGroup => [...allMsgGivenGroup, msg]);
            }
        })
        setCurrentGroup(group);
    }
    return (

        <div className="group" onClick={setCurrentGroupFun}>
            <img src={imgUrl} alt="img" />
            <h6>{sizeName(group.groupName)}</h6>
            <p>
                {sizeMsg(group.messages)}
            </p>
        </div>

    )
}

const MyFavoriteGroups = ({ favoriteGroups }) => {

    const getFavoriteGroups = async () => {
        const favoriteGroups = await axios.get('http://localhost:8000/groups/get-groups')

    }

    return (
        <div className="my-favorite-groups">
            <div className="group">
                <img src="./assets/pic-1.png" alt="" />
                <h6>Favorite group 1</h6>
                <p>
                    last message in the group
                </p>
            </div>
        </div>
    )

}

const ChatDetails = () => {
    return (
        <div className="group-chat-details">
            <div className="my-groups">
                <h5>My groups</h5>
                <div className="group">
                    <img src="./assets/pic-2.png" alt="" />
                    <h6>Group 1</h6>
                    <p>
                        last message in the group
                    </p>
                </div>
                <div className="group">
                    <img src="./assets/pic-2.png" alt="" />

                    <h6>Group 2</h6>
                    <p>
                        last message
                    </p>
                </div>
                <div className="group">
                    <img src="./assets/pic-2.png" alt="" />

                    <h6>Group 3</h6>
                    <p>
                        last message in the group
                    </p>
                </div>
                <div className="group">
                    <img src="./assets/pic-2.png" alt="" />

                    <h6>Group 3</h6>
                    <p>
                        last message in the group
                    </p>
                </div>
            </div>
            <div className="favorite-groups">
                <h5>My Pinned groups</h5>
                <div className="group">
                    <img src="./assets/pic-1.png" alt="" />
                    <h6>Favorite group 1</h6>
                    <p>
                        last message in the group
                    </p>
                </div>
                <div className="group">
                    <img src="./assets/pic-1.png" alt="" />
                    <h6>Favorite group 2</h6>
                    <p>
                        last message in the group
                    </p>
                </div>
                <div className="group">
                    <img src="./assets/pic-1.png" alt="" />
                    <h6>Favorite group 3</h6>
                    <p>
                        last message in the group
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LeftChatGroup;