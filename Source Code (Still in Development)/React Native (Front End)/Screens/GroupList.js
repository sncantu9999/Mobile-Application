import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';
import MyTabs from './tabnavigation'
import { BaseNavigationContainer } from '@react-navigation/native';




const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function GroupList({ navigation, route, props }){
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
  const [selectedId, setSelectedId] = useState(null);
  const [members, setMembers] = useState([])
  const [refreshing, setRefreshing] = useState(false);
    
const deleteMember = (item) => {
    console.log("pressed")
    fetch(`${domain}/api/auth/groups/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        })
        .then(json => {
            Alert.alert("Member Removed")
        })
        .catch(error => {
          Alert.alert("An error occured. Unable to remove member.")
        })
  }
  const Item = ({ item, backgroundColor, textColor }) => (
    <Pressable onPress={() => deleteMember(item)} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{item.useremail}</Text> 
      <Text></Text>
    <Button title = "Delete" onPress = {() => deleteMember(item)}/>
    </Pressable>
  );
  useEffect(() => {
    fetch(`${domain}/api/auth/groups/`, {
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
            const filtered = json.filter(member => member.admin === userObj.email)
            setMembers(filtered)
        })
        .catch(error => {
          Alert.alert("An error occured. Unable to gather members.")
        })
  },[refreshing, members])
  
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
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
      refreshControl={
      <RefreshControl refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true)
          wait(2000).then(() => setRefreshing(false))
        }} />
      }>  
    <View>
        <Text style = {styles.header}>
            Your Group Members
        </Text>
        <Text>Welcome {userObj.first_name} {userObj.last_name}</Text>
        <Text></Text>
        <View style = {styles.container}>
        <FlatList
        data={members}
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
        margin : '0%',
        padding: 15,
        marginVertical: 0,
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
export default GroupList
