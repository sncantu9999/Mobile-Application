import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, View, ScrollView, Dimensions, Pressable} from 'react-native';
// import Map from './Map';
import MapView, {Marker} from 'react-native-maps';
import * as Location from "expo-location";

import tw from "tailwind-react-native-classnames";
import { createStackNavigator } from "@react-navigation/stack"
import MapViewDirections from "react-native-maps-directions";
import Geocoder from 'react-native-geocoding';

import {GOOGLE_MAPS_APIKEY} from "@env"

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const deviceHeight =Dimensions.get("window").height


let targetCoords = {
    lat: 40.6930447,
    long: -73.9874811,
}

function Map({navigation, route, params}) {
    console.log(route.params)
    Geocoder.init(GOOGLE_MAPS_APIKEY);
    const coord = targetCoords;
    const [origin, setOrigin] = React.useState({latitude: 40.6930447,
        longitude: -73.9874811})
    const [pin, setPin] = React.useState({
        latitude: 40.6930447,
        longitude: -73.9874811,
    });

    React.useEffect(() => {
        console.log(route.params.street)
        Geocoder.from(route.params.street)
        .then(json => {
            var location = json.results[0].geometry.location;
            console.log("new addy: " + location.lat + location.lng);
            setPin({latitude: location.lat,
                longitude: location.lng})
        })
        .catch(error => console.warn(error));
        console.log("new coords: " + pin.latitude + pin.longitude);
    }, [])
//    const [marker, setMarker] = React.useState(null);
//    const markerRef = React.useRef(null);

    React.useEffect(() => {
        moveMarker()
    }, [origin])

    React.useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            console.log("checking status");
            if (status !== "granted"){
                console.log("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            console.log("location: " + location.coords.latitude + location.coords.longitude);
            setOrigin({latitude: location.coords.latitude, longitude : location.coords.longitude})
        }) ();
    },[]);

    const moveMarker = () => {
        console.log("setting position: ");
        console.log(pin);
        Geocoder.from(route.params.street)
        .then(json => {
            var location = json.results[0].geometry.location;
            console.log("new addy: " + location.lat + location.lng);
            setPin({latitude: location.lat,
                longitude: location.lng})
        })
        .catch(error => console.warn(error));
        console.log("new coords: " + pin.latitude + pin.longitude);
    };

    return (
        <SafeAreaView forceInset={{ top: 'always' }}>
        <View style={styles.container}>
        <MapView style={styles.map}
            initialRegion={{
                latitude: 40.6930396,
                longitude: -73.9875105,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
        >

        <MapViewDirections
            origin = {origin}
            destination = {pin}
            apikey = {GOOGLE_MAPS_APIKEY}
            strokeWidth = {2}
            strokeColor = "black"
        />

        <Marker
//                ref={markerRef}
            coordinate = {{
                latitude: pin.latitude,
                longitude: pin.longitude,
                //latitude: 40.6930396,
                //longitude: -73.9875105,
            }}
            pinColor = "red"
            onPress= {moveMarker}
        />
        </MapView>
        </View>
        <Pressable style = {styles.altbtn} onPress = {() => navigation.navigate("PostInfo", route.params)}>
        <Text style = {styles.alttxt}>
            I changed my mind
            <Text style = {{color: 'blue'}}> Go back</Text>
        </Text>
        </Pressable>
        </SafeAreaView>
        )
    }



{/* </View>
    <View>
        <Text>
            Maps
        </Text>
    </View> */}
{/* }; */}

export default Map


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: deviceHeight+50,
        width: 390,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
}
)