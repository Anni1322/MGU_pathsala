import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PDC() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provisional Degree Certificate</Text>
      <Text style={styles.subtitle}>Name: Sarah Johnson</Text>
      <Text style={styles.subtitle}>Program: B.Sc. Biology</Text>
      <Text style={styles.subtitle}>Graduation Year: 2025</Text>
      <Text style={styles.subtitle}>Status: Issued</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ecfccb',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
});
