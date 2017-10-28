import { View, Text, StyleSheet } from 'react-native';
import Button from 'apsl-react-native-button';
import React, { Component, PropTypes } from 'react';
import { timeSince } from './utilities/timeSince'

class ReportItem extends Component {

    constructor(props){
        super(props)
        this.state = {
            report: props.report
        }
    }

    upVote(){
        this.props.onVoteUp(this.props.report)
        .then(({ data }) => {
            this.setState({
                report: Object.assign({}, this.props.report, {votes: data.upVote.votes})
            })
        })
        .catch((error) => {
            console.log('there was an error sending the query', error);
        })
    }

    downVote(){
        this.props.onVoteDown(this.props.report)
        .then(({ data }) => {
            this.setState({
                report: Object.assign({}, this.props.report, {votes: data.downVote.votes})
            })
        })
        .catch((error) => {
            console.log('there was an error sending the query', error);
        })
    }

    render(){
        const { report } = this.state
        return (
            <View style={styles.reportItem}>
                <Text>{report.status}</Text>
                <Text>{timeSince(report.date)}</Text>
                <Text>{report.source}</Text>
                <Text>{report.votes || 0}</Text>
                <Text>{report.placeName}</Text>
                <View style={styles.buttonContent}>
                    <Button 
                        onPress={this.upVote.bind(this)}
                        textStyle={styles.reportsButtonText}
                        style={styles.reportsButton}
                        >
                        Vote Up
                    </Button>
                    <Button 
                        onPress={this.downVote.bind(this)}
                        textStyle={styles.reportsButtonText}
                        style={styles.reportsButton}
                        >
                        Vote Down
                    </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    reportItem: {
        borderWidth: 4,
        borderColor: '#3b5369',
        backgroundColor: '#3ab654',
        borderRadius: 10,
        padding: 5,
        margin: 10

    },
    reportsButton: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderRadius: 22,
    },
    reportsButtonText: {
        fontSize: 14,
    },
    buttonContent: {
        marginTop: 5,
    }
});


export default ReportItem