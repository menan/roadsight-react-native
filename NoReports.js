import { View, Text } from 'react-native';
import React, { Component, PropTypes } from 'react';
import styles from './styles';

class ReportList extends Component {

    constructor(props){
        super(props)
    }

    render(){
        return (
            <View>
                <Text>No reports found.</Text>
            </View>
        )
    }
}


export default ReportList