
import {SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {useContext} from "react"
import Contants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navigator from './Screens/Navigator';
import { Context, Provider } from "./Screens/globalContext";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs()
// console.disableYellowBox = true;

function App() {
  return (
    <Provider>
    <SafeAreaView style={styles.container}>
      {/* <GooglePlacesInput /> */}
      <NavigationContainer>
        <Navigator />
    </NavigationContainer>
    </SafeAreaView>
    </Provider>
  )



}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Contants.statusBarHeight
  },

  textStyle: {
    fontSize: 25,
  },
});