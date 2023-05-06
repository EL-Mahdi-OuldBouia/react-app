const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    friendId: {
        type: String,
        required: true,
        unique: true
    },
    messages: {
        type: Array,
        default: []
    },
    unreadMsgs: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Message', MessageSchema);