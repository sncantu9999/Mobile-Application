// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

function EditPost({ route, navigation, props }){
    const {height} = useWindowDimensions()
    const globalContext = useContext(Context)
    const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
    const [header, setHeader] = useState(route.params.header_text)
    const [bodytxt, setBody] = useState(route.params.body_text)
    const [city, setCity] = useState(route.params.city)
    const [street, setStreet] = useState(route.params.street)
    const [state, setState] = useState(route.params.state)
    const [country, setCountry] = useState(route.params.country)
    const [zipcode, setZip] = useState(route.params.zipcode)
    const [producer, setProducer] = useState(route.params.produceremail)
    const [expdate, setExp] = useState(route.params.date_exp)
    const [error, setError] = useState("")

  function editpost() {
    setError("")
    let body = JSON.stringify({
      'header_text': header,
      'body_text': bodytxt,
      'produceremail': producer,
      'date_exp': expdate, //current date plus 2 hours would actually be custom based on what food it is
      'city': city,
      'street': street,
      'state': state,
      'country': country,
      'zipcode': zipcode,
    })

    fetch(`${domain}/api/auth/posts/${route.params.id}`, {
      method: 'PUT',
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
        Alert.alert("Post Updated!")
        navigation.navigate("PostInfo", route.params)
      })
      .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to make post.")
      })
  }

  return (
    <View>
    <ScrollView>
    <View>
        <Text style = {styles.header}>
        </Text>
        <TextInput style = {styles.inputStyle}
            label = "Title"
            value = {header}
            onChangeText={text => setHeader(text)}
        />
        <TextInput style = {[styles.inputStyle, styles.textbox]}
            label = "Description"
            value = {bodytxt}
            multiline = {true}
            onChangeText={text => setBody(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "City"
            value = {city}
            onChangeText={text => setCity(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "State"
            value = {state}
            onChangeText={text => setState(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Street"
            value = {street}
            onChangeText={text => setStreet(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Country"
            value = {country}
            onChangeText={text => setCountry(text)}
        />
        <TextInput style = {styles.inputStyle}
        label = "Zip Code"
        value = {zipcode}
        onChangeText={text => setZip(text)}
        />
        <Text> Show Photos and Videos Here</Text> 
    </View>
    <Pressable style = {styles.btn} onPress = {() => editpost()}>
    <Text style = {styles.txt}>
        Update
    </Text>
    </Pressable>
    <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("PostInfo", route.params)}>
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
export default EditPost
