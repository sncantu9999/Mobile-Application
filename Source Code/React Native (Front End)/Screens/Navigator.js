import React, {useContext} from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { Context } from "./globalContext"
import SignIn  from "./SignIn"
import CreateAccount from "./CreateAccount"
import  ListingPage  from "./ListingPage"
import  CreateProducer  from "./CreateProducer"
import  CreatePost  from "./CreatePost"
import  PostInfo  from "./PostInfo"
import EditPost from "./EditPost";
import CreateReview from "./CreateReview";
import ReviewPage from "./ReviewPage";
import Reservation from "./Reservation";
import ManagePosts from "./ManagePosts";
import ResolvePost from "./ResolvePost";
import OrderHistory from "./OrderHistory";
import Map from "./Map";
import Repost from "./Repost";

const Stack = createStackNavigator();

function Navigator(props) {

  const globalContext = useContext(Context)
  const { isLoggedIn, userObj } = globalContext

  return(
    <Stack.Navigator initialRouteName="SignIn">
    {(!isLoggedIn || !userObj)?
      <>
      <Stack.Screen name = "SignIn" component = {SignIn} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreateAccount" component = {CreateAccount} options = {{headerShown : false}}/>
      </>
      :
      <>
      <Stack.Screen name = "ListingPage" component = {ListingPage} options = {{headerShown : false}}/> 
      <Stack.Screen name = "CreateProducer" component = {CreateProducer} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreatePost" component = {CreatePost} options = {{headerShown : false}}/>
      <Stack.Screen name = "PostInfo" component = {PostInfo} options = {{headerShown : false}}/>
      <Stack.Screen name = "EditPost" component = {EditPost} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreateReview" component = {CreateReview} options = {{headerShown : false}}/>
      <Stack.Screen name = "ReviewPage" component = {ReviewPage} options = {{headerShown : false}}/>
      <Stack.Screen name = "Reservation" component = {Reservation} options = {{headerShown : false}}/>
      <Stack.Screen name = "ManagePosts" component = {ManagePosts} options = {{headerShown : false}}/>
      <Stack.Screen name = "ResolvePost" component = {ResolvePost} options = {{headerShown : false}}/>
      <Stack.Screen name = "OrderHistory" component = {OrderHistory} options = {{headerShown : false}}/>
      <Stack.Screen name = "Map" component = {Map} options = {{headerShown : false}}/>
      <Stack.Screen name = "Repost" component = {Repost} options = {{headerShown : false}}/>
      </>
      
    }

    </Stack.Navigator>

  )



}


export default Navigator;