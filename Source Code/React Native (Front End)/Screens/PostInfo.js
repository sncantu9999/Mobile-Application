import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import { getStorage, ref, uploadBytes } from "firebase/storage";


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

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
        Alert.alert("An error occured. Unable to gather posts.")
      })
},[refreshing, taken])


const submitPost = async (id) => {

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
const storeImage = async (uri, name) => {
  const imageRef = ref(storage, `images/${name}`);
  const response = await fetch(uri);
  const blob = await response.blob();
  uploadBytes(imageRef, blob).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}
console.log(route.params.uri)
storeImage(route.params.uri, `${id}.png`)
  .then(() => {
    console.log('Image was uploaded to Firebase');
  })
  .catch(error => {
    console.error('Error uploading image to Firebase', error);
  });
  }

function repost() {
  const id = makeid(50)
  submitPost(id)
  const date = new Date();
  date.setHours(date.getHours() +2);
  let body = JSON.stringify({
    'id' : id,
    'header_text': route.params.header_text,
    'body_text': route.params.body_text,
    'produceremail': userObj.email,
    'date_exp': date,
    'city': route.params.city,
    'street': route.params.street,
    'state': route.params.state,
    'country': route.params.country,
    'zipcode': route.params.zipcode,
  })

  fetch(`${domain}/api/auth/posts/`, {
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
      Alert.alert("Reposted!")
      navigation.navigate("ListingPage")
    })
    .catch(error => {
      console.log(error)
      Alert.alert("An error occured. Unable to repost.")
    })

}
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
              {route.params.header_text}
            </Text>
            {userObj.email != route.params.produceremail ?
            <Text style = {styles.username}> I'm still available {userObj.first_name}...</Text>:null}
            <Text></Text>
            <View>
            <View style = {styles.container}>
            <Text>{route.params.body_text}</Text>
            <Text></Text>
            <Text>Pick Up Location: {"\n"} 
            {route.params.street} {route.params.city}, {route.params.state} {route.params.zipcode}
            </Text>
            <Text></Text>
            <Text>I was made by {route.params.produceremail}</Text>
            {route.params.recieveremail != null ?
            <Text>Current Reciever: {route.params.recieveremail} </Text>
            :
            null
            }
            <Text></Text>
            </View>
            {route.params.link != "" ? <View><Image source={{ uri: route.params.link }} style={{ width: 400, height: 300 }}/><Text></Text></View> : <Text></Text>}
            {taken === false && route.params.produceremail != userObj.email && route.params.complete === "No" ?
            <Pressable style = {styles.loginScreenButton3} onPress = {() => changeReciever(userObj.email)}>
            <Text style = {styles.loginText}>
                Reserve Listing
            </Text>
            </Pressable> : null}
            {route.params.produceremail === userObj.email ?
            <TouchableOpacity style={styles.loginScreenButton1} onPress = {() => navigation.navigate("ReviewPage", route.params)}>
            <Text style={styles.loginText}>Your Reviews</Text>
            </TouchableOpacity>:
            <TouchableOpacity style={styles.loginScreenButton1} onPress = {() => navigation.navigate("ReviewPage", route.params)}>
            <Text style={styles.loginText}>Chef Reviews</Text>
            </TouchableOpacity>}
            {route.params.produceremail === userObj.email ?
            <View>
            {route.params.complete === "No" ?
            <TouchableOpacity style={styles.loginScreenButton3} onPress = {() => navigation.navigate("EditPost", route.params)} >          
            <Text style={styles.loginText}>Edit Post</Text>
            </TouchableOpacity>:null}
            {route.params.complete === "No" && route.params.recieveremail != null ? 
            <TouchableOpacity style={styles.lightred} onPress = {() => navigation.navigate("ResolvePost", route.params)}>
            <Text style={styles.loginText}>Order picked up? Click here</Text>
            </TouchableOpacity>
            :
            null}
            {route.params.complete === "Yes" ?
            <View>
            <Pressable style = {styles.lightpurple} onPress = {() =>  navigation.navigate("Repost", route.params)}>
            <Text style = {styles.loginText}>
              Repost
            </Text>
            </Pressable> 
            <View style = {styles.container }>
              <Text></Text>
            <Text>Order is Resolved </Text>
            <Text>Listing was Picked Up by: {route.params.oldreciever} </Text>
            </View>
            </View>
            :
            <View>
            <Pressable style = {styles.lightpurple} onPress = {() => deletepost()}>
            <Text style = {styles.loginText}>
                Delete Post
            </Text>
            </Pressable> 
            </View>
            }
            </View>
            :<TouchableOpacity style={styles.lightpurple} onPress = {() => navigation.navigate("CreateReview", route.params)}>
            <Text style = {styles.loginText}>Leave a Review</Text>
            </TouchableOpacity>}
            {route.params.recieveremail === userObj.email ?
            <Pressable style = {styles.btn} onPress = {() => changeReciever(null)}>
            <Text style = {styles.loginText}>
                Cancel Reservation
            </Text>
            </Pressable> : null}
            <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("ListingPage", route.params)}>
            <Text style = {{fontSize : 15, marginTop :10}}>
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
    marginLeft : 20,
    marginRight : 20,
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
  marginLeft : 95,
  marginTop : 20,
  fontSize : 18
  

},
lightpurple : {
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#BF40BF',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff' 
},
lightred : {
  marginRight:100,
  marginLeft:100,
  marginTop:10,
  paddingTop:30,
  paddingBottom:30,
  backgroundColor:'#D70040',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff' 
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
  // color:'#fff',
  fontSize : 16,
  textAlign:'center',
  // paddingLeft : 10,
  // paddingRight : 10
    }
})
export default PostInfo
