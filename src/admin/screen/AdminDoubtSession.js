
import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
const AdminDoubtSession = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coming Soon</Text>
      <Text style={styles.subtitle}>We're working to bring you something awesome!</Text>
    </View>
  );
};

export default AdminDoubtSession;

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
