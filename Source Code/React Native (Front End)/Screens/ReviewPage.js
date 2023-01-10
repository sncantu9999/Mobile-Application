import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

const Item = ({ item, month, year, day, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[{fontSize: 18, fontWeight : 'bold'}]}>{item.header_text}</Text>
    <Text></Text>
    <Text style={[styles.title, textColor]}>{item.body_text}</Text>
    <Text></Text>
    <Text style={[styles.title, textColor]}>Rating: {item.number_of_stars} (out of 5)</Text>
    <Text></Text>
    <Text style={[styles.title, textColor]}>Reviewer: {item.useremail}</Text>
    <Text></Text>
    <Text style={[styles.title, textColor]}>Producer: {item.produceremail}</Text>
    <Text></Text>
    <Text style={[styles.title, textColor]}>Review was submitted on {month}/{day}/{year}  </Text>

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
          Alert.alert("An error occured. Unable to gather listings.")
        })
  },[refreshing])

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';
    let month = item.date.substring(5,7)
    let year = item.date.substring(0,4)
    let day = item.date.substring(8,10)
    return (
      <Item
        item={item}
        month = {month}
        year = {year}
        day = {day}
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
            Chef Reviews
        </Text>
        <Text style = {styles.username}>Reviews about {route.params.produceremail}'s cooking!</Text>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("PostInfo", route.params)}>
            <Text style = {{fontSize : 15, marginLeft : 95, marginTop :10, marginBottom : 30}}>
                I changed my mind
                <Text style = {{color: 'blue'}}> Go back</Text>
            </Text>
        </Pressable>
        <View style = {styles.container}>
        {/* {console.log("Booooooooooooooooooooo: \n")} */}
        {reviews.length != 0 ?
        <FlatList
        data={reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        /> 
        :<Text style = {{fontSize : 20, marginLeft : 60}}>No Reviews Found</Text>}
        {/* <RenderArray /> */}
        </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(38,154,144,1)",
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
    marginLeft : 85,
    marginTop : 20,
    marginBottom : 20
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

username : {
  fontFamily: "trebuchet-ms-regular",
  marginLeft : 30,
  marginTop : 10,
  fontSize : 16},
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
