// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
// // import { CameraKitCameraScreen } from 'react-native-camera-kit';
// import CameraKitCameraScreen from 'react-native-camera-kit';

// import * as CameraKit from 'react-native-camera-kit';
// console.log(CameraKit);


// export default function QRScannerScreen() {
//   const [scannedValue, setScannedValue] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   useEffect(() => {
//     async function requestCameraPermission() {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'This app requires access to your camera to scan QR codes.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//           console.warn(err);
//         }
//       } else {
//         // iOS permission handling if needed
//         setHasCameraPermission(true);
//       }
//     }

//     requestCameraPermission();
//   }, []);

//   const handleQRCodeScanned = (event) => {
//     const scannedData = event.nativeEvent.codeStringValue || event.nativeEvent.codeString;
//     if (scannedData) {
//       setScannedValue(scannedData);
//     }
//   };

//   if (!hasCameraPermission) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {scannedValue ? (
//         <View style={styles.resultContainer}>
//           <Text style={styles.label}>Scanned Number:</Text>
//           <Text style={styles.value}>{scannedValue}</Text>
//         </View>
//       ) : (
//         <CameraKitCameraScreen
//           scanBarcode={true}
//           onReadCode={handleQRCodeScanned}
//           showFrame={true}
//           laserColor="red"
//           frameColor="white"
//           cameraOptions={{
//             flashMode: 'auto', // 'on', 'off', 'auto'
//             focusMode: 'on',   // 'off', 'on'
//           }}
//           style={{ flex: 1 }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   permissionText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: 'red',
//   },
//   resultContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   label: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   value: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'green',
//   },
// });









// import React from 'react';
// import { View, Text } from 'react-native';
// import * as CameraKit from 'react-native-camera-kit';
// export default function QRScannerScreen() {
//   console.log('CameraKit:', CameraKit);
//   const CameraKitCameraScreen = CameraKit.Camera;
//   if (!CameraKitCameraScreen) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text style={{color: 'red'}}>CameraKitCameraScreen is NOT available!</Text>
//       </View>
//     );
//   }

//   return (
//     <CameraKitCameraScreen
//       scanBarcode={true}
//       onReadCode={event => console.log('Scanned:', event.nativeEvent.codeStringValue)}
//       style={{flex: 1}}
//     />
//   );
// }









// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
// import * as CameraKit from 'react-native-camera-kit';

// export default function QRScannerScreen() {
//   const [scannedValue, setScannedValue] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   console.log(CameraKit,"CameraKit");

//   useEffect(() => {
//     async function requestCameraPermission() {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'This app requires access to your camera to scan QR codes.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//           console.warn(err);
//         }
//       } else {
//         // iOS permission handling if needed
//         setHasCameraPermission(true);
//       }
//     }

//     requestCameraPermission();
//   }, []);

//   const handleQRCodeScanned = (event) => {
//     const scannedData = event.nativeEvent.codeStringValue || event.nativeEvent.codeString;
//     if (scannedData) {
//       setScannedValue(scannedData);
//     }
//   };

//   // Use the correct Camera component from CameraKit
 

//   if (!hasCameraPermission) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
//       </View>
//     );
//   }

//   if (!CameraKit.Camera) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Camera component is NOT available!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {scannedValue ? (
//         <View style={styles.resultContainer}>
//           <Text style={styles.label}>Scanned Value:</Text>
//           <Text style={styles.value}>{scannedValue}</Text>
//           <Text style={[styles.label, { marginTop: 20 }]}>Student Name:</Text>
//           <Text style={[styles.value, { color: 'blue' }]}>Rohit kumar</Text>
//         </View>
//       ) : (
//         <Camera
//           scanBarcode={true}
//           onReadCode={handleQRCodeScanned}
//           showFrame={true}
//           laserColor="red"
//           frameColor="white"
//           cameraOptions={{
//             flashMode: 'auto', // 'on', 'off', 'auto'
//             focusMode: 'on',   // 'off', 'on'
//           }}
//           style={{ flex: 1 }}
//         />
//       )}
//     </View>
//   );
// }








// import React, { useState, useEffect } from 'react';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'; 
// import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
// import * as CameraKit from 'react-native-camera-kit';

// export default function QRScannerScreen() {
//   const [scannedValue, setScannedValue] = useState(null);
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);

//   console.log(CameraKit, "CameraKit");

//   useEffect(() => {
//     async function requestCameraPermission() {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Camera Permission',
//               message: 'This app requires access to your camera to scan QR codes.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             }
//           );
//           console.log(granted === PermissionsAndroid.RESULTS.GRANTED,"granted");
//           setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
//         } catch (err) {
//           console.warn(err);
//         }
//       } else {
//         // iOS permission handling if needed
//         setHasCameraPermission(true);
//       }
//     }

//     requestCameraPermission();
//   }, []);

//   const handleQRCodeScanned = (event) => {
//     const scannedData = event.nativeEvent.codeStringValue || event.nativeEvent.codeString;
//     if (scannedData) {
//       setScannedValue(scannedData);
//     }
//   };

//   if (!hasCameraPermission) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
//       </View>
//     );
//   }

//   console.log(CameraKit.Camera);
//   console.log(CameraKit);
//   if (!CameraKit.Camera) {
//     return (
//       <View style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>Camera component is NOT available!</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {scannedValue ? (
//         <View style={styles.resultContainer}>
//           <Text style={styles.label}>Scanned Value:</Text>
//           <Text style={styles.value}>{scannedValue}</Text>
//           <Text style={[styles.label, { marginTop: 20 }]}>Student Name:</Text>
//           <Text style={[styles.value, { color: 'blue' }]}>Rohit kumar</Text>
//         </View>
//       ) : (
//         <CameraKit.Camera // Changed from <Camera> to <CameraKit.Camera>
//           scanBarcode={true}
//           onReadCode={handleQRCodeScanned}
//           showFrame={true}
//           laserColor="red"
//           frameColor="white"
//           style={{ flex: 1 }}
//           cameraOptions={{
//             flashMode: 'auto', // 'on', 'off', 'auto'
//             focusMode: 'on',   // 'off', 'on'
//           }}
//         />
//       )}
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   permissionText: {
//     fontSize: 18,
//     textAlign: 'center',
//     color: 'red',
//   },
//   resultContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   label: {
//     fontSize: 22,
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   value: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: 'green',
//   },
// });





// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
// import { scanBarcodes, BarcodeFormat } from 'react-native-vision-camera';
// import * as cam from 'react-native-vision-camera';
 

// const QRScanPage = () => {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [scannedData, setScannedData] = useState(null);
//   const devices = useCameraDevices();
  
//   const device = devices[0];
//   // console.log(devices,"device");
//   // console.log(devices[0].position,"position");
//   // console.log(cam,"cam");

//   // console.log(BarcodeFormat,useScanBarcodes ,"visonCamera");

//   useEffect(() => {
//     async function requestPermission() {
//       try {

//         const permissionStatus = await cam.Camera.requestCameraPermission();
//         console.log('Permission Status:', permissionStatus);  
//         if (permissionStatus === 'granted') {
//           setHasPermission(true);
//           console.log('Camera permission granted successfully.');
//         } else {
//           console.log('Camera permission denied or not determined.');
//           setHasPermission(false);
//           Alert.alert('Error', 'Camera permission is required.');
//         }
//       } catch (error) {
//         console.error('Error requesting camera permission:', error);
//         Alert.alert('Error', 'Failed to request camera permission.');
//       }
//     }
//     requestPermission();
//   }, []);

//   // Frame processor with added debugging
//   const frameProcessor = useFrameProcessor(
//     (frame) => {
//       'worklet';
//       try {
        
//         console.log('Frame processor running...');   
//         const barcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
//         console.log('Barcodes detected:', barcodes.length);  
//         if (barcodes.length > 0 && !scannedData) {
//           const qrData = barcodes[0].value;
//           console.log('QR Code detected:', qrData); 
//           runOnJS(handleQRScanned)(qrData);
//         }


//       } catch (error) {
//         console.error('Error in frame processor:', error);  
//       }
//     },
//     [scannedData]
//   );

//   const handleQRScanned = (data) => {
//     console.log('Handling QR scanned data:', data);  // Add log here
//     setScannedData(data);
//     Alert.alert('QR Code Scanned', `Data: ${data}`);
//   };

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text>Camera permission is required to scan QR codes.</Text>
//       </View>
//     );
//   }

//   if (device == null) {
//     console.log('No camera device found.');  // Add log for this case
//     return (
//       <View style={styles.container}>
//         <Text>Loading camera... or no back camera available.</Text>
//       </View>
//     );
//   }

//   if (scannedData) {
//     return (
//       <View style={styles.container}>
//         <Text>Scanned QR Code: {scannedData}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         frameProcessor={frameProcessor}
//         frameProcessorFps={5}
//       />
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default QRScanPage;




 








// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import { Camera } from 'react-native-vision-camera';

// export default function QRScanner() {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [scannedData, setScannedData] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const permission = await Camera.requestCameraPermission();
//       setHasPermission(permission === 'granted');
//     })();
//   }, []);

//   const onBarcodeScanned = (event) => {
//     setScannedData(event.data);  // event.data contains the QR code data
//   };

//   if (!hasPermission) return <Text>Requesting camera permission...</Text>;

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         onBarcodeScanned={onBarcodeScanned}
//         barcodeScannerEnabled={true}
//       />
//       {scannedData && <Text>Scanned: {scannedData}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
// });


 
 
 






































import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
// import * as CameraKit from 'react-native-camera-kit';

export default function QRScannerScreen() {
  const [scannedValue, setScannedValue] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    async function requestCameraPermission() {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'This app requires access to your camera to scan QR codes.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
          console.warn(err);
        }
      } else {
        // iOS permission handling if needed
        setHasCameraPermission(true);
      }
    }

    requestCameraPermission();
  }, []);

  const handleQRCodeScanned = (event) => {
    const scannedData = event.nativeEvent.codeStringValue || event.nativeEvent.codeString;
    if (scannedData) {
      setScannedValue(scannedData);
    }
  };

  // Use the correct Camera component from CameraKit
  // const Camera = CameraKit.Camera;

  if (!hasCameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
      </View>
    );
  }

  // if (!Camera) {
  //   return (
  //     <View style={styles.permissionContainer}>
  //       <Text style={styles.permissionText}>Camera component is NOT available!</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {scannedValue ? (
        <View style={styles.resultContainer}>
          <Text style={styles.label}>Scanned Value:</Text>
          <Text style={styles.value}>{scannedValue}</Text>
          <Text style={[styles.label, { marginTop: 20 }]}>Student Name:</Text>
          <Text style={[styles.value, { color: 'blue' }]}>Rohit kumar</Text>
        </View>
      ) : (
        <Camera
          scanBarcode={true}
          onReadCode={handleQRCodeScanned}
          showFrame={true}
          laserColor="red"
          frameColor="white"
          cameraOptions={{
            flashMode: 'auto', // 'on', 'off', 'auto'
            focusMode: 'on',   // 'off', 'on'
          }}
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'green',
  },
});
