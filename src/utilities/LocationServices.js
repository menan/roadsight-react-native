
import Geocoder from 'react-native-geocoder';


export default class LocationServices {

  constructor(){
    this.address = {};
    this.coordinates = {};
    this.interval = 500;
  }

  getCurrentAddress(){
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition((response) => {
        if (!response) reject(Error("No coordinates located."));

        Geocoder.geocodePosition({
          lat: response.coords.latitude,
          lng: response.coords.longitude,
        }).then(res => {
          console.log('geocoded address', res);
          if (!res || res.length == 0) reject(Error("No addresses found."));
          this.address = res;
          resolve(res[0]);
        })
        .catch(err => reject(err));
        
        response.coords = response.coords;
      }, function error(err){
        reject(err);
        console.log('error locating you', err);
      }, options);
    });

  }
}