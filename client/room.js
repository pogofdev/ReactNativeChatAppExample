import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';


class RoomSelection extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            username:'poisongas',
            roomName:'1'
        }
    }

    _onPress = () => {
      const {username,roomName} = this.state;
        this.props.navigation.navigate('ChatRoom',{username,roomName})
    };

    render() {
        return (
            <View style={{ flex: 1}}>
                <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Private Chat Room</Text>
                    <Text>Please enter your name and the room you want to join</Text>
                </View>
                <View style={{flex:2}}>

                    <View>
                        <Text>Username</Text>
                        <TextInput
                            onChangeText = {(username) => this.setState({username})}
                            value={this.state.username}
                        />
                        <Text>Room name</Text>
                        <TextInput
                            onChangeText = {(roomName) => this.setState({roomName})}
                            value={this.state.roomName}
                        />
                    </View>

                    <Button
                        onPress={this._onPress}
                        title="Learn More"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />

                </View>

            </View>
        );
    }
}

export default RoomSelection;