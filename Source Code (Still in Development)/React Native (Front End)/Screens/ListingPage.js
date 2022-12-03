// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView, DatePickerIOS } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import MyTabs from './tabnavigation'
import { BaseNavigationContainer } from '@react-navigation/native';

function compare_dates(item) {
  console.log('CHECK')
  console.log(item.date_exp)
  d = new Date(item.date_exp)
  console.log(d.getTime())
  return d.getTime() > new Date().getTime()
}
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <View>
    {/* {item.recieveremail === null && compare_dates(item) ? */}
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.header_text}</Text>
    <Text style={[styles.title, textColor]}>{item.body_text}</Text>
    <Text style={[styles.title, textColor]}>{item.city}</Text>
    <Text style={[styles.title, textColor]}>{item.street}</Text>
    <Text style={[styles.title, textColor]}>{item.state}</Text>
    <Text style={[styles.title, textColor]}>{item.country}</Text>
    <Text style={[styles.title, textColor]}>{item.zipcode}</Text>
    <Text style={[styles.title, textColor]}>{item.produceremail}</Text>
  </TouchableOpacity>
  {/* : null} */}
  </View>
);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function ListingPage({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
  const [selectedId, setSelectedId] = useState(null);
  const [producer, setProducer] = useState(false)
  const [hasreservation, setHasReservation] = useState(false)
  const [hasposts, setHasPosts] = useState(false)
  const [listings, setListings] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("hello")
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
          const my_posts = json.filter(listing => listing.produceremail === userObj.email)
          if(my_posts.length > 0) {setHasPosts(true)}
          const filtered = json.filter(listing => listing.complete === "No" && listing.recieveremail === null)
          setListings(filtered)
          let currRes = false
          for(i in json){
            // console.log(json[i])
            if(json[i].recieveremail === userObj.email){
              currRes = true
              // console.log("checked")
            }
          }
          setHasReservation(currRes)
      })
          // console.log(json)
      .catch(error => {
        console.log(error)
        // console.log(error)
        Alert.alert("An error occured. Unable to gather posts.")
      })
},[refreshing, listings, hasposts, hasreservation])

  useEffect(() => {
    fetch(`${domain}/api/auth/producers/${userObj.email}`, {
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
          setProducer(true)
      })
      .catch(error => {
      //   console.log('hi')
        console.log(error)
        // Alert.alert("An error occured. Unable to gather producers.")
      })
  },[refreshing, producer])
  
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';
  
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id)
          console.log(item)
          navigation.navigate("PostInfo", item)
        }
        }
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      nestedScrollEnabled={true} 
      refreshControl={
      <RefreshControl refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true)
          wait(2000).then(() => setRefreshing(false))
        }} />
      }>  
    <View>
        <Text style = {styles.header}>
            Listings Available Near You
        </Text>
        <Text>Welcome {userObj.first_name} {userObj.last_name}</Text>
        <Text></Text>
        {hasreservation ?
        <View>
        <Button title = "View Reservation" onPress = {() => navigation.navigate("Reservation")}/>
        <Text></Text>
        </View>
        :
        null
        }
        {hasposts ?
        <View>
        <Button title = "Manage Posts" onPress = {() => navigation.navigate("ManagePosts")}/>
        <Text></Text>
        </View>
        :
        null
        }
        {producer ? 
        <Button title = "Create Post" onPress = {() => navigation.navigate("CreatePost")}/>
        :<Button title = "Become a Producer" onPress = {() => navigation.navigate("CreateProducer")}/>}
        <Text></Text>
        <Button title = "View Order History" onPress = {() => navigation.navigate("OrderHistory")}/>
        <View style = {styles.container}>
        <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        />
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

export default ListingPage
