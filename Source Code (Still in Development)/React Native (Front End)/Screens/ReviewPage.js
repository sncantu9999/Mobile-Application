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
  </TouchableOpacity>
);

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function ReviewPage({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
  const [selectedId, setSelectedId] = useState(null);
  const [reviews, setReviews] = useState([])
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetch(`${domain}/api/auth/reviews/`, {
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
            const filtered = json.filter(review => review.produceremail === route.params.produceremail)
            console.log(filtered)
            setReviews(filtered)
        })
        .catch(error => {
        //   console.log('hi')
          // console.log(error)
          Alert.alert("An error occured. Unable to gather listings.")
        })
  },[refreshing, reviews])
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
          console.log(item)
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
            Shop Reviews:
        </Text>
        <Text>Welcome {userObj.first_name} {userObj.last_name}</Text>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("PostInfo", route.params)}>
            <Text style = {styles.alttxt}>
                I changed my mind
                <Text style = {{color: 'blue'}}> Go back</Text>
            </Text>
        </Pressable>
        <View style = {styles.container}>
        {reviews.length != 0 ?
        <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 20}}>No Reviews Found</Text>}
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
export default ReviewPage
