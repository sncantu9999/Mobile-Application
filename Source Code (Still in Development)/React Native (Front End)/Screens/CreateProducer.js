// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

function CreateProducer({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;

  const [ssn, setssn] = useState(0)
  const [avg_rating, setavgrating] = useState(0.0)
  const [num_pickups, setnumpickups] = useState(0)
  const [error, setError] = useState("")

  function handleLogin() {

    setError("")

    let body = JSON.stringify({
      'SSN': ssn,
      'avg_rating': avg_rating,
      'num_pickups': num_pickups,
      'email': userObj.email,
    })

    fetch(`${domain}/api/auth/producers/`, {
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
        Alert.alert("Success!")
        navigation.navigate("ListingPage")
      })
      .catch(error => {
        console.log(error)
        Alert.alert("Already Signed Up!")
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
            Become a Producer
        </Text>
        <Text style = {styles.subheader}>
            Welcome to the Producing Family!
        </Text>
        <TextInput style = {styles.inputStyle}
            label = "Social Security Number"
            value = {ssn}
            onChangeText={text => setssn(text)}
        />
    </View>
    <Pressable style = {styles.btn} onPress = {() => handleLogin()}>
    <Text style = {styles.txt}>
        Register
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
export default CreateProducer
