import Logo from '../assets/Images/newlogo.png'
import React, { useContext, useState, useEffect } from 'react';
import {RefreshControl, Alert, FlatList, StyleSheet, Pressable, View, Text, Image, TouchableOpacity, useWindowDimensions, Button, List, ListItem, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Context } from './globalContext';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function ResolvePost({ navigation, route, props }) {
    const {height} = useWindowDimensions()
    const globalContext = useContext(Context)
    const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
    const [selectedId, setSelectedId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    
    const date = new Date()
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
      'date_uploaded' : route.params.date_uploaded,
      'oldreciever': route.params.recieveremail,
      'recieveremail' : null,
      'group_directed' : route.params.group_directed,
      'complete': "Yes",
      'date_finish' : date
    })

    fetch(`${domain}/api/auth/posts/${route.params.id}`, {
      method: 'PUT',
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
        Alert.alert("Post Resolved!")
        navigation.navigate("ManagePosts")
      })
      .catch(error => {
        console.log(error)
        Alert.alert("An error occured. Unable to resolve posts.")
      })
      return
  }

  export default ResolvePost