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

function CalculateAvgRating({ navigation, route, props, post }){
    console.log("post: ")
    console.log(post)
    const {height} = useWindowDimensions()
  const globalContext = useContext(Context)
  const { setIsLoggedIn, domain, userObj, setUserObj} = globalContext;
  const [selectedId, setSelectedId] = useState(null);
  const [reviews, setReviews] = useState([])
  const [producer, setProducer] = useState([])
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
            // console.log("Passed: ")
            // console.log(json)   
            // setListings(json)
            
            // {json.map(listing => {
            // console.log(listing)
            // })}
            // console.log(json)
            setReviews(json)
        })
        .catch(error => {
          console.log(error)
        //   Alert.alert("An error occured. Unable to gather reviews.")
        })
  },[],
  fetch(`${domain}/api/auth/producers/${route.params.produceremail}`, {
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
        // setListings(json)
        
        // {json.map(listing => {
        // console.log(listing)
        // })}
        // console.log(json)
        setProducer(json)
    })
    .catch(error => {
      console.log(error)
    //   Alert.alert("An error occured. Unable to gather reviews.")
    },[])
  )
  function updateRating(avg_rating) {
    let body = JSON.stringify({
      'SSN': producer[0].ssn,
      'avg_rating': avg_rating,
      'num_pickups': producer[0].num_pickups,
      //make a field called refrigerated if refrigerated
      'email': producer[0].email, //current date plus 2 hours would actually be custom based on what food it is
    })

    fetch(`${domain}/api/auth/producers/${route.params.produceremail}`, {
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
        console.log("Passed: ")
        console.log(json)
      })
      .catch(error => {
        console.log(error)
        console.log("An error occured. Unable to leave review.")
      })

  }
  let count = 0
  let total = 0
  const appropriate_reviews = reviews.filter(review => {if (review.produceremail === post.produceremail) {
    curr = parseInt(review.number_of_stars)
    if(curr == NaN) {curr = parseFloat(review.number_of_stars)}
    if(curr != NaN) {
        count += curr
        total += 1}
  }})
  const avg_rating = count/total
  updateRating(avg_rating)
  return
}
export default CalculateAvgRating
