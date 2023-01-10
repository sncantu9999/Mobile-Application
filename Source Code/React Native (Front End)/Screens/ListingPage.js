import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView, DatePickerIOS } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import { BaseNavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase/app';
import { getStorage, ref, list, getDownloadURL, listAll, getBlob, getBytes } from "firebase/storage";
import { path } from 'pod/lib/conf';

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
  const [imagess, setImages] = useState([]);
  const [theurls, setUrls] = useState([]);

  function find_urls(listings) {
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
  setUrls(largeurls)
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
    find_urls(listings)
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
          const my_posts = json.filter(listing => listing.produceremail === userObj.email)
          if(my_posts.length > 0) {setHasPosts(true)}
          const filtered = json.filter(listing => listing.complete === "No" && listing.recieveremail === null)
          setListings(filtered)
          let currRes = false
          for(i in json){
            if(json[i].recieveremail === userObj.email){
              currRes = true
            }
          }
          setHasReservation(currRes)
      })
      .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to gather posts.")
      })
},[refreshing, imagess, theurls, hasposts, hasreservation])

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
        console.log(error)
      })
  },[refreshing, producer])

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
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';
    let item_url = ""
    theurls.forEach(url => {
      if(url.substring(77, 127) === item.id) {
        item_url = url
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
          console.log(item)
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
            Welcome to EcoFoodie!
        </Text>
        <Text style = {styles.username}>Hello {userObj.first_name} {userObj.last_name}</Text>
        <Text></Text>
        {hasreservation ?
        <View>
        <TouchableOpacity style={styles.loginScreenButton3}  onPress = {() => navigation.navigate("Reservation")}>
        <Text style={styles.loginText}>View Reservation</Text>
        </TouchableOpacity>
        </View>
        :
        null
        }
        {hasposts ?
        <View>
        <TouchableOpacity style={styles.loginScreenButton} onPress = {() => navigation.navigate("ManagePosts")} >
          <Text style={styles.loginText}>Manage Posts</Text>
        </TouchableOpacity>
        </View>
        :
        null
        }
        {producer ? 
        <TouchableOpacity style={styles.loginScreenButton2} onPress = {() => navigation.navigate("CreatePost")}>
        <Text style={styles.loginText}>Create Posts</Text>
        </TouchableOpacity>
        :<TouchableOpacity style={styles.loginScreenButton} onPress = {() => navigation.navigate("CreateProducer")}>
        <Text style={styles.loginText}>Become a producer</Text>
        </TouchableOpacity>}
        <TouchableOpacity style={styles.loginScreenButton1} onPress = {() => navigation.navigate("OrderHistory")} >          
          <Text style={styles.loginText}>Order History</Text>
        </TouchableOpacity>
        <View style = {styles.container}>
        <Text style = {styles.available}>Available Listings </Text>
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
textbox : {
  height : 200
},
username : {
  fontFamily: "trebuchet-ms-regular",
  marginLeft : 105,
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
  backgroundColor:'#228B22',
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

export default ListingPage
