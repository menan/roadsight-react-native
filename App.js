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
  }
  render() {
    return (
      <ApolloProvider client={this.client}>
        <ReportList />
      </ApolloProvider>
    );
  }
}