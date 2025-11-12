import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HomePage({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('AdminHomeLayout');
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo / App Icon */}
      <Image
        source={require('../../assets/logo.png')}  
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome, Faculty</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('AdminHomeLayout')}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F6D7A', // Splash-like background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F5DD90',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3, // Shadow for Android
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
