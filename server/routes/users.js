const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
    json
} = require("body-parser");


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

// Generate Salt
const saltRound = 9;
const salt = bcrypt.genSalt(saltRound);


// get all users
router.get('/users', async (req, res) => {
    User.find({}, {
        id: 1,
        username: 1,
        email: 1,
        friendshipRequests: 1,
    }).then((users) => {
        console.log('The users has been retrieved: ');
        res.status(200).json(users);
    }).catch((error) => {
        console.log('An error occurred in getting all the users', error);
        res.json('An error occurred in getting all the users');
    })
})

// register many users at one time
router.post('/register-many', async (req, res) => {
    User.insertMany(req.body.users).then((docs) => {
        res.status(200).json('The users were added successfully')

    }).catch((error) => {
        console.log('The was an error while adding the users: ', error);
        res.json('An error occurred while adding the users');
    })
})

// get multiple users given their ids
router.post('/get-certain-users', async (req, res) => {
    User.find({
        _id: {
            $in: req.body.users
        }
    }, {
        _id: 1,
        profilePicture: 1,
        username: 1
    }).then((users) => {
        res.status(200).json({
            users: users
        })
        console.log('Certain users route has been visited');
    }).catch((error) => {
        res.status(500).json('There was an error getting users');
    })
})

// Register a user given an email, password, username
router.post('/register', async (req, res) => {
    try {

        const isEmailExists = await User.find({
            username: req.body.username
        })
        if (isEmailExists.length > 0) {
            return res.status(409).json({
                emailExists: "The email already exists"
            })
        }

        // Hash the password with salt
        // const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // console.log('The hashed pass is:', hashedPassword);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            // other fields you want to set for the user
        });

        const newUser = await user.save();
        res.status(200).json({
            userId: newUser._id,
            username: newUser.username
        })


    } catch (error) {
        return res.status(409).json({
            error: error
        });
    }
})



// Login given a user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (user.password === req.body.password) {
            res.status(200).json({
                ...user
            })
        }
    } catch (error) {
        res.status(401).json({
            message: 'The email or password is incorrect'
        })
    }
})



// Change password
router.post('/changePassword', async (req, res) => {
    try {
        await User.findByIdAndUpdate({
            _id: req.body.username
        }, {
            password: req.body.password
        });
        res.status(200).json('The password has been changed successfully');
    } catch (error) {
        console.error(error);
        res.json('There was a problem changing the password');
    }
})

// add profile image


// add cover image

// accept an invitation
router.post('/acc-invitation', async (req, res) => {
    try {
        await User.findOneAndUpdate({
            _id: req.body.userId
        }, {
            $addToSet: {
                friends: req.body.friendId
            },
            $pull: {
                friendshipRequests: req.body.friendId
            }
        }, {
            new: true
        });

        await User.findOneAndUpdate({
            _id: req.body.friendId
        }, {
            $addToSet: {
                friends: req.body.userId
            },
            $pull: {
                friendshipRequests: req.body.userId
            }
        }, {
            new: true
        })

    } catch (error) {
        console.error(error);
        res.json('There was an error accepting the invitation');
    }
})

// decline an invitation
router.post('/dec-invitation', async (req, res) => {
    User.findOneAndUpdate({
        _id: req.body.userId
    }, {
        $pull: {
            friendshipRequests: req.body.friendId
        }
    }).then((doc) => {
        res.status(200).json('The friendship request was successfully rejected');
    }).catch((error) => {
        res.status(500).json('An error occurred while removing the friendship request');
    })
})

// Send an invitation
router.post('/add-user', async (req, res) => {
    console.log('The req data is:', req.body)
    User.findOneAndUpdate({
        _id: req.body.friendId
    }, {
        $push: {
            friendshipRequests: req.body.userId
        }
    }).then((user) => {
        res.status(200).json(
            'The invitation was sent successfully'
        );
    }).catch((error) => {
        console.error(error);
        res.status(500).json('The invitation was not sent, an error was occurred');
    })
})

// Cancel an invitation
router.delete('/add-user', async (req, res) => {
    console.log('The req data is:', req.body)
    User.findOneAndUpdate({
        _id: req.body.friendId
    }, {
        $pull: {
            friendshipRequests: req.body.userId
        }
    }).then((user) => {
        res.status(200).json(
            'Invitation got canceled'
        );
    }).catch((error) => {
        console.error(error);
        res.status(500).json('The invitation was not sent, an error was occurred');
    })
})

// create a group
router.post('/create-group', async (req, res) => {
    User.findOneAndUpdate({
        _id: req.body.userId
    }, {
        $push: {
            groups: req.body.group
        }
    }).then(updatedUser => {
        res.status(200).json('The new group was added');
    }).catch(err => {
        console.error(err);
        res.json('An error occurred in adding the new group');
    });
})


// ask to join a group
// router.post('/join-group',async(req,res)=>{
//     User.
// })
module.exports = router;