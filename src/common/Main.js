import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  Image,
  ActivityIndicator
} from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from "react-native-keychain";
import UpdateChecker from '../common/UpdateChecker';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  // 2. Logic to check session on mount
  useEffect(() => {
    const checkCredentialsAndBiometry = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();

        if (!credentials) {
          setIsLoading(false);
          await Keychain.getSupportedBiometryType();
          return;
        }

        const userData = JSON.parse(credentials.password || '{}');
        
        if (userData?.LoginDetail) {
          navigation.replace("Admin");
        } else {
          navigation.replace("Student");
        }
      } catch (error) {
        console.error("Auth Initialization Error:", error);
        setIsLoading(false);  
      }
    };

    checkCredentialsAndBiometry();
  }, [navigation]);

  // 3. Trigger animations only when loading is complete
  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(logoFloat, { 
            toValue: -12, 
            duration: 2500, 
            easing: Easing.inOut(Easing.sin), 
            useNativeDriver: true 
          }),
          Animated.timing(logoFloat, { 
            toValue: 0, 
            duration: 2500, 
            easing: Easing.inOut(Easing.sin), 
            useNativeDriver: true 
          }),
        ])
      ).start();
    }
  }, [isLoading]);

  // 4. Loader View (Matches your background style)
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5faff" />
        <ActivityIndicator size="large" color="#4643e9" />
        <Text style={styles.loaderText}>Verifying Session...</Text>
      </View>
    );
  }

  // 5. Main Content View
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <UpdateChecker />
      
      {/* BACKGROUND SVG */}
      <View style={styles.backgroundShape}>
        <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#d4ebffa7" />
              <Stop offset="100%" stopColor="#eee2ff" />
            </LinearGradient>
            <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#4643e9" />
              <Stop offset="100%" stopColor="#38f9d7" />
            </LinearGradient>
          </Defs>
          <Circle cx={width * 0.9} cy={height * 0.1} r={width * 0.4} fill="url(#bgGrad)" />
          <Circle cx={width * 0.1} cy={height * 0.5} r={width * 0.5} fill="url(#accentGrad)" opacity={0.4} />
        </Svg>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* LOGO SECTION */}
        <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoFloat }] }]}>
          <View style={styles.whiteGlassCircle}>
            <Image 
              source={require("../../assets/logo_mgu.png")} 
              style={styles.logoImage} 
              resizeMode="contain" 
            />
          </View>
        </Animated.View>

        {/* FROSTED GLASS CARD */}
        <View style={styles.glassCard}>
          <View style={styles.textSection}>
            <Text style={styles.title}>MOR GURUKUL</Text>
            <Text style={styles.subtitle}>Welcome to the Horticulture & Forestry Portal</Text>
          </View>

          <View style={styles.buttonWrapper}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('WebsiteScreen')} 
              style={[styles.btn, styles.btnWhite]}
            >
              <Text style={styles.btnTextBlue}>Visit Website</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('AuthLoading')} 
              style={[styles.btn, styles.btnTransparent]}
            >
              <Text style={styles.btnTextWhite}>Account Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* FOOTER SECTION */}
      <View style={styles.footerWrapper}>
        <View style={styles.glassFooter}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../assets/logo_mgu.png')}
              style={styles.footerLogo}
              resizeMode="contain"
            />
            <View style={styles.Viewider} />
            <Image
              source={require('../../assets/nic.png')}
              style={styles.footerLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.footerText}>महात्मा गांधी बागवानी एवं वानिकी विश्वविद्यालय</Text>
          <Text style={styles.copyright}>© 2026 MGUVV | Powered by NIC</Text>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5faff' 
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5faff',
  },
  loaderText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4643e9',
    fontWeight: '600',
  },
  backgroundShape: { 
    position: 'absolute', 
    top: 0, 
    left: 0 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  logoContainer: { 
    marginBottom: 30 
  },
  whiteGlassCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',  
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 8,
  },
  logoImage: { 
    width: 85, 
    height: 85 
  },
  glassCard: {
    width: '100%',
    paddingVertical: 35,
    paddingHorizontal: 20,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  textSection: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#004d40', 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#00796b', 
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  buttonWrapper: { 
    width: '100%', 
    gap: 15 
  },
  btn: { 
    height: 55, 
    borderRadius: 27, 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%' 
  },
  btnWhite: { 
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  btnTransparent: { 
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  btnTextBlue: { 
    color: '#03036a', 
    fontSize: 17, 
    fontWeight: '700' 
  },
  btnTextWhite: { 
    color: '#160279', 
    fontSize: 17, 
    fontWeight: '700' 
  },
  footerWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  glassFooter: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerLogo: {
    width: 40,
    height: 40,
  },
  Viewider: {
    width: 1,
    height: 25,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 20,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  copyright: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 0.5,
  },
});

export default Home;





















// import React, { useEffect, useRef } from 'react';
// import { 
//   StyleSheet, Text, View, TouchableOpacity, 
//   SafeAreaView, Animated, Dimensions, StatusBar, Easing, Image 
// } from 'react-native';
// import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
// import { useNavigation } from '@react-navigation/native'; 
// import UpdateChecker from '../common/UpdateChecker';
// const { width, height } = Dimensions.get('window');
// import * as Keychain from "react-native-keychain";

// const Home = () => {
//   const navigation = useNavigation(); 

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(40)).current;
//   const logoFloat = useRef(new Animated.Value(0)).current;

//   useEffect(()=>{
//     const checkCredentialsAndBiometry = async () => {
//     try {
//       const credentials = await Keychain.getGenericPassword();
//       if (!credentials) {
//         const type = await Keychain.getSupportedBiometryType();
//         // setBiometryType(type); 
//         return; 
//       }
//       const userData = JSON.parse(credentials.password || '{}');
//       setHasSavedCredentials(true);
//       const targetRoute = userData?.LoginDetail ? "Admin" : "Student";
//       navigation.replace(targetRoute);

//     } catch (error) {
//       console.error("Auth Initialization Error:", error);
//       navigation.replace("Login");
//     }
//   };

//     checkCredentialsAndBiometry();
//   },[navigation])

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
//     ]).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(logoFloat, { toValue: -12, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//         Animated.timing(logoFloat, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
//      <UpdateChecker />
//       {/* BACKGROUND SVG */}
//       <View style={styles.backgroundShape}>
//         <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
//           <Defs>
//             <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <Stop offset="0%" stopColor="#d4ebffa7" />
//               <Stop offset="100%" stopColor="#eee2ff" />
//             </LinearGradient>
//             <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <Stop offset="0%" stopColor="#4643e9" />
//               <Stop offset="100%" stopColor="#38f9d7" />
//             </LinearGradient>
//           </Defs>
//           <Circle cx={width * 0.9} cy={height * 0.1} r={width * 0.4} fill="url(#bgGrad)" />
//           <Circle cx={width * 0.1} cy={height * 0.5} r={width * 0.5} fill="url(#accentGrad)" opacity={0.4} />
//         </Svg>
//       </View>

//       <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
//         {/* LOGO SECTION */}
//         <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoFloat }] }]}>
//             <View style={styles.whiteGlassCircle}>
//                 <Image 
//                   source={require("../../assets/logo_mgu.png")} 
//                   style={styles.logoImage} 
//                   resizeMode="contain" 
//                 />
//             </View>
//         </Animated.View>

//         {/* FROSTED GLASS CARD */}
//         <View style={styles.glassCard}>
//             <View style={styles.textSection}>
//                 <Text style={styles.title}>MOR GURUKUL</Text>
//                 <Text style={styles.subtitle}>Welcome to the Horticulture & Forestry Portal</Text>
//             </View>

//             <View style={styles.buttonWrapper}>
//                 <TouchableOpacity 
//                     onPress={() => navigation.navigate('WebsiteScreen')} 
//                     style={[styles.btn, styles.btnWhite]}
//                 >
//                     <Text style={styles.btnTextBlue}>Visit Website</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                     onPress={() => navigation.navigate('AuthLoading')} 
//                     style={[styles.btn, styles.btnTransparent]}
//                 >
//                     <Text style={styles.btnTextWhite}>Account Login</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//       </Animated.View>

//       {/* PERFECTED FOOTER SECTION */}
//       <View style={styles.footerWrapper}>
//         <View style={styles.glassFooter}>
//           <View style={styles.logoRow}>
//             <Image
//               source={require('../../assets/logo_mgu.png')}
//               style={styles.footerLogo}
//               resizeMode="contain"
//             />
//             <View style={styles.Viewider} />
//             <Image
//               source={require('../../assets/nic.png')}
//               style={styles.footerLogo}
//               resizeMode="contain"
//             />
//           </View>
//           <Text style={styles.footerText}>महात्मा गांधी बागवानी एवं वानिकी विश्वविद्यालय</Text>
//           <Text style={styles.copyright}>© 2026 MGUVV | Powered by NIC</Text>
//         </View>
//       </View>

//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#f5faff' 
//   },
//   backgroundShape: { 
//     position: 'absolute', 
//     top: 0, 
//     left: 0 
//   },
//   content: { 
//     flex: 1, 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingHorizontal: 25,
//     paddingBottom: 40,
//   },
//   logoContainer: { 
//     marginBottom: 30 
//   },
//   whiteGlassCircle: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',  
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.9)',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 15,
//     elevation: 8,
//   },
//   logoImage: { 
//     width: 85, 
//     height: 85 
//   },
//   glassCard: {
//     width: '100%',
//     paddingVertical: 35,
//     paddingHorizontal: 20,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)', 
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.4)',
//     alignItems: 'center',
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//   },
//   textSection: { 
//     alignItems: 'center', 
//     marginBottom: 40 
//   },
//   title: { 
//     fontSize: 28, 
//     fontWeight: 'bold', 
//     color: '#004d40', 
//     textAlign: 'center' 
//   },
//   subtitle: { 
//     fontSize: 14, 
//     color: '#00796b', 
//     textAlign: 'center',
//     marginTop: 8,
//     lineHeight: 20,
//   },
//   buttonWrapper: { 
//     width: '100%', 
//     gap: 15 
//   },
//   btn: { 
//     height: 55, 
//     borderRadius: 27, 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     width: '100%' 
//   },
//   btnWhite: { 
//     backgroundColor: '#FFFFFF',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   btnTransparent: { 
//     backgroundColor: 'rgba(255, 255, 255, 0.15)', 
//     borderWidth: 1.5,
//     borderColor: '#FFFFFF'
//   },
//   btnTextBlue: { 
//     color: '#03036a', 
//     fontSize: 17, 
//     fontWeight: '700' 
//   },
//   btnTextWhite: { 
//     color: '#160279', 
//     fontSize: 17, 
//     fontWeight: '700' 
//   },

//   // FOOTER STYLES
//   footerWrapper: {
//     paddingHorizontal: 20,
//     paddingBottom: 25,
//   },
//   glassFooter: {
//     backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     borderRadius: 25,
//     padding: 15,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   logoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   footerLogo: {
//     width: 40,
//     height: 40,
//   },
//   Viewider: {
//     width: 1,
//     height: 25,
//     backgroundColor: 'rgba(0,0,0,0.1)',
//     marginHorizontal: 20,
//   },
//   footerText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   copyright: {
//     fontSize: 10,
//     color: '#666',
//     letterSpacing: 0.5,
//   },
// });

// export default Home;























// import React, { useEffect, useRef } from 'react';
// import { 
//   StyleSheet, Text, View, TouchableOpacity, 
//   SafeAreaView, Animated, Dimensions, StatusBar, Easing, Image 
// } from 'react-native';
// import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
// import { useNavigation } from '@react-navigation/native'; 

// const { width, height } = Dimensions.get('window');

// const Home = () => {
//   const navigation = useNavigation(); 

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(40)).current;
//   const logoFloat = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
//     ]).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(logoFloat, { toValue: -12, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//         Animated.timing(logoFloat, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
//       {/* BACKGROUND SVG - Light Blue & Green Gradient Shapes */}
//       <View style={styles.backgroundShape}>
//         <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
//           <Defs>
//             <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <Stop offset="0%" stopColor="#d4ebffa7" />
//               <Stop offset="100%" stopColor="#eee2ff" />
//             </LinearGradient>
//             <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <Stop offset="0%" stopColor="#4643e9" />
//               <Stop offset="100%" stopColor="#38f9d7" />
//             </LinearGradient>
//           </Defs>
//           {/* Large decorative circles for the background */}
//           <Circle cx={width * 0.9} cy={height * 0.1} r={width * 0.4} fill="url(#bgGrad)" />
//           <Circle cx={width * 0.1} cy={height * 0.5} r={width * 0.5} fill="url(#accentGrad)" opacity={0.6} />
//         </Svg>
//       </View>

//       <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
//         {/* LOGO SECTION - Floating in white glass */}
//         <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoFloat }] }]}>
//             <View style={styles.whiteGlassCircle}>
//                 <Image 
//                   source={require("../../assets/logo_mgu.png")} 
//                   style={styles.logoImage} 
//                   resizeMode="contain" 
//                 />
//             </View>
//         </Animated.View>

//         {/* FROSTED GLASS CARD */}
//         <View style={styles.glassCard}>
//             <View style={styles.textSection}>
//                 <Text style={styles.title}>MOR GURUKUL</Text>
//                 <Text style={styles.subtitle}>Welcome to the Horticulture & Forestry Portal</Text>
//             </View>

//             <View style={styles.buttonWrapper}>
//                 <TouchableOpacity 
//                     onPress={() => navigation.navigate('WebsiteScreen')} 
//                     style={[styles.btn, styles.btnWhite]}
//                 >
//                     <Text style={styles.btnTextBlue}>Visit Website</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity 
//                     onPress={() => navigation.navigate('AuthLoading')} 
//                     style={[styles.btn, styles.btnTransparent]}
//                 >
//                     <Text style={styles.btnTextWhite}>Account Login</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>

//       </Animated.View>

//       <View style={[styles.bottomContainer,]}>
//         <View style={styles.logoRow}>
//           <Image
//             source={require('../../assets/logo_mgu.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//           <Image
//             source={require('../../assets/nic.png')}
//             style={styles.logo}
//             resizeMode="contain"
//           />
//         </View>
//         <Text style={styles.footerText}>महात्मा गांधी बागवानी एवं वानिकी विश्वविद्यालय</Text>
//       </View>


//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1, 
//     backgroundColor: '#e0f7fa' // Very light base color
//   },
//   backgroundShape: { 
//     position: 'absolute', 
//     top: 0, 
//     left: 0 
//   },
//   content: { 
//     flex: 1, 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     paddingHorizontal: 25 
//   },
//   logoContainer: { 
//     marginBottom: 40 
//   },
//   whiteGlassCircle: {
//     width: 130,
//     height: 130,
//     borderRadius: 65,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',  
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.8)',
//     // Soft shadow
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 15,
//     elevation: 8,
//   },
//   logoImage: { 
//     width: 90, 
//     height: 90 
//   },
//   glassCard: {
//     width: '100%',
//     paddingVertical: 40,
//     paddingHorizontal: 20,
//     borderRadius: 40,
//     backgroundColor: 'rgba(255, 255, 255, 0.6)', 
//     borderWidth: 1.5,
//     borderColor: 'rgba(255, 255, 255, 0.4)',
//     alignItems: 'center',
//   },
//   textSection: { 
//     alignItems: 'center', 
//     marginBottom: 45 
//   },
//   title: { 
//     fontSize: 30, 
//     fontWeight: 'bold', 
//     color: '#004d40', 
//     textAlign: 'center' 
//   },
//   subtitle: { 
//     fontSize: 15, 
//     color: '#00796b', 
//     textAlign: 'center',
//     marginTop: 8,
//     fontWeight: '500'
//   },
//   buttonWrapper: { 
//     width: '100%', 
//     gap: 15 
//   },
//   btn: { 
//     height: 60, 
//     borderRadius: 30, 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     width: '100%' 
//   },
//   btnWhite: { 
//     backgroundColor: '#FFFFFF',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   btnTransparent: { 
//     backgroundColor: 'rgba(255, 255, 255, 0.15)', 
//     borderWidth: 1.5,
//     borderColor: '#FFFFFF'
//   },
//   btnTextBlue: { 
//     color: '#03036a', 
//     fontSize: 18, 
//     fontWeight: '700' 
//   },
//   btnTextWhite: { 
//     color: '#03036a', 
//     fontSize: 18, 
//     fontWeight: '700' 
//   },

//     bottomContainer: {
//     alignItems: 'center',
//     paddingBottom: 20,
//   },

//   logoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '60%',
//     marginBottom: 10,
//   },

//   footerText: {
//     fontSize: 14,
//     color: '#333',
//     textAlign: 'center',
//   },
// });

// export default Home;
















// import React, { useEffect, useRef } from 'react';
// import { 
//   StyleSheet, Text, View, TouchableOpacity, 
//   SafeAreaView, Animated, Dimensions, StatusBar, Easing, Image 
// } from 'react-native';
// import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
// import { useNavigation } from '@react-navigation/native'; 

// const { width } = Dimensions.get('window');

// const Home = () => {
//   const navigation = useNavigation(); 

//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(40)).current;
//   const logoFloat = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
//     ]).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(logoFloat, { toValue: -12, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//         Animated.timing(logoFloat, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
//       ])
//     ).start();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       <View style={styles.backgroundShape}>
//         <Svg height="100%" width="100%" viewBox="0 0 100 100">
//            <Defs>
//             <LinearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//               <Stop offset="0%" stopColor="#2a1b43" />
//               <Stop offset="100%" stopColor="#a595d5" />
//             </LinearGradient>
//           </Defs>
//           <Rect x="-10" y="-25" width="95" height="95" rx="30" fill="url(#forestGrad)" transform="rotate(12)" />
//         </Svg>
//       </View>

//       <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
//         <Animated.View style={[styles.logoContainer, { transform: [{ translateY: logoFloat }] }]}>
//            <View style={styles.tiltedBox}>
//               <View style={styles.innerBoxRotate}>
//                 <Image 
//                   source={require("../../assets/logo_mgu.png")} 
//                   style={styles.logoImage} 
//                   resizeMode="contain" 
//                 />
//               </View>
//            </View>
//         </Animated.View>

//         <View style={styles.textSection}>
//           <Text style={styles.title}>MOR GURUKUL</Text>
//           <Text style={styles.subtitle}>Horticulture & Forestry Management</Text>
//         </View>

//         <View style={styles.buttonWrapper}>
//           <TouchableOpacity 
//             onPress={() => navigation.navigate('WebsiteScreen')} 
//             style={[styles.btn, styles.btnForest]}
//           >
//             <Text style={styles.btnTextWhite}>Visit Website</Text>
//           </TouchableOpacity>

//           <TouchableOpacity 
//             onPress={() => navigation.navigate('AuthLoading')} 
//             style={[styles.btn, styles.btnEarth]}
//           >
//             <Text style={styles.btnTextGreen}>Account Login</Text>
//           </TouchableOpacity>
//         </View>

//       </Animated.View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F7FFF7' },
//   backgroundShape: { position: 'absolute', top: -90, left: -50, width: width * 1.2, height: width * 1.2 },
//   content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
//   logoContainer: { 
//     marginBottom: 40, 
//     elevation: 12,
//     shadowColor: '#2D6A4F',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 15,
//   },
//   tiltedBox: { width: 140, height: 140, backgroundColor: '#FFFFFF', borderRadius: 90, transform: [{ rotate: '-12deg' }], alignItems: 'center', justifyContent: 'center' },
//   innerBoxRotate: { transform: [{ rotate: '12deg' }] },
//   logoImage: { width: 90, height: 90 },
//   textSection: { alignItems: 'center', marginBottom: 50 },
//   title: { fontSize: 32, fontWeight: '900', color: '#081C15', letterSpacing: 1 },
//   subtitle: { fontSize: 16, color: '#40916C', textAlign: 'center' },
//   buttonWrapper: { width: '100%', gap: 15 },
//   btn: { height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
//   btnForest: { backgroundColor: '#2a1b43' },
//   btnEarth: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#1B4332' },
//   btnTextWhite: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
//   btnTextGreen: { color: '#1B4332', fontSize: 18, fontWeight: '700' },
// });

// export default Home;