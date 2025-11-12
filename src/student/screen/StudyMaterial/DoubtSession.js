
import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import Maintenance from '../../../common/Services/Maintenance'
const DoubtSession = () => {
  return (
    <View style={styles.container}>
        <Maintenance/>
      {/* <Text style={styles.title}>Under Maintenance</Text>
      <Text style={styles.subtitle}>This module is currently under development. Please check back soon!</Text> */}
    </View>
  );
};

export default DoubtSession;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
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
