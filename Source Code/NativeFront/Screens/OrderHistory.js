import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import { BaseNavigationContainer } from '@react-navigation/native';
import * as firebase from 'firebase/app';
import { getStorage, ref, list, getDownloadURL, listAll, getBlob, getBytes } from "firebase/storage";

const Item = ({ item, month, year, day, item_url, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.header_text}</Text>
      <Text></Text>
     {item_url != "" ? <Image source={{ uri: item_url }} style={{ width: 265, height: 250 }}/> : null}
     <Text></Text>
     <Text style={[styles.title, textColor]}>{item.street}</Text>
      <Text style={[styles.title, textColor]}>{item.city}, {item.state}</Text>
      <Text style={[styles.title, textColor]}>{item.country}</Text>
      <Text style={[styles.title, textColor]}>{item.zipcode}</Text>
      <Text style={[styles.title, textColor]}>Picked up on {month}/{day}/{year}</Text>
    </TouchableOpacity>
);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function OrderHistory({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
  const [selectedId, setSelectedId] = useState(null);
  const [posts, setPosts] = useState([])
  const [hasposts, setHasPosts] = useState(false)
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
    find_urls(posts)
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
            console.log(userObj.email)
            console.log(userObj.email)
            const history = json.filter(post => post.oldreciever === userObj.email)
            setPosts(history)
            if(history.length > 0) {
              setHasPosts(true)
            }
        })
        .catch(error => {
          Alert.alert("An error occured. Unable to gather posts.")
        })
  },[refreshing, imagess, theurls, hasposts])

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
    let month = item.date_finish.substring(5,7)
    let year = item.date_finish.substring(0,4)
    let day = item.date_finish.substring(8,10)
    return (
      <Item
        item={item}
        month = {month}
        year = {year}
        day = {day}
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
            Order History
        </Text>
        <Text style = {styles.username}>Aloha {userObj.first_name} {userObj.last_name}</Text>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage")}>
            <Text style = {{fontSize : 15, marginLeft : 90, marginTop :10}}>
                I changed my mind
                <Text style = {{color: 'blue'}}> Go back</Text>
            </Text>
        </Pressable>
        <View style = {styles.container}>
        {/* {console.log("Booooooooooooooooooooo: \n")} */}
        {hasposts ?
        <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 20, marginLeft : 45}}>No Completed Orders</Text>}
        </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(38,154,144,1)",
    marginTop : 30,
    padding: 50,
    flex: 1,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    fontSize: 40,
    marginTop: 10,
    textAlign: "center",
  },
header : {
    fontFamily: "trebuchet-ms-regular",
    fontSize : 35,
    marginLeft : 90,
    marginTop : 20
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
username : {
  fontFamily: "trebuchet-ms-regular",
  marginLeft : 105,
  marginTop : 20,
  fontSize : 18},
logo : {
    width : '20%',
    alignSelf : 'flex-start',
    marginTop : -10,
    position : 'absolute'
}
})
export default OrderHistory
