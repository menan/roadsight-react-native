import React from 'react';
import { Text, View } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import ReportList from './ReportList';

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
    }
  }


  componentDidMount(){
    this.getLocation()
  }

  getLocation(){
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }

    
    navigator.geolocation.getCurrentPosition((response) => {
      if (!response) return;
      this.setState({
        coords: response.coords
      })
      console.log('state', this.props)
    }, function error(err){
      console.log('error locating you', err)
    }, options)
  }


  render() {
    return (
      <ApolloProvider client={this.client}>
        <ReportList lat={this.state.coords.latitude} lng={this.state.coords.longitude} max={this.state.max} />
      </ApolloProvider>
    );
  }
}