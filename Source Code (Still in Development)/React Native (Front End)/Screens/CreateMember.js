// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

function CreateMember({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;

  const [useremail, setEmail] = useState('')
  const [error, setError] = useState("")

  function handleLogin() {
    console.log(useremail)
    console.log(userObj.email)
    let body = JSON.stringify({
      'useremail': useremail,
      'admin': userObj.email
    })

    fetch(`${domain}/api/auth/groups/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:body
      })
      .then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw res.json()
        }
      })
      .then(json => {
        Alert.alert("Friend Added!")
        navigation.navigate("ListingPage")
      })
      .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to add friend.")
      })

  }
  return (
    <View>
    <ScrollView>
    <View>
        <Text style = {styles.header}>
            Add Friend to Group
        </Text>
        <Text>Add your friends to a group to send directed alerts</Text>
        <TextInput style = {styles.inputStyle}
            label = "Friend's Email"
            value = {useremail}
            onChangeText={text => setEmail(text)}
        />
    </View>
    <Pressable style = {styles.btn} onPress = {() => handleLogin()}>
    <Text style = {styles.txt}>
        Add
    </Text>
    </Pressable>
    <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage")}>
    <Text style = {styles.alttxt}>
        I changed my mind
        <Text style = {{color: 'blue'}}> Go back</Text>
    </Text>
    </Pressable>
    </ScrollView>
    </View>
  )

}

const styles = StyleSheet.create({
    header : {
        fontWeight : 'bold',
        fontSize : 35,
        marginLeft : 10,
    },
    textbox : {
      height : 200
    },
    subheader : {
        fontWeight : 'bold',
        marginLeft : 10,
        marginBottom : 30,
        color : 'gray'
    },
    inputStyle: {
        backgroundColor: 'white',
        margin : '3%',
        borderColor: '#e8e8e8',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
    },
    btn : {
        backgroundColor : '#87CEEB',
        margin : '3%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    altbtn : {
        margin : '3%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
    },
    alttxt : {
        color : 'grey',
    },
    txt : {
        color : 'black',
    },
    logo : {
        width : '20%',
        alignSelf : 'flex-start',
        marginTop : -10,
        position : 'absolute'
    }
})
export default CreateMember
