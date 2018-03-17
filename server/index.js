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


websocket.on('connection', (socket) => {
    console.log('New connection', socket.id);

    socket.on('userJoined', (user) => onUserJoined(user, socket));
    socket.on('message', (message) => onMessageReceived(message, socket));
});

// Event listeners.
// When a user joins the chatroom.
function onUserJoined(user, socket) {
    try {
        // keep user
        // users[socket.id] = user.userId;
        _sendExistingMessages(socket, user.chatId);

    } catch(err) {
        console.err(err);
    }
}

// When a user sends a message in the chatroom.
function onMessageReceived(data, senderSocket) {
    _sendAndSaveMessage(data, senderSocket);
}

// Helper functions.
// Send the pre-existing messages to the user that just joined.
function _sendExistingMessages(socket, chatId) {

    var messages = db.collection('messages')
        .find({chatId})
        .sort({ createdAt: 1 })
        .toArray((err, messages) => {
            // If there aren't any messages, then return.
            if (!messages.length) return;
            console.log("sendign existing message");
            socket.emit(`${chatId}/message`, messages.reverse());
        });
}

// Save the message to the db and send all sockets but the sender.
function _sendAndSaveMessage(data, socket, fromServer) {
    const {chatId,message} = data;
    var messageData = {
        text: message.text,
        user: message.user,
        createdAt: new Date(message.createdAt),
        chatId: chatId
    };

    db.collection('messages').insert(messageData, (err, message) => {
        if(err){
            console.log(err)
        }
        // If the message is from the server, then send to everyone.
        var emitter = fromServer ? websocket : socket.broadcast;
        emitter.emit(`${chatId}/message`, [message]);
    });
}

// Allow the server to participate in the chatroom through stdin.
var stdin = process.openStdin();
stdin.addListener('data', function(d) {
    _sendAndSaveMessage({
        text: d.toString().trim(),
        createdAt: new Date(),
        user: { _id: 'robot' }
    }, null /* no socket */, true /* send from server */);
});
