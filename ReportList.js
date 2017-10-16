import React from 'react';
import { Text, View } from 'react-native';
import { graphql, ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';

const styles = {
  outer: { paddingTop: 32, paddingLeft: 10, paddingRight: 10 },
  wrapper: { height: 40, marginBottom: 15, flex: 1, flexDirection: 'row' },
  header: { fontSize: 20 },
  subtextWrapper: { flex: 1, flexDirection: 'row' },
  votes: { color: '#999' },
}

// The data prop, which is provided by the wrapper below contains,
// a `loading` key while the query is in flight and posts when ready
function ReportList({ data }) {
  console.log(data)
  const error = data.error
  if (data.loading) {
    return <Text style={styles.outer}>Loading</Text>;
  } else if (error){
    return <Text style={styles.outer}>{error.message}</Text>;
    } else {
    const reports = data.reports
    if (!reports){
      return <Text style={styles.outer}>No data!</Text>;
    } 
    console.log(reports)
    return (
      <View style={styles.outer}>
        {reports.map(report => (
          <View key={report._id} style={styles.wrapper}>
            <View>
              <Text style={styles.header}>{report.status}</Text>
              <View style={styles.subtextWrapper}>
                <Text>
                  at {report.location.lat} {' '}
                  {report.location.lng} {' '}
                </Text>
                <Text style={styles.votes}>{report.location.placeName}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (ReportList here)
export default graphql(gql`
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
  
`)(ReportList);