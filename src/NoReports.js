import { View, Text, StyleSheet } from 'react-native';
import React, { Component, PropTypes } from 'react';

class ReportList extends Component {

    constructor(props){
        super(props)
    }

    render(){
        return (
            <View style={styles.container}>
                <Text>No reports found.</Text>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });


export default ReportList