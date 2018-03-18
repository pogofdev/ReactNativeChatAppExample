var express = require('express');
var http = require('http')
var socketio = require('socket.io');
var mongojs = require('mongojs');

var ObjectID = mongojs.ObjectID;
var db = mongojs(process.env.MONGO_URL || 'mongodb://localhost:27017/local');
var app = express();
var server = http.Server(app);
var websocket = socketio(server);
server.listen(4000, () => console.log('listening on *:4000'));


const mychat_nsp = websocket.of('/mychat');

mychat_nsp.on('connection', (socket) => {
    console.log('New connection', socket.id);

    socket.on('userJoined', (user) => onUserJoined(user, socket));
    socket.on('message', (message) => onMessageReceived(message, socket));
});

// Event listeners.
// When a user joins the chatroomName.
function onUserJoined(user, socket) {
    try {
        console.log('user joined roomName', user.roomName);
        //join user to their roomName as well as join to public roomName
        socket.join(user.roomName);
        socket.join('public');
        _sendExistingMessages(socket, user.roomName);

    } catch (err) {
        console.err(err);
    }
}

// When a user sends a message in the chatroomName.
function onMessageReceived(messageData, senderSocket) {
    _sendAndSaveMessage(messageData, senderSocket);
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket, roomName) {
    console.log("preparing to send existing messages to room ", roomName);
    var messages = db.collection('messages')
        .find({roomName})
        .sort({createdAt: 1})
        .toArray((err, messages) => {
            if(err){
                console.log('error', err)
            }
            // If there aren't any messages, then return.
            if (!messages.length) return;
            console.log("sendign existing message", messages);
            mychat_nsp.to(roomName).emit(`message`, messages.reverse());
        });
}

// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(messageData, socket, fromServer) {
    const {roomName, message} = messageData;
    var messageData = {
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        roomName
    };

    db.collection('messages').insert(messageData, (err, message) => {
        if (err) {
            console.log(err)
        }
        // If the message is from the server, then send to everyone.
        // var emitter = fromServer ? websocket : socket.broadcast;
        if (fromServer) {
            mychat_nsp.to('public').emit('message', [message])
        } else {
            socket.to(roomName).broadcast.emit(`message`, [message]);
        }

    });
}

// Allow the server to participate in the chatroomName through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function (d) {
    _sendAndSaveMessage(
        {
            roomName: "",
            message:
                {
                    text: d.toString().trim(),
                    createdAt: new Date(),
                    user: {_id: 'robot'}
                }
        }
        , null /* no socket */, true /* send from server */);
});
