import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import { BaseNavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase/app';
import { getStorage, ref, list, getDownloadURL, listAll, getBlob, getBytes } from "firebase/storage";

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
    const [imagess, setImages] = useState([]);
    const [link, setLink] = useState("");
  
    const getSampleImage = () => {
      const firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: '',
        projectId: "",
        storageBucket: "",
        messagingSenderId: ""
      };
      firebase.initializeApp(firebaseConfig);
      const storage = getStorage(firebase.getApp())
      const listRef = ref(storage, 'images/');
      listAll(listRef)
      .then((res) => {
        const paths = res.items.map(item => item._location.path_)
        setImages(paths)
      }).catch((error) => {
        console.log(error)
      });
    }
  
    useEffect(()=>{
    getSampleImage()
    },[refreshing])
  
    useEffect(() => {
      const url = imagess.filter(im => im.substring(7, im.length-4) === reservation.id)
      if (url.length > 0) {
        const stor = getStorage()
        getDownloadURL(ref(stor, url[0])).then(bigurl => {
          setLink(bigurl)
        })
        .catch(error => console.log(error))
        // console.log(url)
      }
    },[refreshing])

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
          })
      },[refreshing, imagess, link])

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
            <Text style = {styles.username}>Enjoy {userObj.first_name}!</Text>
            <View style = {styles.container}>
            <Text style = {styles.dateofexp}>{reservation.header_text}</Text>
            <Text style = {styles.dateofexp}>{reservation.body_text}</Text>
            <Text></Text>
            <Text style = {styles.dateofexp}>Pick Up Location: {"\n"} 
            {reservation.street} {reservation.city}, {reservation.state} {reservation.zipcode}
            </Text>
            <Text></Text>
            <Text style = {styles.dateofexp}>I was made by {reservation.produceremail}</Text>
            <Text></Text>
            {link != "" ? <View><Image source={{ uri: link }} style={{ width: 360, height: 300 }}/><Text></Text></View> : <Text></Text>}
            <TouchableOpacity style={styles.loginScreenButton1} onPress = {() => navigation.navigate("Map", reservation)}>
            <Text style={styles.loginText}>Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginScreenButton2} onPress = {() => changeReciever(null)}>
            <Text style={styles.loginText}>Cancel Reservation</Text>
            </TouchableOpacity>
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
    marginTop : 20,
    marginLeft: 10,
    flex: 1
  },
  item: {
    padding: 20,
    marginVertical: 8,
    fontSize: 40,
    marginTop: 10,
    textAlign: "center",
  },
header : {
    fontFamily: "trebuchet-ms-regular",

    fontSize : 30,
    marginTop  : 40,
    textAlign: "center"
},
textbox : {
  height : 200
},
username : {
  fontFamily: "trebuchet-ms-regular",
  marginLeft : 140,
  marginTop : 20,
  fontSize : 18
  

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
available : {
  fontFamily: "trebuchet-ms-regular",
  marginLeft : 80,       
  fontSize : 20,
  fontWeight : 'bold',
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
},
loginScreenButton:{
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#1E6738',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},
loginScreenButton1:{
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#387CE3',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},
loginScreenButton3:{
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#E36D2F',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},
loginScreenButton4:{
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#387CE3',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},
title : {
  fontSize: 16
},
loginScreenButton2:{
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#7600bc',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
},
loginText:{
  fontFamily: "trebuchet-ms-regular",
  color:'#fff',
  fontSize : 18,
  textAlign:'center',
  paddingLeft : 10,
  paddingRight : 10
    }
})
export default Reservation
