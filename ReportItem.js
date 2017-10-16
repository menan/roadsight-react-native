import { View, Text, Button } from 'react-native';
import React, { Component, PropTypes } from 'react';
import styles from './styles';

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
                <Text>{report.date}</Text>
                <Text>{report.source}</Text>
                <Text>{report.votes || 0}</Text>
                <Text>{report.location.placeName}</Text>
                <Button 
                onPress={this.upVote.bind(this)}
                title="Up Vote"
                color="#841584"
                />
                <Button 
                onPress={this.downVote.bind(this)}
                title="Down Vote"
                color="#841584"
                />
            </View>
        )
    }
}


export default ReportItem