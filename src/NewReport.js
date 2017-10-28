import React from 'react';
import { Text, View, Platform, StyleSheet } from 'react-native';
import Button from 'apsl-react-native-button';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import Icon from 'react-native-vector-icons/Ionicons';

class NewReport extends React.Component{
    constructor(...props){
        super(...props);

        this.state = {
            reporting: false,
            address: this.props.locationData
        };

    }

    componentDidMount(){
        const { locationServices } = this.props;
        locationServices.pingLocation((addr) => {
            console.log('address updated', addr);
            this.setState({
                address: addr
            });
        });
    }

    componentWillUnmount(){
        const { locationServices } = this.props;
        locationServices.expireTimer();
    }

    render(){
        return(
            <View style={styles.newReport}>
                <Text style={styles.addressTitle}>{this._getAdddress()}</Text>
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
                isDisabled={this.state.reporting}
                style={styles.reportButton}
                textStyle={styles.reportButtonText}
                disabledStyle={styles.reportButtonDisabled}
                onPress={() => this._handlePress(title)}>
                {title}
            </Button>
        )
    }
    _getAdddress(){
        const {formattedAddress, feature} = this.state.address
        if (!feature){
            return formattedAddress
        }
        return feature
    }

    _handlePress(title){
        console.log('reporting', title)
        this.setState({
            reporting: true,
        })
        this.props.createReport({
            status: title,
            source: Platform.OS,
            placeName: this._getAdddress(),
            lat: this.state.address.position.lat,
            lng: this.state.address.position.lng,
        })
        .then(({ data }) => {
            console.log('successfully reported', data)
            this.setState({
                reporting: false,
            })
        })
        .catch((error) => {
            console.log('there was an error sending the query', error);
            this.setState({
                reporting: false,
            })
            alert('Sorry an error occured.');
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


const styles = StyleSheet.create({

    reportTitle: {
        textAlign: 'center',
    },
    reportButton: {
        backgroundColor: '#3ab654',
        borderWidth: 0,
        borderRadius: 22,
    },
    reportButtonText: {
        fontSize: 14,
        color: 'white',
    },
    newReport:{
        flex: 1,
        padding: 5,
        paddingTop: 20,
        backgroundColor: 'white'
        
    },
    addressTitle: {
        paddingTop: 5,
        paddingBottom: 10,
        textAlign: 'center',
        fontSize: 25,
    },
    reportButtonDisabled: {
        backgroundColor: 'gray',
    }

});

export default withNewReportMutations(NewReport);