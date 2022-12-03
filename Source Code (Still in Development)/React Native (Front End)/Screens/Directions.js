import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_APIKEY } from "@env";
import React, { useContext, useState } from 'react';
import {useDispatch} from 'react-redux';

const GooglePlacesInput = () => {
    
  const [ location, setLocation ] = useState("")
  const [ details, setDetails ] = useState("")
  const [ destination, setDest ] = useState("")

  return (
    <GooglePlacesAutocomplete
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce = {200}
      placeholder='Search'
      minLength={2}
      enablePoweredByContainer = {false}
      returnKeyType ={"search"}
      fetchDetails = {true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        setLocation(details.geometry.location)
        setDetails(data.description)
        console.log(data)
        // console.log(details);
      }}
      styles = {{
        container: {
            flex: 0,
        },
        textInput: {
            fontSize : 18
        },
      }}
      query={{
        key: GOOGLE_MAPS_APIKEY,
        language: 'en',
      }}
    />
  );
};

export default GooglePlacesInput;