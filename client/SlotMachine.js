import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
class SlotMachine extends React.Component {
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
    _onPressSlotMachine = () => {
        const {username,roomName} = this.state;
        this.props.navigation.navigate('SlotMachine',{username,roomName})
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor:'#313142'}}>
                <View style={{flex:8}}>
                    <View style={{flex:1, marginTop:50, marginLeft:35, marginRight:35, marginBottom:50,borderRadius:5,borderWidth:0, borderColor:'#4A90E2', backgroundColor:'#4B4F63'}}>
                        {/*<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>*/}
                            {/*<Text style={styles.buttonText}>*/}
                                {/*Sign in with Facebook*/}
                            {/*</Text>*/}
                        {/*</LinearGradient>*/}
                        <LinearGradient colors={['#B98AAB', '#BC3495', '#BC3495']} style={{height:50,borderTopLeftRadius:5, borderTopRightRadius:5, alignItems:'center', justifyContent:'center' }}>
                            <Text style={{color:'white', fontSize:20, fontWeight:'bold'}}>Quay so</Text>
                        </LinearGradient>
                        <View style={{flex:1,backgroundColor:'white'}}>

                        </View>
                        <View style={{flexDirection:'row',height:60}}>
                            <LinearGradient colors={['#ddd', '#F8E71C', '#F8E71C']} style={{flex:1}}></LinearGradient>
                            <LinearGradient colors={['#ddd', '#4A90E2', '#4A90E2']} style={{flex:1}}></LinearGradient>
                        </View>
                    </View>

                </View>
                <View style={{flex:2}}>
                    <View style={{flex:1, backgroundColor:'#4B4F63'}}>
                        <Text>test</Text>
                    </View>

                </View>

            </View>
        );
    }
}

// Later on in your styles..
var styles = {
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
};

export default SlotMachine;