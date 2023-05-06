import React, { useState } from 'react';
import './CreateGroup.css';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { Buffer } from 'buffer';
import axios from 'axios';
import { format } from 'date-fns';

const CreateGroup = ({ setCreateGroup, setShowSuccessBar }) => {
    const friends = [{
        name: 'johndoe',
        pic: './assets/pic-3.png'
    },
    {
        name: 'mike',
        pic: './assets/pic-1.png'
    },
    {
        name: 'john',
        pic: './assets/pic-2.png'
    },
    {
        name: 'sarahsmith',
        pic: './assets/pic-6.png'
    },
    {
        name: 'lisabrown',
        pic: './assets/pic-6.png'
    },
    {
        name: 'katewilson',
        pic: './assets/pic-6.png'
    }
    ];
    const [yourFriends, setYourFriends] = useState(friends);
    const [newGroup, setNewGroup] = useState({
        groupName: '',
        admin: 'steve',
        members: [],
        lastActive: '',
        messages: [],
        groupDescription: '',

    });
    const [showGroupImg, setShowGroupImg] = useState(false);
    const [groupImgUrl, setGroupImgUrl] = useState('');

    /// Functions
    const addMember = (friend) => {
        const filteredMembers = yourFriends.filter(member => member.name !== friend.name);
        setYourFriends(filteredMembers);
        setNewGroup(newGroup => ({
            ...newGroup, members: [...newGroup.members, friend]
        }))
    }
    const removeMember = (friend) => {
        setYourFriends(yourFriends => [...yourFriends, friend]);
        setNewGroup(newGroup => {
            const filteredMembers = newGroup.members.filter(member => member.name !== friend.name);
            return ({
                ...newGroup,
                members: filteredMembers
            })
        })
    }

    async function fileToBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const buffer = Buffer.from(reader.result);
                resolve(buffer);
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file as buffer'));
            };
            reader.readAsArrayBuffer(file);
        });
    }

    const handleFileSelect = async (e) => {
        const file = await e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setGroupImgUrl(imageUrl);
        setShowGroupImg(true);
        const buffer = await fileToBuffer(file);
        setNewGroup(newGroup => ({
            ...newGroup,
            img: buffer,
        }))


    }
    const createGroupFunction = () => {
        const date = new Date();
        const formattedDate = format(date, "HH:mm:ss/yyyy-MM-dd");
        setNewGroup(newGroup => ({
            ...newGroup,
            lastActive: formattedDate
        }))
        console.log('The new group is: ', newGroup);
        axios.post('http://localhost:8000/api/groups/group',
            JSON.stringify(newGroup)
            ,
            {
                headers: {
                    // any headers to be sent with the request
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            console.log('The response is: ', response);
            if (response.status === 200) {
                setCreateGroup(false);
            }

        }).catch((error) => {
            console.log('An error has occurred in creating a new group', error)
        })
    }
    return (
        <div className='create-group-ui'>
            <div className="new-group-ui">
                <div className="title-create-group">
                    <h3>Create New Group</h3>
                    <RxCross1 onClick={() => setCreateGroup(false)} className='x-mark icon' />
                </div>
                <div className="group-name">
                    <label htmlFor="groupName">Group Name:</label>
                    <input type="text"
                        name='groupName'
                        id='groupName'
                        placeholder='Choose a name'
                        onChange={(e) => setNewGroup(newGroup => ({
                            ...newGroup,
                            groupName: e.target.value
                        }))} />
                </div>
                <div className="group-description">
                    <label htmlFor="description">Group Description:</label>
                    <textarea name="description"
                        id="description"
                        cols="30" rows="10"
                        onChange={(e) => setNewGroup(newGroup => ({
                            ...newGroup,
                            groupDescription: e.target.value
                        }))}></textarea>
                </div>
                <div className="add-cover-img">
                    <input type="file" accept="image/.png" onChange={handleFileSelect} multiple={false} />
                    {showGroupImg && <img id='group-chosen-img' src={groupImgUrl} alt="" />}
                </div>
                <div className="add-friends">
                    <div className="friends">
                        <h4>Your Friends</h4>
                        {yourFriends.map((friend, index) => <Friend key={index} friend={friend} addRemove={false} addRemoveMember={addMember} />)}
                    </div>
                    <div className="added-friends">
                        <h4>Added Friends</h4>
                        {newGroup.members.map((friend, index) => <Friend key={index} friend={friend} addRemove={true} addRemoveMember={removeMember} />)}
                    </div>
                </div>
                <button className='create-group-btn' onClick={createGroupFunction}>create group</button>
            </div>
        </div>
    )
}

const Friend = ({ friend, addRemove, addRemoveMember }) => {
    return (
        <div className="friend">
            <img src={friend.pic} alt="" />
            <p className='friend-name'>{friend.name}</p>{ }
            {addRemove ?
                <AiOutlineMinus className='minus-icon icon' onClick={() => addRemoveMember(friend)} />
                :
                <AiOutlinePlus className='plus-icon icon' onClick={() => addRemoveMember(friend)} />}
        </div>
    )
}

export default CreateGroup;