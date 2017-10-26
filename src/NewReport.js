import React from 'react';
import { Text, View, Platform } from 'react-native';
import Button from 'react-native-button';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class NewReport extends React.Component{
    constructor(...props){
        super(...props)

        this.state = {
            reportState: 0,
        }

    }
    render(){
        return(
            <View>
                <Text>{this._getAdddress()}</Text>
                {this.props.titles.map((title, row) => {
                    return this._renderButton(title, row)
                })}
            </View>
        )
    }

        
    _renderButton(title, i){
        return(
            <Button
                key={i}
                disabled={this.state.reportState == 1}
                style={{fontSize: 20, color: 'green'}}
                styleDisabled={{color: 'red'}}
                onPress={() => this._handlePress(title)}>
                {title}
            </Button>
        )
    }
    _getAdddress(){
        console.log('this address: ', this.props);
        const {formattedAddress, feature} = this.props.locationData
        if (!feature){
            return formattedAddress
        }
        return feature
    }

    _handlePress(title){
        console.log('reporting', title)
        this.setState({
            reportState: 1,
        })
        this.props.createReport({
            status: title,
            source: Platform.OS,
            placeName: this._getAdddress(),
            lat: this.props.lat,
            lng: this.props.lng,
        })
        .then(({ data }) => {
            console.log('successfully reported', data)
            this.setState({
                reportState: 0,
            })
        })
        .catch((error) => {
            console.log('there was an error sending the query', error);
            this.setState({
                reportState: 0,
            })
        })
    }
}


const withNewReportMutations = graphql(gql`
mutation createReport($status: String!, $source: String!, $placeName: String!, $lat: Float!, $lng: Float!) {
  createReport(status: $status, source: $source, placeName: $placeName, lat: $lat, lng: $lng) {
    status
    votes
    source
    placeName
    date
    location{
        type
        coordinates
    }
  }
}
`, {
props: ({ mutate }) => ({
  createReport: ({ status,  source, placeName, lat, lng}) => mutate({ variables: { status,  source, placeName, lat, lng } }),
}),
});

export default withNewReportMutations(NewReport);