/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import room from "./client/room";
import index from "./client/index";


const Rootstack = StackNavigator(
    {
        RoomSelection: {
            screen: room
        },
        ChatRoom: {
            screen: index
        },
    },
    {
        initialRouteName: 'RoomSelection',
        headerMode:'none'
    }
);

export default Rootstack