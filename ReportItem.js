import { View, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';
import styles from './styles';

class ReportItem extends Component {

    constructor(props){
        super(props)
    }

    render(){
        console.log('properties', this.props)
        const { report } = this.props
        return (
            <View>
                <Text>{report.status}</Text>
                <Text>{report.date}</Text>
                <Text>{report.source}</Text>
                <Text>{report.location.placeName}</Text>
            </View>
        )
    }
}


export default ReportItem