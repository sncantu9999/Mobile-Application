// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import MyTabs from './tabnavigation'
import { BaseNavigationContainer } from '@react-navigation/native';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function Reservation({ navigation, route, props }){
    const {height} = useWindowDimensions()
    const globalContext = useContext(Context)
    const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
    const [selectedId, setSelectedId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [reservation, setReservation] = useState({});


    useEffect(() => {
        fetch(`${domain}/api/auth/posts/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          })
          .then(res => {
            if (res.ok) {
              return res.json()
            } else {
              throw res.json()
            }
          })
          .then(json => {
              console.log("POSTS:\n")
              // console.log(json)
    
              for(i in json){
                // console.log(json[i])
                if(json[i].recieveremail === userObj.email){
                  console.log("checked")
                  setReservation(json[i])
                }
              }
          })
          .catch(error => {
          //   console.log('hi')
            console.log("ERROR:\n")
            console.log(error)
            // Alert.alert("An error occured. Unable to gather producers.")
          })
      },[refreshing, reservation])

    function changeReciever(user) {
        let body = JSON.stringify({
            'header_text': reservation.header_text,
            'body_text': reservation.body_text,
            'produceremail': reservation.produceremail,
            'date_exp': reservation.date_exp, //current date plus 2 hours would actually be custom based on what food it is
            'city': reservation.city,
            'street': reservation.street,
            'state': reservation.state,
            'country': reservation.country,
            'zipcode': reservation.zipcode,
            'recieveremail': user,
          })
      
          fetch(`${domain}/api/auth/posts/${reservation.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body:body
            })
            .then(json => {
              console.log(json)
              if (user === null) {
                Alert.alert("Reservation Cancelled")
                setReservation({})
              }
              else{
              Alert.alert("Reservation Completed!")
              }
              navigation.navigate("ListingPage")
            })
            .catch(error => {
              console.log(error)
              Alert.alert("An error occured. Unable to make post.")
            })
    }
    
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  
    return (
        <ScrollView 
        refreshControl={
        <RefreshControl refreshing={refreshing}
            onRefresh={() => {
            setRefreshing(true)
            wait(2000).then(() => setRefreshing(false))
            }} />
        }>  
        <View>
            <Text style = {styles.header}>
                Reservation Information
            </Text>
            <Text>Welcome {userObj.first_name} {userObj.last_name}</Text>
            <View>
            <Text>{reservation.header_text}</Text>
            <Text>{reservation.body_text}</Text>
            <Text>Date of Expiration: {reservation.date_exp}</Text>
            <Text>Delivery Location: {[reservation.street, reservation.city, reservation.state, reservation.country, reservation.zipcode]}</Text>
            <Text>Producer: {reservation.produceremail}</Text>
            <Pressable style = {styles.btn} onPress = {() => changeReciever(null)}>
            <Text style = {styles.txt}>
                Cancel Reservation
            </Text>
            </Pressable>
            <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage", reservation)}>
            <Text style = {styles.alttxt}>
                I changed my mind
                <Text style = {{color: 'blue'}}> Go back</Text>
            </Text>
            </Pressable>
            </View>
        </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 50,
        flex: 1,
      },
      item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        fontSize: 32,
        // marginTop: 5,
      },
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
export default Reservation
