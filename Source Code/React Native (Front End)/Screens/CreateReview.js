import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

function CreateReview({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;

  const [header_text, setHeader] = useState('')
  const [body_text, setBody] = useState('')
  const [number_of_stars, setStars] = useState('')

  function handleLogin() {
    const date = new Date();
    console.log(header_text);
    console.log(body_text);
    console.log(date);
    console.log(userObj.email);
    console.log(number_of_stars);
    console.log(route.params.id);
    console.log(route.params)
    let body = JSON.stringify({
      'header_text': header_text,
      'body_text': body_text,
      'useremail': userObj.email,
      'date': date,
      'number_of_stars': number_of_stars,
      'post_id': route.params.id,
      'produceremail': route.params.produceremail

    })

    fetch(`${domain}/api/auth/reviews/`, {
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
        Alert.alert("Review Posted!")
        navigation.navigate("ListingPage")
      })
      .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to leave review.")
      })

  }
  return (
    <View>
    <ScrollView>
    <View>
        <Text style = {styles.header}>
        Any Opinions?
        </Text>
        <TextInput style = {styles.inputStyle}
            label = "Title"
            value = {header_text}
            onChangeText={text => setHeader(text)}
        />
        <TextInput style = {[styles.inputStyle, styles.textbox]}
            label = "Description"
            value = {body_text}
            multiline = {true}
            onChangeText={text => setBody(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Number of Stars (out of 5)"
            value = {number_of_stars}
            onChangeText={text => setStars(text)}
        />
    </View>
    <Pressable style = {styles.btn} onPress = {() => handleLogin()}>
    <Text style = {styles.txt}>
        Post
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
export default CreateReview
