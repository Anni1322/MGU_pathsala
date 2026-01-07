// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// // import { CameraScreen } from "react-native-camera-kit";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const QRScanner = () => {
//   const [scannedValue, setScannedValue] = useState(null);

//   const onReadCode = async (event) => {
//     const value = event.nativeEvent.codeStringValue;
//     if (value && !scannedValue) {
//       setScannedValue(value);
//       await AsyncStorage.setItem("scannedQRValue", value);
//       Alert.alert("QR Scanned", `Value: ${value}`);
//     }
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {!scannedValue ? (
//         <CameraScreen
//           scanBarcode={true}
//           onReadCode={onReadCode}
//           showFrame={true}
//           laserColor="red"
//           frameColor="yellow"
//         />
        
//       ) : (
//         <View style={styles.overlay}>
//           <Text style={styles.text}>Scanned Value: {scannedValue}</Text>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => setScannedValue(null)}
//           >
//             <Text style={styles.buttonText}>Scan Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

export default QRScanner;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
