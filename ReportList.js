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
      reports,
    };
  },
});


const withUpVoteMutations = graphql(gql`
  mutation upVote($id: ID!) {
    upVote(_id: $id) {
      votes
    }
  }
  `, {
  props: ({ mutate }) => ({
    voteUp: ({ id }) => mutate({ variables: { id } }),
  }),
});

const withDownVoteMutations = graphql(gql`
  mutation downVote($id: ID!) {
    downVote(_id: $id) {
      votes
    }
  }
  `, {
  props: ({ mutate }) => ({
    voteDown: ({ id }) => mutate({ variables: { id } }),
  }),
});

ReportList.propTypes = {
  reports: PropTypes.array,
  voteUp: PropTypes.func.isRequired,
  voteDown: PropTypes.func.isRequired,
};

export default withUpVoteMutations(withDownVoteMutations(withData(ReportList)));
