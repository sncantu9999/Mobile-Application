import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase/app';
import { getStorage, ref, deleteObject, uploadBytes } from "firebase/storage";
import * as Permissions from 'expo-permissions';

function Repost({ route, navigation, props }) {
    const {height} = useWindowDimensions()
    const globalContext = useContext(Context)
    const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
    const [header, setHeader] = useState(route.params.header_text)
    const [bodytxt, setBody] = useState(route.params.body_text)
    const [city, setCity] = useState(route.params.city)
    const [street, setStreet] = useState(route.params.street)
    const [state, setState] = useState(route.params.state)
    const [country, setCountry] = useState(route.params.country)
    const [zipcode, setZip] = useState(route.params.zipcode)
    const [producer, setProducer] = useState(route.params.produceremail)
    const [expdate, setExp] = useState(route.params.date_exp)
    const [image, setImage] = useState(null)
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);
    const [error, setError] = useState("")

    async function requestCameraPermission() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === 'granted') {
        takePhotoFromCamera()
      } else {
        Alert.alert("Please allow camera permission to take photos")
      }
    }
    
    const takePhotoFromCamera = async () => {
      const { status } = await Permissions.getAsync(Permissions.CAMERA);
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    } else {
      requestCameraPermission()
    }
    };
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };
  
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
  console.log(storage)
  
  const storeImage = async (uri, name) => {
    const imageRef = ref(storage, `images/${name}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    uploadBytes(imageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  }
  
  storeImage(image, `${id}.png`)
    .then(() => {
      console.log('Image was uploaded to Firebase');
    })
    .catch(error => {
      console.error('Error uploading image to Firebase', error);
    });
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
  function repost() {
    if(image === null) {
        Alert.alert("You must upload a photo")
      }
      else{    
    const id = makeid(50)
    submitPost(id)
    setError("")
    let body = JSON.stringify({
      'id' : id,
      'header_text': header,
      'body_text': bodytxt,
      'produceremail': producer,
      'date_exp': expdate,
      'city': city,
      'street': street,
      'state': state,
      'country': country,
      'zipcode': zipcode,
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
        Alert.alert("Posted!")
        navigation.navigate("ListingPage")
      })
      .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to make post.")
      })}}

  return (
    <View>
    <ScrollView>
    <View>
        <Text style = {styles.header}>
        </Text>
        <TextInput style = {styles.inputStyle}
            label = "Title"
            value = {header}
            onChangeText={text => setHeader(text)}
        />
        <TextInput style = {[styles.inputStyle, styles.textbox]}
            label = "Description"
            value = {bodytxt}
            multiline = {true}
            onChangeText={text => setBody(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "City"
            value = {city}
            onChangeText={text => setCity(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "State"
            value = {state}
            onChangeText={text => setState(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Street"
            value = {street}
            onChangeText={text => setStreet(text)}
        />
        <TextInput style = {styles.inputStyle}
            label = "Country"
            value = {country}
            onChangeText={text => setCountry(text)}
        />
        <TextInput style = {styles.inputStyle}
        label = "Zip Code"
        value = {zipcode}
        onChangeText={text => setZip(text)}
        />
        <Text>Replace Image by Taking or Choosing a New Photo</Text>
        <View style={styles.container}>
      <View>
        {image != null ? <View><Image source={{ uri: image }} style={{ width: 400, height: 300 }}/><Text></Text></View> : <Text></Text>}
        {uploading ? (
          <View>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          null
        )}
      </View>
      <View>
      <Pressable style = {styles.btn} onPress = {() => takePhotoFromCamera()}>
      <Text style = {styles.txt}>
        Take Photo
      </Text>
      </Pressable>
      <Pressable style = {styles.btn} onPress = {() => pickImage()}>
      <Text style = {styles.txt}>
        Choose Photo
      </Text>
      </Pressable>
      </View>
    </View>
    </View>
    <Pressable style = {styles.btn} onPress = {() => repost()}>
    <Text style = {styles.txt}>
        Post
    </Text>
    </Pressable>
    <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("PostInfo", route.params)}>
    <Text style = {styles.alttxt}>
        I changed my mind
        <Text style = {{color: 'blue'}}> Go back</Text>
    </Text>
    </Pressable>
    </ScrollView>
    </View>
  )}

export default Repost

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
