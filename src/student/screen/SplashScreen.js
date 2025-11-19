// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     // Wait 3 seconds and navigate to Home
//     const timer = setTimeout(() => {
//       navigation.replace('Login');
//     }, 3000);
//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (


//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
//       {/* <Image
//         source={require('../../assets/logo.png')} // your app logo
//         style={styles.logo}
//       /> */}
//       <Text style={styles.title}>Pathsala</Text>
//     </View>



//   );
// };

// export default SplashScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#4CAF50', // splash background color
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     marginBottom: 20,
//   },
//   title: {
//     color: 'white',
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
// });




import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = ({ navigation }) => {
  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current; // For opacity
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // For scale

  useEffect(() => {
    // Animate fade and scale in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Animated Text */}
      <Animated.Text
        style={[styles.tagline, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        "Digital Learning. Anytime. Anywhere."
      </Animated.Text>

      {/* Animated Image */}
      <Animated.Image
        source={require('../../assets/logo.png')}
        style={[styles.illustration, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />

      <Text style={styles.appTitle}>Pathsala</Text>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Pathsala</Text>
      </View>

      <Text style={styles.subtitle}>The learning App</Text>
      <Text style={styles.description}>
        Empowering students through digital{'\n'}agriculture education.
      </Text>

      <View style={styles.bottomContainer}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/igkv-min.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require('../../assets/nic.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.footerText}>इंदिरा गांधी कृषि विश्वविद्यालय</Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  tagline: {
    color: '#E6861A',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B1E0E',
    marginBottom: 15,
  },
  banner: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B1E0E',
    fontWeight: '500',
  },
  description: {
    textAlign: 'center',
    color: '#4B1E0E',
    marginTop: 5,
    marginBottom: 30,
  },
  bottomContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  footerText: {
    color: '#E6861A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
