import Geocoder from 'react-native-geocoder';

const interval = 2500;
let timer;
export default class LocationServices {

  constructor(){
    this.address = {};
    this.coordinates = {};
    this.lastUpdated = new Date();
    this.callback = null;
  }

  pingLocation(cb){
    console.log('subscribing to locations');
    this.callback = cb;
    timer = setInterval(() => this._updateAddress(), interval);
  }
  expireTimer(){
    console.log('expiring timer.');
    clearInterval(timer);
  }

  _updateAddress(){
    console.log('ls: this', this);
    this.lastUpdated = new Date();
    this.getCurrentAddress();
  }

  getAddress(){
    return this.address;
  }

  getCoordinates(){
    return this.coordinates;
  }

  getCurrentAddress(){
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    const scope = this;

    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition((response) => {
        if (!response) reject(Error("No coordinates located."));
        if (scope.coordinates.lat == response.coords.latitude && scope.coordinates.lng == response.coords.longitude){
          if (scope.callback) scope.callback(scope.address);
          resolve(scope.address);
          return;
        }
        scope.coordinates = {
          lat: response.coords.latitude,
          lng: response.coords.longitude,
        };
        Geocoder.geocodePosition(scope.coordinates).then((res) => {
          if (!res || res.length == 0) reject(Error("No addresses found."));
          scope.address = res[0];
          if (scope.callback) scope.callback(scope.address);
          resolve(scope.address);
        })
        .catch(err => reject(err));
      }, function error(err){
        reject(err);
        console.log('error locating you', err);
      }, options);
    });

  }
}