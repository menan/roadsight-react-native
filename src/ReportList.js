import { View, Text, ListView, RefreshControl } from 'react-native';
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
      refreshing: false
    }
  }

  _onRefresh() {
    const { refetch } = this.props;
    this.setState({refreshing: true});
    refetch().then(() => {
      this.setState({refreshing: false});
      console.log('done refreshing');
    });
  }


  renderList() {
    const { reportsCloseBy, refetch } = this.props;
    if (reportsCloseBy && reportsCloseBy.length !== 0) {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      });


      return (
        <ListView
          dataSource={ds.cloneWithRows(reportsCloseBy)}
          renderRow={this.renderRow}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
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

const withAllReports = graphql(gql`
  query closeReports($lat: Float!, $lng: Float!, $max: Int!){
    reportsCloseBy(lat: $lat, lng: $lng, max: $max){
      _id
      status
      source
      date
      votes
      placeName
      location {
        coordinates
      }
    }
  }
`,{
  options: (props) => ({
    variables: { 
      lat: props.lat,
      lng: props.lng,
      max: props.max 
    }
  }),
  props: ({data: {loading, reportsCloseBy, refetch}}) => {
    return {
      loading,
      reportsCloseBy,
      refetch,
    }
  }

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
  lat: PropTypes.number,
  lng: PropTypes.number,
  max: PropTypes.number,
  voteUp: PropTypes.func.isRequired,
  voteDown: PropTypes.func.isRequired,
};


export default withUpVoteMutations(withDownVoteMutations(withAllReports(ReportList)));
