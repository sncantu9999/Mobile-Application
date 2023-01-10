// import React, {useState} from 'react'
// import {StyleSheet, Text, View, Image, useWindowDimensions, Pressable, Alert} from 'react-native';
// import {TextInput, Button} from 'react-native-paper'
import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import { BaseNavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase/app';
import { getStorage, ref, list, getDownloadURL, listAll, getBlob, getBytes } from "firebase/storage";
import { path } from 'pod/lib/conf';

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
  const [imagess, setImages] = useState([]);
  const [theurls, setUrls] = useState([]);
  const [completeurls, setCompleteUrls] = useState([]);

  const Item = ({ item, item_url, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.header_text}</Text>
      <Text></Text>
     {item_url != "" ? <Image source={{ uri: item_url }} style={{ width: 265, height: 250 }}/> : null}
     <Text></Text>
     <Text style={[styles.title, textColor]}>{item.street}</Text>
      <Text style={[styles.title, textColor]}>{item.city}, {item.state}</Text>
      <Text style={[styles.title, textColor]}>{item.country}</Text>
      <Text style={[styles.title, textColor]}>{item.zipcode}</Text>
      {item.recieveremail != null ?
      <Text style={[styles.title, textColor]}>Current Reciever: {item.recieveremail}</Text>
      :
      null
      }
    </TouchableOpacity>
  );

  function find_urls(listings, type) {
    const largeurls = []
    listings.forEach(async item => {
    const url = imagess.filter(im => im.substring(7, im.length-4) === item.id)
    if (url.length > 0) {
    const stor = getStorage()
    await getDownloadURL(ref(stor, url[0])).then(bigurl => {
      console.log("BIG BOY")
      console.log(bigurl)
      largeurls.push(bigurl)
    })
    .catch(error => console.log(error))
  }})
  if(type === "active") {
    setUrls(largeurls)
  }
  else {setCompleteUrls(largeurls)}
  }

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
      console.log(res.items)
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
    find_urls(active, "active")
    find_urls(complete, "complete")
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
            const filtered = json.filter(post => post.produceremail === userObj.email)
            const complete = json.filter(post => post.complete === "Yes" && post.produceremail === userObj.email)
            const active = json.filter(post => post.complete === "No" && post.produceremail === userObj.email)
            setActive(active)
            setComplete(complete)
            // console.log(filtered)
            setPosts(filtered)
        })
        .catch(error => {
          Alert.alert("An error occured. Unable to gather listings.")
        })
  },[refreshing, imagess, theurls])

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';
    let item_url = ""
    theurls.forEach(url => {
      if(url.substring(77, 127) === item.id) {
        item_url = url
      }
    })
    completeurls.forEach(compurl => {
      if(compurl.substring(77, 127) === item.id) {
        item_url = compurl
      }
    })
    let params = item
    params.link = item_url
    return (
      <Item
        item={item}
        item_url = {item_url}
        onPress={() => {
          setSelectedId(item.id)
        //   console.log(item)
          navigation.navigate("PostInfo", params)
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
            Your Posts
        </Text>
        <Text style = {styles.username}>Welcome {userObj.first_name} {userObj.last_name}</Text>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage")}>
            <Text style = {styles.alttxt}>
                I changed my mind
                <Text style = {{color: 'blue'}}> Go back</Text>
            </Text>
        </Pressable>
        <View style = {styles.container}>
        {/* {console.log("Booooooooooooooooooooo: \n")} */}
        <Text style = {styles.activetext}>Active: </Text>
        {active.length != 0 ?
        <FlatList
        data={active}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 20}}>No Active Posts</Text>}
        <Text></Text>
        <Text style = {styles.activetext}>Complete: </Text>
        {complete.length != 0 ?
        <FlatList
        data={complete}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 15, marginLeft : 20, marginTop : 10}}>No Resolved Posts</Text>}
        </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
        
    backgroundColor: "rgba(38,154,144,1)",
    padding: 40,
    marginTop : 20,
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
activetext:{
  fontFamily: "trebuchet-ms-regular",
  fontSize : 20

},
textbox : {
  height : 200
},
username : {
  fontFamily: "trebuchet-ms-regular",
  marginLeft : 110,
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
  marginLeft : 75,       
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
export default ManagePosts
