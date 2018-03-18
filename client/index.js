import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
// import SocketIOClient from 'socket.io-client';
import SocketIOClient from 'socket.io-client/dist/socket.io';
import { GiftedChat } from 'react-native-gifted-chat';

const USER_ID = '@userId';

class Main extends React.Component {
    constructor(props) {
        super(props);
        const {username,roomName} = props.navigation.state.params;
        this.state = {
            messages: [],
            userId: username,
            roomName

        };


        // this.determineUser = this.determineUser.bind(this);
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        this.onSend = this.onSend.bind(this);
        this._storeMessages = this._storeMessages.bind(this);

        this.socket = SocketIOClient('https://rocky-hamlet-71418.herokuapp.com/mychat');

        this.socket.on(`message`, this.onReceivedMessage);
        this.socket.on('server message', this.onReceivedMessage);
        // this.determineUser();

        this.joinServer(username,roomName);
    }

    joinServer = (username, roomName) => {
        this.socket.emit('userJoined', {userId:username,roomName});
    };

    /**
     * When a user joins the chatroom, check if they are an existing user.
     * If they aren't, then ask the server for a userId.
     * Set the userId to the component's state.
     */
    // determineUser() {
    //     AsyncStorage.getItem(USER_ID)
    //         .then((userId) => {
    //             // If there isn't a stored userId, then fetch one from the server.
    //             if (!userId) {
    //                 this.socket.emit('userJoined', null);
    //                 this.socket.on('userJoined', (userId) => {
    //                     AsyncStorage.setItem(USER_ID, userId);
    //                     this.setState({ userId });
    //                 });
    //             } else {
    //                 this.socket.emit('userJoined', userId);
    //                 this.setState({ userId });
    //             }
    //         })
    //         .catch((e) => alert(e));
    // }

    // Event listeners
    /**
     * When the server sends a message to this.
     */
    onReceivedMessage(messages) {
        // check if the coming data belong to this user
        this._storeMessages(messages);
    }

    /**
     * When a message is sent, send the message to the server
     * and store it in this component's state.
     */
    onSend(messages=[]) {
        const {roomName} = this.state;
        this.socket.emit('message', {roomName,message:messages[0]});
        this._storeMessages(messages);
    }

    render() {
        var user = { _id: this.state.userId || -1 };

        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={this.onSend}
                user={user}
            />
        );
    }

    // Helper functions
    _storeMessages(messages) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, messages),
            };
        });
    }
}

module.exports = Main;
