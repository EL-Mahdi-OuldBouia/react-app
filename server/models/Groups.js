const mongoose = require('mongoose');


const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    admin: {
        type: String,
        require: true,
        max: 50,
    },
    groupImg: {
        data: Buffer,
        contentType: String,
    },
    members: {
        type: Array,
        default: []
    },
    lastActive: {
        type: String,
    },
    messages: {
        type: Array,
        default: []
    },
    groupDescription: {
        type: String
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("group", GroupSchema);