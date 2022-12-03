import Geolocation from 'react-native-geolocation-service';

function componentDidMount(props) {
  const [ geolocation, setGeo ] = useState("")
  const [ hasLocationPermission, setPerm ] = useState(false)
  
  if (hasLocationPermission) {
    Geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
}

export default componentDidMount