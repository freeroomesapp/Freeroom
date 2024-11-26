import React from 'react';
import { Text, View } from 'react-native';
import Users from '../components/users';

const HomeScreen = props => {
    return (
        <Users navigation={props.navigation} />
        //<Users />
    );
};
HomeScreen.navigationOptions = {
    title: 'User List'
};
export default HomeScreen;