import React from 'react';
import { Text, View } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { Actions, Scene, Router, ActionConst, Modal } from 'react-native-router-flux';

import Geocoder from 'react-native-geocoder';

import ReportList from './ReportList';
import NewReport from './NewReport';
import LocationServices from './utilities/LocationServices';

const locationServices = new LocationServices();

export default class App extends React.Component {
  constructor(...args) {
    super(...args);

    const networkInterface = createNetworkInterface('https://roadsight-graphql.herokuapp.com/graphql');
    this.client = new ApolloClient({
      networkInterface,
      dataIdFromObject: r => r.id,
    });
    
    this.state = {
      coords: {
        latitude: -72.23903,
        longitude: -42.32903,
      },
      max: 500,
      locationData: {
        formattedAddress: '19 Daybreak Street, Ottawa',
        feature: '19 Daybreak Street'
      },
    };
  }


  componentDidMount(){
    locationServices.getCurrentAddress().then((address) => {
      if (!address) return;
      this.setState({
        locationData: address,
        lat: address.position.lat,
        lng: address.position.lng,
      });

      Actions.refresh({
        lat: this.state.lat,
        lng: this.state.lng,
        max: this.state.max,
        locationData: address,
        locationServices: locationServices,
      })
      
    })
    .catch((err) => {
      console.log('Error occured: ', err);
    });
  }


  loadNewReport(){
    const reportsTitles = [
      'Left Lane Closed',
      'Right Lane Closed',
      'Road Closed',
      'Very Slow',
      'Stagnant',
      'Accident'
    ];

    Actions.newReport({
      titles: reportsTitles,
      lat: this.state.coords.latitude,
      lng: this.state.coords.longitude,
      max: this.state.max,
      locationData: this.state.locationData,
      locationServices: locationServices,
    });
  }


  render() {
    return (
      <ApolloProvider client={this.client}>
        <Router>
          <Scene key='root' component={Modal} modal>
            <Scene key='reportList' component={ReportList} title='Reports' initial={true} onRight={() => this.loadNewReport()} rightTitle="New Report" type='replace' lat={this.state.coords.latitude} lng={this.state.coords.longitude} max={this.state.max} />
            <Scene key='newReport' component={NewReport} title='New Reports' lat={this.state.coords.latitude} lng={this.state.coords.longitude} max={this.state.max} locationData={this.state.locationData} hideNavBar/>
          </Scene>
        </Router>
      </ApolloProvider>
    );
  }
}