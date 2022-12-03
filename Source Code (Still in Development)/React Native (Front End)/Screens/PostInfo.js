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


function PostInfo({ navigation, route, props }){
    console.log("Passed: ")
    console.log(route.params)
    const {height} = useWindowDimensions()
    const globalContext = useContext(Context)
    const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
    const [selectedId, setSelectedId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [taken, setTaken] = useState(false);
    
  function deletepost() {
    fetch(`${domain}/api/auth/posts/${route.params.id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
    })
    .then(json => {
        Alert.alert("Post Deleted!")
        navigation.navigate("ListingPage")
    })
    .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to make post.")
    })
}

useEffect(() => {
  fetch(`${domain}/api/auth/posts/${route.params.id}`, {
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
          if (json.recieveremail != null) {setTaken(true)}
      })
      .catch(error => {
      //   console.log('hi')
        // console.log(error)
        Alert.alert("An error occured. Unable to gather posts.")
      })
},[refreshing, taken])

function changeReciever(user) {
    let body = JSON.stringify({
        'header_text': route.params.header_text,
        'body_text': route.params.body_text,
        'produceremail': route.params.produceremail,
        'date_exp': route.params.date_exp, //current date plus 2 hours would actually be custom based on what food it is
        'city': route.params.city,
        'street': route.params.street,
        'state': route.params.state,
        'country': route.params.country,
        'zipcode': route.params.zipcode,
        'recieveremail': user,
      })
  
      fetch(`${domain}/api/auth/posts/${route.params.id}`, {
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
                Post Information
            </Text>
            <Text>Welcome {userObj.first_name} {userObj.last_name}</Text>
            <View>
            <Text>{route.params.header_text}</Text>
            <Text>{route.params.body_text}</Text>
            <Text>Date of Expiration: {route.params.date_exp}</Text>
            <Text>Delivery Location: {[route.params.street, route.params.city, route.params.state, route.params.country, route.params.zipcode]}</Text>
            <Text>Producer: {route.params.produceremail}</Text>
            {route.params.recieveremail != null ?
            <Text>Current Reciever: {route.params.recieveremail} </Text>
            :
            null
            }
            <Button title = "Shop Reviews" onPress = {() => navigation.navigate("ReviewPage", route.params)}/>
            <Text></Text>
            {route.params.produceremail === userObj.email ?
            <View>
            <Button title = "Edit Post" onPress = {() => navigation.navigate("EditPost", route.params)}/>
            <Text></Text>
            {route.params.complete === "No" && route.params.recieveremail != null ? 
            <Button title = "Order picked up? Resolve here" onPress = {() => 
              navigation.navigate("ResolvePost", route.params)}/>
            :
            null}
            {route.params.complete === "Yes" ?
            <View>
            <Text>Order is Resolved </Text>
            <Text>Listing was Picked Up by: {route.params.oldreciever} </Text>
            </View>
            :
            <View>
            <Text></Text>
            <Pressable style = {styles.btn} onPress = {() => deletepost()}>
            <Text style = {styles.txt}>
                Delete Post
            </Text>
            </Pressable> 
            </View>
            }
            </View>
            :<Button title = "Leave a Review" onPress = {() => navigation.navigate("CreateReview", route.params)}/>}
            {taken === false && route.params.produceremail != userObj.email && route.params.complete === "No" ?
            <Pressable style = {styles.btn} onPress = {() => changeReciever(userObj.email)}>
            <Text style = {styles.txt}>
                Reserve Listing
            </Text>
            </Pressable> : null}
            {route.params.recieveremail === userObj.email ?
            <Pressable style = {styles.btn} onPress = {() => changeReciever(null)}>
            <Text style = {styles.txt}>
                Cancel Reservation
            </Text>
            </Pressable> : null}
            <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage", route.params)}>
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
export default PostInfo
