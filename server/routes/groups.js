const router = require('express').Router();
const Group = require('../models/Groups');
const User = require('../models/User');




// Get all groups
router.get('/all-groups', async (req, res) => {
    Group.find({}).then((groups) => {
        res.status(200).json(groups);
    }).catch((error) => {
        console.log('An error was occurred during getting all the groups', error);
        res.status(500).json(error);
    })
})

// Get all groups for a given user
router.get('/groups/:id', async (req, res) => {

    const userId = req.params.id;
    try {
        const userGroups = await User.find({
            _id: userId
        }, {
            groups: 1,
            _id: 0
        })
        const groups = await Group.find({
            groupName: {
                $in: userGroups[0].groups
            }
        });
        res.status(200).json(groups);
    } catch (error) {
        console.log('There was an error occurred in getting groups given a user', error);
        res.status(500).json(error);
    }
})



// Create a group for a given user=admin
router.post('/group', async (req, res) => {
    const members = req.body.members.map((member) => member.name)
    const users = [...members, req.body.admin]
    const newGroup = new Group({
        groupName: req.body.groupName,
        admin: req.body.admin,
        members: users,
        lastActive: req.body.lastActive,
        messages: req.body.messages,
        groupDescription: req.body.groupDescription,
        groupImg: req.body.img
    })


    newGroup.save().then((doc) => {
        users.forEach(async (username) => {
            await User.updateOne({
                username: username
            }, {
                $push: {
                    groups: doc.groupName
                }
            });
        });
        res.status(200).json('The group was created successfully');
    }).catch((error) => {
        console.log('An error occurred during creating the new group');
        res.status(500).json(error);
    })
})



//// Update an existing group

// add a member
router.post('/add-members', async (req, res) => {
    const group = Group.findOne({
        groupName: req.body.groupName
    })
    if (group.admin === req.body.username) {
        await Group.updateOne({
            groupName: req.body.groupName
        }, {
            $push: {
                members: {
                    $each: [...members]
                }
            }
        })
    } else {
        res.status(401).json('You are not allowed to alter groups you did not create');
    }
})

// remove a member
router.post('/remove-member', async (req, res) => {
    const group = Group.findOne({
        groupName: req.body.groupName
    })
    if (group.admin === req.body.username) {
        await Group.updateOne({
            groupName: req.body.groupName
        }, {
            $pull: {
                members: {
                    $each: member
                }
            }
        })
    } else {
        res.status(401).json('You are not allowed to alter groups you did not create');
    }
})

// add a message to a given group
router.post('/add-message', async (req, res) => {
    const message = {
        sender: req.body.sender,
        msg: req.body.msg,
        date: req.body.date,
        type: req.body.type
    }
    Group.findOneAndUpdate({
        groupName: req.body.groupName
    }, {
        $push: {
            messages: message
        }
    }).then((result) => {
        console.log('The result of the added message is: ', result);
        res.status(200).json('The message was added successfully');
    }).catch((error) => {
        console.log('An error occurred while adding the msg', error);
        res.status(500).json('There was an error while adding the msg');
    })
})

// get messages for a given group
router.get('/get-msgs/:id', async (req, res) => {
    const groupName = req.params.id;
    Group.findOne({
        groupName: groupName
    }, {
        messages: 1,
        _id: 0
    }).then((doc) => {
        res.status(200).json(doc);
    }).catch((error) => {
        console.log('an error has occurred while getting the conversation: ', error);
        res.status(500).json(error);
    })
})

// Delete a group
router.post('/remove-group', async (req, res) => {

    const group = Group.findOne({
        groupName: req.body.groupName
    })
    if (group.admin === req.body.username) {
        Group.findOneAndDelete({
            _id: req.body.groupName
        }).then((doc) => {
            res.status(200).json('The group has been deleted', doc);
        }).catch((error) => {
            console.log('An error has occurred while deleting the group', error);
            res.status(500).json('An error has occurred while deleting the group');
        })

    }
})

module.exports = router;