import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate fade and scale in parallel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000, // Slightly faster for better UX
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4, // Smoother spring
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 4 seconds (adjusted for animation duration)
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 4000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" /> {/* Changed to match theme */}

      {/* Top Tagline */}
      <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.tagline}>
          "Cultivating Knowledge. Nurturing Future."
        </Text>
      </Animated.View>

      {/* Central Content */}
      <View style={styles.centerContainer}>
        <Animated.Image
          source={require('../../../assets/morgurukul.png')}
          style={[styles.logoImage, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
          resizeMode="contain"
        />
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.bannerText}>M.G.U.V.V., DURG</Text>
          <Text style={styles.subtitle}>The e-Learning Portal</Text>
        </Animated.View>
      </View>

      {/* Bottom Logos and Footer */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoRow}>
          <Image
            source={require('../../../assets/logo_mgu.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require('../../../assets/nic.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.footerText}>महात्मा गांधी बागवानी एवं वानिकी विश्वविद्यालय</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  taglineContainer: {
    marginTop: 20,
  },
  tagline: {
    color: '#2E7D32',  
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontStyle: 'italic',  
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: width * 0.6,  
    height: height * 0.3,  
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5, 
  },
  bannerText: {
    color: '#FF9800', 
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'serif', 
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#424242',  
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
  },
  bottomContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 70,
    height: 70,
    marginHorizontal: 15,
  },
  footerText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});
