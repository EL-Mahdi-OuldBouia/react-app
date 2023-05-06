const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8
    },
    profilePicture: {
        data: Buffer,
        contentType: String,
    },
    coverPicture: {
        data: Buffer,
        contentType: String,
    },
    friends: {
        type: Array,
        default: []
    },
    friendshipRequests: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("user", UserSchema);