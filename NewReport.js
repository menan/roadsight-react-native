import React from 'react';
import { Text, View } from 'react-native';
import Button from 'react-native-button';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class NewReport extends React.Component{
    render(){
        return(
            <View>
                {this.props.titles.map((title) => {
                    console.log('this', this)
                    return (<Button
                        style={{fontSize: 20, color: 'green'}}
                        styleDisabled={{color: 'red'}}
                        onPress={() => this._handlePress(title)}>
                        {title}
                    </Button>)
                })}
            </View>
        )
    }

        
    _renderButton(title){
        return(
            <Button
                style={{fontSize: 20, color: 'green'}}
                styleDisabled={{color: 'red'}}
                onPress={() => this._handlePress}>
                {title}
            </Button>
        )
    }

    _handlePress(title){
        console.log('reporting', title)
        this.props.createReport({
            status: title,
            source: 'iOS',
            placeName: 'Test Location Menan',
            lat: -54.345245,
            lng: -66.312412,
        })
        .then(({ data }) => {
            console.log('successfully reported', data)
            // this.setState({
            //     report: Object.assign({}, this.props.report, {votes: data.downVote.votes})
            // })
        })
        .catch((error) => {
            console.log('there was an error sending the query', error);
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