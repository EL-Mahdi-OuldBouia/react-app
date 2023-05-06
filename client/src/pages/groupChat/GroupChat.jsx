import React, { useState } from 'react';
import './GroupChat.css';
import LeftChatGroup from '../../components/leftChatGroup/LeftChatGroup';
import GroupMessaging from '../../components/groupMessaging/GroupMessaging';
import RightChatGroup from '../../components/rightChatGroup/RightChatGroup';
import CreateGroup from '../../components/createGroup/CreateGroup';

const GroupChat = () => {
    const [createGroup, setCreateGroup] = useState(false);
    const [showSuccessBar, setShowSuccessBar] = useState(false);
    const [currentGroup, setCurrentGroup] = useState();
    const [allMsgGivenGroup, setAllMsgGivenGroup] = useState([]);


    return (
        <div className='group-chat-page'>
            <LeftChatGroup setCreateGroup={setCreateGroup}
                setCurrentGroup={setCurrentGroup}
                setAllMsgGivenGroup={setAllMsgGivenGroup} />
            {currentGroup && <GroupMessaging currentGroup={currentGroup}
                setCurrentGroup={setCurrentGroup}
                allMsgGivenGroup={allMsgGivenGroup}
                setAllMsgGivenGroup={setAllMsgGivenGroup}
            />}
            {currentGroup && <RightChatGroup currentGroup={currentGroup} />}
            {createGroup && <CreateGroup setCreateGroup={setCreateGroup} />}
        </div>
    )
}

export default GroupChat