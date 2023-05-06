import Friend from "../friend/Friend";

const ChatRight = ({ users, user }) => {
    const friends = users.filter((friend) => (
        friend._id !== user._id && !user.friends?.includes(friend._id)
    ))

    return (
        <div className="chat-right">
            <h1>All Users</h1>
            <div className="all-users">
                {
                    friends.map((friend, index) =>
                        <Friend className='one-users' key={index} potentialFriend={friend} userId={user._id} />
                    )
                }
            </div>
        </div>
    )
}

export default ChatRight;