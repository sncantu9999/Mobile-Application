import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import { Context } from './globalContext';

function TermsService({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj } = globalContext;


  return ( 
    <View>
        <Text>
            Listings Available Near You
        </Text>
        <Text>Terms of {userObj.first_name} {userObj.last_name}</Text>
    </View>
  )
}
export default TermsService

