import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import Maintenance from '../../../common/Services/Maintenance'
const Assignment = () => {
  return (

    // <View style={styles.container}>
    //   <Text style={styles.title}>coming soon</Text>
    //   <Text style={styles.subtitle}>This module is currently under development. Please check back soon!</Text>
    // </View>

    <Maintenance/>


  );
};

export default Assignment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
