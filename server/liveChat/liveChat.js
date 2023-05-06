const io = require('socket.io')(8080, {
    cors: {
        origin: ["http://localhost:3000"],
        credentials: true
    }
});


const liveChat = () => {
    io.on('connection', socket => {
        console.log('connected to socket.io 8080', socket.id)
        socket.on('join-room', (roomIds) => {
            console.log('the rooms are: ', roomIds);
            Promise.all(roomIds.map((roomId) => socket.join(roomId)))
                .then(() => {
                    console.log('Socket joined all rooms successfully');
                })
                .catch((err) => {
                    console.error('Error joining socket to rooms:', err);
                });
        });

        socket.on('leave-room', (roomIds) => {
            Promise.all(roomIds.map((roomId) => socket.leave(roomId)))
                .then(() => {
                    console.log('Socket leaved all rooms successfully');
                })
                .catch((err) => {
                    console.error('Error leaving socket to rooms:', err);
                });
        });

        socket.on('send-message', (message) => {
            console.log('a message was sent ', message)
            const roomId = [message.userId, message.friendId].sort()[0] + '' + [message.userId, message.friendId].sort()[1];
            console.log('The users friend is: ', message.friendId)
            console.log('The roomId is:', roomId, 'for the user :', message.userId)
            socket.to(roomId).emit("receive-message", message)
            console.log('inside send message server', message)
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    })
}

module.exports = liveChat;