const express = require('express');
const app = express();

const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const messagesRoute = require('./routes/messages');
const groupRoute = require('./routes/groups');

const liveChat = require('./liveChat/liveChat');

app.use(cors({
    origin: "http://localhost:3000"
}))
dotenv.config();
// app.use(bodyParser.json());
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));
app.use('/api/users', usersRoute);
app.use('/api/messages', messagesRoute)
app.use('/api/groups', groupRoute);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        liveChat();
        app.listen(process.env.PORT, () => {
            console.log('The server is running and connected to db')
        })
    })
    .catch((err) => console.log(err))