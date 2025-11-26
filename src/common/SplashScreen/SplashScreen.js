// import React, { useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Image, StatusBar, Animated, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const { width, height } = Dimensions.get('window');

// const SplashScreen = ({ navigation }) => {
//   // Create animated values
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     // Animate fade and scale in parallel
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 2000, // Slightly faster for better UX
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 4, // Smoother spring
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Navigate after 4 seconds (adjusted for animation duration)
//     const timer = setTimeout(() => {
//       navigation.replace('Login');
//     }, 4000);

//     return () => clearTimeout(timer);
//   }, [fadeAnim, scaleAnim, navigation]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#4CAF50" /> {/* Changed to match theme */}

//       {/* Top Tagline */}
//       <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//         <Text style={styles.tagline}>
//           "Cultivating Knowledge. Nurturing Future."
//         </Text>
//       </Animated.View>

//       {/* Central Content */}
//       <View style={styles.centerContainer}>
//         <Animated.Image
//           source={require('../../../assets/morgurukul.png')}
//           style={[styles.logoImage, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
//           resizeMode="contain"
//         />
//         <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//           <Text style={styles.bannerText}>M.G.U.V.V., DURG</Text>
//           <Text style={styles.subtitle}>The e-Learning Portal</Text>
//         </Animated.View>
//       </View>

//       {/* Bottom Logos and Footer */}
//       <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
//         <View style={styles.logoRow}>
//           <Image
//             source={require('../../../assets/logo_mgu.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//           <Image
//             source={require('../../../assets/nic.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View>
//         <Text style={styles.footerText}>महात्मा गांधी बागवानी एवं वानिकी विश्वविद्यालय</Text>
//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// export default SplashScreen;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E8F5E8', 
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 20,
//   },
//   taglineContainer: {
//     marginTop: 20,
//   },
//   tagline: {
//     color: '#2E7D32',  
//     fontSize: 20,
//     textAlign: 'center',
//     fontWeight: '600',
//     fontStyle: 'italic',  
//     paddingHorizontal: 20,
//   },
//   centerContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoImage: {
//     width: width * 0.6,  
//     height: height * 0.3,  
//     marginBottom: 20,
//   },
//   textContainer: {
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.9)', 
//     borderRadius: 20,
//     paddingVertical: 15,
//     paddingHorizontal: 25,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5, 
//   },
//   bannerText: {
//     color: '#FF9800', 
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     fontFamily: 'serif', 
//     letterSpacing: 1,
//     textShadowColor: 'rgba(0, 0, 0, 0.3)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 2,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#424242',  
//     fontWeight: '500',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   bottomContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logoRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   logo: {
//     width: 70,
//     height: 70,
//     marginHorizontal: 15,
//   },
//   footerText: {
//     color: '#2E7D32',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     paddingHorizontal: 20,
//     lineHeight: 22,
//   },
// });









import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, Animated, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: '🌾 MOR GURUKUL',
    description: 'Access high-quality, comprehensive agricultural courses and study materials anytime, anywhere from MGUVV.',
    image: require('../../../assets/img4.jpg'),
  },
  {
    id: '2',
    title: '✅ ADMIT CARDS & FEES',
    description: 'Instantly download your examination Admit Cards and manage all fee payments and ledger statements securely.',
    image: require('../../../assets/img2.jpg'),
  },
  {
    id: '3',
    title: '📚 TRANSCRIPTS & RESULTS',
    description:
      'View your official grade reports, request transcripts, and access your enrollment and registration details.',
    image: require('../../../assets/img5.jpg'),
  },
  {
    id: '4',
    title: '🧑‍🏫 FACULTY DASHBOARD',
    description: 'Dedicated portal for faculty to manage class rosters, submit grades, and track student attendance efficiently.',
    image: require('../../../assets/img6.jpg'),
  },
  {
    id: '5',
    title: '📣 CAMPUS NEWS & EVENTS',
    description: 'Stay updated with the latest university announcements, academic schedules, and campus activities.',
    image: require('../../../assets/img7.jpg'),
  },
  {
    id: '6',
    title: '📞 INSTANT SUPPORT',
    description: 'Connect directly with the university support staff and technical team for quick resolution of queries.',
    image: require('../../../assets/img8.jpg'),
  },
];

export default function OnboardingScreen({ navigation }) {

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  // Create animated values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Reset and animate on slide change
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();



    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0; // restart
      }
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval);

  }, [currentIndex]);

  const onScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    // Navigate to login/home
    navigation.replace('Auth');
    console.log("Skipped");
    // navigation.replace("Home")
  };

  const renderItem = ({ item }) => (

    <View style={styles.slide}>
      <Image
        source={require('../../../assets/logoheader.png')}
        style={[styles.mainImagehead,]}
        resizeMode="contain"
      />



      <Animated.View style={[styles.taglineContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.tagline}>
          "Cultivating Knowledge. Nurturing Future."
        </Text>
      </Animated.View>


      <Animated.Image
        source={item.image}
        style={[styles.mainImage, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />

      <Animated.Text
        style={[styles.title, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        {item.title}
      </Animated.Text>

      <Animated.Text
        style={[styles.description, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      >
        {item.description}
      </Animated.Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: i === currentIndex ? 1 : 0.3 }
            ]}
          />
        ))}
      </View>

      {/* Skip button */}
      <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Bottom Logos and Footer */}
      {/* <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}> */}
      <View style={[styles.bottomContainer,]}>
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
      </View>
      {/* </Animated.View>  */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  slide: {
    width,
    alignItems: 'center',
    paddingTop: 60,

  },

  taglineContainer: {
    marginTop: 20,
    backgroundColor: '#ffe3e3ff',
    padding: 10,
    borderRadius: 5
  },

  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },

  mainImagehead: {
    width: '90%',
    height: 120,
    marginTop: -50,
    // backgroundColor:'#fff',
  },

  mainImage: {
    width: '80%',
    height: 260,
    marginTop: 20,
  },

  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: '900',
    color: '#000E2E',
    textAlign: 'center',
  },

  description: {
    marginTop: 12,
    paddingHorizontal: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#444',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
    // position: 'absolute',
    bottom: 10,
    right: 120,
  },

  skipBtn: {
    position: 'absolute',
    bottom: 180,
    right: 30,
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },

  skipText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  bottomContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },

  logoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 10,
  },

  footerText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
