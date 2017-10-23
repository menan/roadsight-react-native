import { View, Text, ListView } from 'react-native';
import React, { Component, PropTypes } from 'react';
import styles from './styles';
import NoReports from './NoReports';
import ReportItem from './ReportItem';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class ReportList extends Component {
  constructor() {
    super();
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      coords: {
        latitude: -75.23903,
        longitude: -42.32903,
      },
      reports: [],
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

    
    navigator.geolocation.getCurrentPosition(function(coordinates){
      console.log('coordinates', coordinates)
      if (!coordinates) return;
      this.setState({
        coords: coordinates
      })
    }, function error(err){
      console.log('error locating you', err)
    }, options);
  }


  renderList() {
    const { reports } = this.props;
    if (reports && reports.length !== 0) {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      });

      return (
        <ListView
          dataSource={ds.cloneWithRows(reports)}
          renderRow={this.renderRow}
          style={styles.container}
        />
      );
    }

    return (
      <NoReports />
    );
  }

  renderRow(report) {
    return (
      <ReportItem
        report={report}
        key={report._id}
        onVoteUp={this.props.voteUp}
        onVoteDown={this.props.voteDown}
      />
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <View style={styles.container}>
        { loading ? <Text>Loading...</Text> : this.renderList()}
      </View>
    );
  }
}

const withData = graphql(gql`
  query allReports{
      reports {
        _id
        status
        source
        date
        votes
        location {
          lat
          lng
          placeName
        }
      }
    }
    
  `, {
  props: ({ data: { loading, reports } }) => {
    return {
      loading,
      reportsAll,
    };
  },
});

const withAllReports = graphql(gql`
  query closeReports($lat: Float!, $lat: Float!, $max: Int!){
    reports{
      _id
      status
      source
      date
      votes
      location {
        lat
        lng
        placeName
      }
    }
  }
`,{
  options: {
    variables: {
      lat: state.coords.latitude,
      lng: state.coords.longitude,
      max: 500,
    }
  },
  props: ({ data: { loading, reports } }) => {
    return {
      loading,
      reports,
    };
  },

})


const withUpVoteMutations = graphql(gql`
  mutation upVote($_id: String!) {
    upVote(_id: $_id) {
      votes
    }
  }
  `, {
  props: ({ mutate }) => ({
    voteUp: ({ _id }) => mutate({ variables: { _id } }),
  }),
});

const withDownVoteMutations = graphql(gql`
  mutation downVote($_id: String!) {
    downVote(_id: $_id) {
      votes
    }
  }
  `, {
  props: ({ mutate }) => ({
    voteDown: ({ _id }) => mutate({ variables: { _id } }),
  }),
});

ReportList.propTypes = {
  reports: PropTypes.array,
  voteUp: PropTypes.func.isRequired,
  voteDown: PropTypes.func.isRequired,
};


export default withUpVoteMutations(withDownVoteMutations(withAllReports(ReportList)));
