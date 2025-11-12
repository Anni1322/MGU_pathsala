import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Maintanance = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={['#f9fafc', '#e0eafc']} style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/7486/7486791.png',}} style={styles.image} />

        <Text style={styles.title}>Under Maintenance</Text>
        <Text style={styles.subtitle}>
          This module is currently under development. Please check back soon!
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default Maintanance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4c669f',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
