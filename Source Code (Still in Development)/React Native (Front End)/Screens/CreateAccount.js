// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

function CreateAccount({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;

  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  function handleLogin() {

    setError("")

    let body = JSON.stringify({
      'username': email.toLowerCase(),
      'email': email.toLowerCase(),
      'first_name': firstName,
      'last_name': lastName,
      'password': password
    })

    fetch(`${domain}/api/auth/create-user/`, {
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
          setError("User already exists")
          throw res.json()
        }
      })
      .then(json => {
        console.log(json)
        setUserObj(json)
        // setToken(json.token)
        setIsLoggedIn(true)
      })
      .catch(error => {
        Alert.alert("Account Already Exists")
      })

  }

//   function validate(text) {
//     let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
//     if (reg.test(text) === false) {
//     }
//     else {
//       setValEmail(text)
//       Alert.alert("yay")
//       return
//     }
  
  function errorlog() {
    if (password.length < 8) { Alert.alert("Password must be at least 8 characters")}
    else {handleLogin()}

  }

  return (
    <View>
    <ScrollView>
    <View>
    <View style = {styles.root}>
        <Image source = {Logo} style = {[styles.logo, {height: height * 0.3}]} resizeMode = "contain" />
    </View>
    <View>
        <Text style = {styles.header}>
            Create Account
        </Text>
        <Text style = {styles.subheader}>
            Welcome to the Foodie Family!
        </Text>
        <TextInput style = {styles.inputStyle}
            label = "First Name"
            value = {firstName}
            onChangeText={text => setFirstName(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Last Name"
            value = {lastName}
            onChangeText={text => setLastName(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Email"
            value = {email}
            onChangeText={text => setEmail(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Password"
            value = {password}
            secureTextEntry = {true}
            onChangeText={text => {
                setPassword(text)
            }
        }
            
        />
        {/* <TextInput style = {styles.inputStyle}
            label = "Repeat Password"
            value = {passwordvalidate}
            secureTextEntry = {true}
            onChangeText={text => setPasswordvalidate(text)}
        /> */}
    </View>
    <Pressable style = {styles.btn} onPress = {() => errorlog()}>
    <Text style = {styles.txt}>
        Register
    </Text>
    </Pressable>
    <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("SignIn")}>
    <Text style = {styles.alttxt}>
        Already have an account?
        <Text style = {{color: 'blue'}}> Sign In.</Text>
    </Text>
    </Pressable>
    </View>
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
    root : {
        alignItems: 'center',
        padding: 20,
    },
    logo : {
        marginTop : 20,
        width : '70%',
        maxWidth: 300,
        maxHeight: 200,
    }
})

export default CreateAccount