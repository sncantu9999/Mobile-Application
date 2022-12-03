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

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.header_text}</Text>
    <Text style={[styles.title, textColor]}>{item.body_text}</Text>
    <Text style={[styles.title, textColor]}>{item.date}</Text>
    <Text style={[styles.title, textColor]}>Number of Stars: {item.number_of_stars} (out of 5)</Text>
    <Text style={[styles.title, textColor]}>Reviewer: {item.useremail}</Text>
    <Text style={[styles.title, textColor]}>{item.country}</Text>
    <Text style={[styles.title, textColor]}>Producer: {item.produceremail}</Text>
    {item.recieveremail != null ?
    <Text style={[styles.title, textColor]}>Current Reciever: {item.recieveremail}</Text>
    :
    null
    }
  </TouchableOpacity>
);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function ManagePosts({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
  const [selectedId, setSelectedId] = useState(null);
  const [posts, setPosts] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState([]);
  const [complete, setComplete] = useState([]);

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
            const filtered = json.filter(post => post.produceremail === userObj.email)
            const complete = json.filter(post => post.complete === "Yes" && post.produceremail === userObj.email)
            const active = json.filter(post => post.complete === "No" && post.produceremail === userObj.email)
            setActive(active)
            setComplete(complete)
            // console.log(filtered)
            setPosts(filtered)
        })
        .catch(error => {
        //   console.log('hi')
          // console.log(error)
          Alert.alert("An error occured. Unable to gather listings.")
        })
  },[refreshing, posts])
  // console.log("Listings: \n")
  // console.log(listings)

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id)
        //   console.log(item)
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
      nestedScrollEnabled = {true}
      refreshControl={
      <RefreshControl refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true)
          wait(2000).then(() => setRefreshing(false))
        }} />
      }>  
    <View>
        <Text style = {styles.header}>
            My Posts:
        </Text>
        <Text>Welcome {userObj.first_name} {userObj.last_name}</Text>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage")}>
            <Text style = {styles.alttxt}>
                I changed my mind
                <Text style = {{color: 'blue'}}> Go back</Text>
            </Text>
        </Pressable>
        <View style = {styles.container}>
        <Text>Active: </Text>
        {active.length != 0 ?
        <FlatList
        data={active}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 20}}>No Active Posts</Text>}
        <Text></Text>
        <Text>Complete: </Text>
        {complete.length != 0 ?
        <FlatList
        data={complete}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 20}}>No Resolved Posts</Text>}
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
        margin : '2%',
        padding: 0,
        marginVertical: 0,
        marginTop: 20,
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
export default ManagePosts
