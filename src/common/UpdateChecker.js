import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  Platform, Linking, Modal, Animated, Dimensions, Image 
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check'; 
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const UpdateChecker = () => {
  const [showModal, setShowModal] = useState(false);
  const [isForceUpdate, setIsForceUpdate] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const checkForUpdate = async () => {
    try {
      const currentVersion = DeviceInfo.getVersion();
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
        packageName: 'mguvvmis.mguvv', 
      });
      // console.log(latestVersion,"latestVersion")
      // console.log(currentVersion,"latestVersion")

      if (currentVersion === latestVersion) return;

      if (await VersionCheck.needUpdate({ currentVersion, latestVersion })) {
        const force = false; 
        setIsForceUpdate(force);
        setShowModal(true);
        
        // Trigger entrance animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  const handleUpdate = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('itms-apps://itunes.apple.com/app/idYOUR_IOS_APP_ID');
    } else {
      Linking.openURL('market://details?id=mguvvmis.mguvv');
    }
  };

  return (
    <Modal transparent visible={showModal} animationType="fade">
      <View style={styles.overlay}>
        {/* Decorative Background for Modal */}
        <View style={styles.bgDecoration}>
            <Svg height={height} width={width}>
                <Circle cx={width * 0.8} cy={height * 0.4} r="100" fill="rgba(70, 67, 233, 0.2)" />
                <Circle cx={width * 0.2} cy={height * 0.6} r="80" fill="rgba(56, 249, 215, 0.2)" />
            </Svg>
        </View>

        <Animated.View style={[styles.glassCard, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconContainer}>
             <View style={styles.pulseCircle}>
                <Image 
                    source={require('../../assets/logo_mgu.png')} 
                    style={styles.logo} 
                    resizeMode="contain" 
                />
             </View>
          </View>

          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.message}>
            {isForceUpdate 
              ? 'A mandatory update is required to keep your forestry data synchronized.' 
              : 'New features are blooming! Update now for a better experience.'}
          </Text>

          <View style={styles.buttonRow}>
            {!isForceUpdate && (
              <TouchableOpacity 
                style={styles.btnLater} 
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.btnTextLater}>Later</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.btnUpdate, { width: isForceUpdate ? '100%' : '55%' }]} 
              onPress={handleUpdate}
            >
              <Text style={styles.btnTextUpdate}>Update Now</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 20, 40, 0.7)', // Dark semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  bgDecoration: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
  },
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 35,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconContainer: {
    marginTop: -70,
    marginBottom: 20,
  },
  pulseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#4643e9',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logo: {
    width: 65,
    height: 65,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d40',
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnLater: {
    width: '40%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  btnUpdate: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#1B4332',  
  },
  btnTextLater: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
  btnTextUpdate: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default UpdateChecker;











// import React, { useEffect } from 'react';
// import { Alert, Platform, Linking } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
// import VersionCheck from 'react-native-version-check'; 

// const UpdateChecker = () => {
//   const checkForUpdate = async () => {
//     try {
//       const currentVersion = DeviceInfo.getVersion();
//       const currentBuild = DeviceInfo.getBuildNumber();

//       // console.log('Device Current Version:', currentVersion);
//       // console.log('Device Current Build:', currentBuild);

//       // Fetch latest version from Play Store (or App Store for iOS)
//       const latestVersion = await VersionCheck.getLatestVersion({
//         provider: Platform.OS === 'ios' ? 'appStore' : 'playStore',
//         packageName: 'igkvmis.igkv', 
//       });

//       // console.log('Store Latest Version:', latestVersion);

//       // Explicit check: If device version matches store version, do not show alert
//       if (currentVersion === latestVersion) {
//         // console.log('Device and store versions are the same. No update needed. Alert not shown.');
//         return; 
//       }

//       if (VersionCheck.needUpdate({ currentVersion, latestVersion })) {
//         // Example: force update if major version differs or for specific versions.
//         const forceUpdate = false; // Set to true if mandatory (e.g., if latestVersion starts with '2.')

//         Alert.alert(
//           'Update Available',
//           forceUpdate
//             ? 'A new version is required to continue using the app.'
//             : 'A new version is available. Please update for the best experience.',
//           [
//             !forceUpdate && {
//               text: 'Later',
//               style: 'cancel',
//             },
//             {
//               text: 'Update Now',
//               onPress: () => {
//                 if (Platform.OS === 'ios') {
//                   Linking.openURL('itms-apps://itunes.apple.com/app/idYOUR_IOS_APP_ID');
//                 } else {
//                   Linking.openURL('market://details?id=igkvmis.igkv');
//                 }
//               },
//             },
//           ].filter(Boolean), 
//           { cancelable: !forceUpdate }
//         );
//       } else {
//         console.log('App is up to date. No alert shown.');
//       }
//     } catch (error) {
//       console.log('Update check failed:', error);
//     }
//   };
//   useEffect(() => {
//     checkForUpdate();
//   }, []);

//   return null;
// };

// export default UpdateChecker;

