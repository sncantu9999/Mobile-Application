import React, {useContext} from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { Context } from "./globalContext"
import SignIn  from "./SignIn"
import CreateAccount from "./CreateAccount"
import  PasswordReset  from "./PasswordReset"
import  ListingPage  from "./ListingPage"
import  MapScreen  from "./MapScreen"
import  CreateProducer  from "./CreateProducer"
import  CreatePost  from "./CreatePost"
import  PostInfo  from "./PostInfo"
import EditPost from "./EditPost";
import CreateReview from "./CreateReview";
import ReviewPage from "./ReviewPage";
import CreateMember from "./CreateMember";
import GroupList from "./GroupList";
import Reservation from "./Reservation";
import ManagePosts from "./ManagePosts";
import ResolvePost from "./ResolvePost";
import OrderHistory from "./OrderHistory";
// import AddImage from "./AddImage";


// import Landing from '../screens/landing.js'
// import Login from '../screens/login.js'
// import Home from '../screens/home.js'

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
      <Stack.Screen name = "PasswordReset" component = {PasswordReset} options = {{headerShown : false}}/>
      </>
      :
      <>
      <Stack.Screen name = "ListingPage" component = {ListingPage} options = {{headerShown : false}}/> 
      <Stack.Screen name = "MapScreen" component = {MapScreen} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreateProducer" component = {CreateProducer} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreatePost" component = {CreatePost} options = {{headerShown : false}}/>
      <Stack.Screen name = "PostInfo" component = {PostInfo} options = {{headerShown : false}}/>
      <Stack.Screen name = "EditPost" component = {EditPost} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreateReview" component = {CreateReview} options = {{headerShown : false}}/>
      <Stack.Screen name = "ReviewPage" component = {ReviewPage} options = {{headerShown : false}}/>
      <Stack.Screen name = "CreateMember" component = {CreateMember} options = {{headerShown : false}}/>
      <Stack.Screen name = "GroupList" component = {GroupList} options = {{headerShown : false}}/>
      <Stack.Screen name = "Reservation" component = {Reservation} options = {{headerShown : false}}/>
      <Stack.Screen name = "ManagePosts" component = {ManagePosts} options = {{headerShown : false}}/>
      <Stack.Screen name = "ResolvePost" component = {ResolvePost} options = {{headerShown : false}}/>
      <Stack.Screen name = "OrderHistory" component = {OrderHistory} options = {{headerShown : false}}/>
      {/* <Stack.Screen name = "AddImage" component = {AddImage} options = {{headerShown : false}}/> */}
      </>
      
    }

    </Stack.Navigator>

  )



}


export default Navigator;