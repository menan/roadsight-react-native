import { View, Text, ListView, RefreshControl, StyleSheet } from 'react-native';
import React, { Component, PropTypes } from 'react';
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

  onEnter(){
    console.log('hello world.');
  }

  renderList() {
    const { reportsCloseBy, refetch } = this.props;
    console.log('reports closeby ', reportsCloseBy)
    // if (reportsCloseBy && reportsCloseBy.length !== 0) {
      const ds = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
      });


      return (
        <View style={styles.container}>
          <ListView
          style={styles.reportsList}
            dataSource={ds.cloneWithRows(reportsCloseBy)}
            renderRow={this.renderRow}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        </View>
      );
    // }

    // return (
    //   <NoReports />
    // );
  }

  renderRow(report) {
    return (
      <ReportItem
        style={styles.reportItem}
        report={report}
        key={report._id}
        onVoteUp={this.props.voteUp}
        onVoteDown={this.props.voteDown}
      />
    );
  }

  render() {
    console.log('ReportsList', this.props)
    const { loading } = this.props;
    return (
      loading ? <View style={styles.loadingContainer}><Text style={styles.loadingText}>Loading reports round you...</Text></View> : this.renderList()
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


const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reportsList: {
      backgroundColor: 'white',
  },
  loadingText: {
    fontSize: 15,
  }
})


export default withUpVoteMutations(withDownVoteMutations(withAllReports(ReportList)));
