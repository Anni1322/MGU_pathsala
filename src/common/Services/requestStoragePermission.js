// import { PermissionsAndroid, Platform } from 'react-native';

// const requestAndroidPermission = async () => {
//   if (Platform.OS === 'android' && Platform.Version <= 28) {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         {
//           title: 'Storage Permission Required',
//           message: 'This app needs access to your storage to download files',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );

//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   } else {
//     // On Android 10+ WRITE_EXTERNAL_STORAGE is not needed
//     return true;
//   }
// };

// export default requestAndroidPermission;








// import { PermissionsAndroid, Platform, Alert } from 'react-native';
// const requestAndroidPermission = async () => {
//   if (Platform.OS !== 'android') return true;

//   try {
//     if (Platform.Version >= 33) {
//       // Android 13+ (API 33+)
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
//       ]);

//       return Object.values(granted).every(
//         (status) => status === PermissionsAndroid.RESULTS.GRANTED
//       );
//     } else if (Platform.Version >= 29) {
//       // Android 10–12 (API 29–32)
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       ]);

//       return Object.values(granted).every(
//         (status) => status === PermissionsAndroid.RESULTS.GRANTED
//       );
//     } else {
//       // Android 9 and below
//       const granted = await PermissionsAndroid.requestMultiple([
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       ]);

//       return Object.values(granted).every(
//         (status) => status === PermissionsAndroid.RESULTS.GRANTED
//       );
//     }
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// export default requestAndroidPermission;









import { PermissionsAndroid, Platform, Alert } from 'react-native';

const requestAndroidPermission = async () => {
  if (Platform.OS !== 'android') return true; // Skip for iOS

  try {
    const permissions = [];

    /**
     * STORAGE PERMISSIONS
     * - Android 9 (API 28) and below: need READ/WRITE_EXTERNAL_STORAGE
     * - Android 10–12 (API 29–32): uses Scoped Storage (no WRITE permission needed)
     * - Android 13+ (API 33+): uses new READ_MEDIA_* permissions
     */
    if (Platform.Version <= 28) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
    } else if (Platform.Version >= 33) {
      permissions.push(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
      );
    } else {
      // Android 10–12: only READ permission for backward compatibility
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    }

    /**
     * OTHER SAFE PERMISSIONS
     */
    // Camera (for capturing images or video)
    permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);

    // Microphone (for recording or video calls)
    permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);

    // Location (if used for maps or nearby features)
    permissions.push(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
    );

    // Notifications (Android 13+ only)
    if (Platform.Version >= 33) {
      permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    // Request permissions from user
    const granted = await PermissionsAndroid.requestMultiple(permissions);

    // Check if all permissions were granted
    const allGranted = Object.values(granted).every(
      (status) => status === PermissionsAndroid.RESULTS.GRANTED
    );

    // if (!allGranted) {
    //   Alert.alert(
    //     'Permissions Needed',
    //     'Some permissions were denied. You can enable them later from Settings to ensure full functionality.'
    //   );
    //   return false;
    // }

    // console.log('✅ All required permissions granted.');
    return true;
  } catch (error) {
    console.warn('Permission request error:', error);
    return false;
  }
};

export default requestAndroidPermission;
