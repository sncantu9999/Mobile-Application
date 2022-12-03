import React, { useContext, useState } from 'react';
import { StyleSheet, View, Image, useWindowDimensions, Pressable, Alert, Text, TouchableOpacity, ScrollView, VirtualizedList } from 'react-native';
import { Context } from "./globalContext"

import {TextInput} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'

function SignIn({ navigation, route, props}) {
    const {height} = useWindowDimensions()
    const globalContext = useContext(Context)
    const { setIsLoggedIn, domain, userObj, setUserObj } = globalContext;
  
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
  
    function InsertData() {
  
      setError("")
  
      let body = JSON.stringify({
        'username': email.toLowerCase(),
        'password': password
      })
  
      fetch(`${domain}/api/auth/login-user/`, {
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
            setError("Invalid Credentials")
            throw res.json()
          }
        })
        .then(json => {
          console.log(json) 
          setUserObj(json)
          setIsLoggedIn(true)
        })
        .catch(error => {
          Alert.alert("Account Does Not Exist")
        })
  
    }

    return (
        <View>
        <ScrollView>
        <View style = {styles.root}>
            <Image source = {Logo} style = {[styles.logo, {height: height * 0.3}]} resizeMode = "contain" />
        </View>
        <View>
            <Text style = {styles.header}>
                Log In
            </Text>
            <Text style = {styles.subheader}>
                Please sign in to continue.
            </Text>
            <TextInput style = {styles.inputStyle}
                label = "Email"
                value = {email}
                textContentType="username"
                onChangeText={text => setEmail(text)}
            />
            <TextInput style = {styles.inputStyle}
                label = "Password"
                value = {password}
                secureTextEntry = {true}
                textContentType="password"
                onChangeText={text => setPassword(text)}

            />
        </View>
        <Pressable style = {styles.btn} onPress = {() => InsertData()}>
        <Text style = {styles.txt}>
            Sign In
        </Text>
        </Pressable>
        <Pressable style = {[styles.altbtn, {marginBottom: 100}]} onPress = {() => navigation.navigate("PasswordReset")}>
        <Text style = {styles.alttxt}>
            Forgot Password?
        </Text>
        </Pressable>
        <View>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("CreateAccount")}>
        <Text style = {styles.alttxt}>
            Don't have an account?
            <Text style = {{color: 'blue'}}> Create One.</Text>
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
export default SignIn