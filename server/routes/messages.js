const router = require("express").Router();
const Messages = require('../models/Messages');
const multer = require('multer');
// const upload = multer({
//     dest: 'uploads/'
// })
const fs = require('fs');
const {
    Buffer
} = require('buffer');




// Get all the messages for a given user and a given friend
router.get('/get-messages', async (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    const messages = Messages.findOne({
        $or: [{
                userId: userId,
                friendId: friendId
            },
            {
                userId: friendId,
                friendId: userId
            }
        ]
    });
    console.log('The messages for a given conversation')
    res.json({
        msg: 'Hello from getting all messages',
        messages
    });
})

router.get('/get-conversation/:id1/:id2', async (req, res) => {
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    console.log('from getting a single conversation');
    Messages.findOne({
        userId: id1,
        friendId: id2,
    }).then((conversation) => {
        res.status(200).json(conversation);
    }).catch((error) => res.status(500).json('An error occurred while getting the messages between', req.userId, ' and ', req.friendId, error))
})


// Add a message to a given conversation given a userId & a friendId
router.post('/add-message', async (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    try {
        await Messages.findOneAndUpdate({
            userId: userId,
            friendId: friendId
        }, {
            $push: {
                messages: {
                    message: req.body.message,
                    username: req.body.username,
                    date: req.body.date,
                    sender: req.body.username,
                    receiver: req.body.friendName,
                    type: 'text',
                }
            },
            $inc: {
                unreadMsgs: 1
            }
        }, {
            upsert: true,
            new: true
        })
        await Messages.findOneAndUpdate({
            userId: friendId,
            friendId: userId
        }, {
            $push: {
                messages: {
                    message: req.body.message,
                    username: req.body.friendName,
                    date: req.body.date,
                    sender: req.body.username,
                    receiver: req.body.friendName,
                    type: 'text',
                }
            },
            $inc: {
                unreadMsgs: 1
            }
        }, {
            upsert: true,
            new: true
        })

        res.status(200).json(
            'The message was saved successfully'
        )
    } catch (error) {
        console.log(error);
        res.status(401).json('There was an error in adding the message');
    }
})

const storage = multer.memoryStorage(); // store uploaded file in memory as a buffer
const upload = multer({
    storage
});

// Add an audio message to the conversation
router.post('/add-audio-message', upload.single('file'), async (req, res) => {
    try {

        const userInfo = JSON.parse(req.body.userInfo);
        const userId = userInfo.userId;
        const friendId = userInfo.friendId;
        const date = userInfo.date;
        const uploadedFile = req.file;


        console.log('userId: ', userInfo.userId, '\nfriendId: ', friendId, '\ndate: ', date);

        // const bufferFromBlob = Buffer.from(uploadedFile);
        // console.log('Buffer from blob : ', bufferFromBlob)

        const {
            originalname,
            buffer
        } = uploadedFile;
        console.log('After uploadFile', uploadedFile);
        console.log('The userInfo : ', req.body.userInfo);
        const newUser = await Messages.findOneAndUpdate({
            userId: userId,
            friendId: friendId
        }, {
            $push: {
                messages: {
                    message: buffer,
                    username: userId,
                    date: date,
                    sender: userId,
                    receiver: friendId,
                    type: 'buffer'
                }
            },
            $inc: {
                unreadMsgs: 1
            }
        }, {
            upsert: true,
            new: true
        })
        await Messages.findOneAndUpdate({
            userId: friendId,
            friendId: userId
        }, {
            $push: {
                messages: {
                    message: buffer,
                    username: friendId,
                    date: date,
                    sender: userId,
                    receiver: friendId,
                    type: 'buffer',
                }
            },
            $inc: {
                unreadMsgs: 1
            }
        }, {
            upsert: true,
            new: true
        })
        res.status(200).json(newUser);


    } catch (error) {
        console.log(error);
        res.status(401).json('There was an error in adding the message');
    }
})

module.exports = router;