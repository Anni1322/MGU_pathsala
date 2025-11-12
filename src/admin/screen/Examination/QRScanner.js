
// woking

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking, FlatList, Modal, TextInput, ScrollView } from "react-native";
// import { Camera, useCameraDevice, useCodeScanner, useFrameProcessor } from "react-native-vision-camera";
// import { runOnJS } from "react-native-reanimated";
// import { recognizeText } from "@react-native-vision-camera/text-recognition"; // Import the plugin
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const QRScanner = () => {
//   const device = useCameraDevice('back');
//   const [hasPermission, setHasPermission] = useState(false);
//   const [scannedValue, setScannedValue] = useState(null);
//   const [parsedData, setParsedData] = useState({}); // Object to hold parsed student data
//   const [scannedLinks, setScannedLinks] = useState([]); // Array to hold list of scanned links
//   const [studentRecords, setStudentRecords] = useState([]); // Array to hold submitted student records
//   const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
//   const [scanMode, setScanMode] = useState('qr'); // 'qr' or 'text' for mode switching

//   // Function to check if a string is a valid URL
//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   // Function to parse QR data into key-value pairs (handles multi-line format like the example)
//   const parseStudentData = (data) => {
//     const lines = data.split('\n').map(line => line.trim()).filter(line => line); // Split by newline, trim, remove empty
//     const parsed = {};
//     lines.forEach(line => {
//       if (line.includes(':')) {
//         const [key, ...valueParts] = line.split(':');
//         const value = valueParts.join(':').trim(); // Rejoin in case value has ':'
//         const cleanKey = key.trim().toLowerCase().replace(/\s+/g, ''); // Clean key: lowercase, remove spaces
//         if (cleanKey && value) {
//           parsed[cleanKey] = value;
//         }
//       } else if (line.startsWith('*')) {
//         // Handle university line like "*MGUVV,Durg (C.G.)"
//         parsed['university'] = line.substring(1).trim();
//       }
//       // Skip lines without ':' or '*'
//     });
//     return parsed;
//   };

//   // Load scanned links and student records from AsyncStorage on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedLinks = await AsyncStorage.getItem("scannedLinks");
//         if (storedLinks) {
//           setScannedLinks(JSON.parse(storedLinks));
//         }
//         const storedRecords = await AsyncStorage.getItem("studentRecords");
//         if (storedRecords) {
//           setStudentRecords(JSON.parse(storedRecords));
//         }
//       } catch (error) {
//         console.error("Error loading data:", error);
//       }
//     };
//     loadData();
//   }, []);

//   // Request camera permission
//   useEffect(() => {
//     const requestPermission = async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === "granted");
//     };
//     requestPermission();
//   }, []);

//   // Code scanner hook for QR codes
//   const codeScanner = useCodeScanner({
//     codeTypes: ['qr'], // Only for QR
//     onCodeScanned: async (codes) => {
//       if (scannedValue || codes.length === 0) return; // Prevent multiple scans
//       const data = codes[0].value; // Detected QR value
//       setScannedValue(data);

//       // Parse the data if it's student info
//       const parsed = parseStudentData(data);
//       if (Object.keys(parsed).length > 0) {
//         setParsedData(parsed);
//       } else if (isValidUrl(data)) {
//         // If it's a URL, add to links list
//         const updatedLinks = [...scannedLinks, data];
//         setScannedLinks(updatedLinks);
//         try {
//           await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
//         } catch (error) {
//           console.error("AsyncStorage error:", error);
//         }
//       }

//       Alert.alert("QR Scanned", `Value: ${data}`);
//     },
//   });

//   // Frame processor for text recognition (only if plugin is available)
//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet';
//     try {
//       const result = recognizeText(frame); // Use the plugin's function
//       if (result && result.text) {
//         runOnJS(setScannedValue)(result.text);
//         runOnJS(Alert.alert)("Text Recognized", `Value: ${result.text}`);
//       }
//     } catch (error) {
//       console.error("Text recognition error:", error); // Log but don't crash
//     }
//   }, []);

//   // Reset to scan again
//   const resetScan = () => {
//     setScannedValue(null);
//     setParsedData({});
//   };

//   // Toggle scan mode
//   const toggleMode = () => {
//     setScanMode(scanMode === 'qr' ? 'text' : 'qr');
//     setScannedValue(null);
//     setParsedData({});
//   };

//   // Function to handle link click
//   const handleLinkPress = (url) => {
//     Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
//   };

//   // Function to delete a link from the list
//   const deleteLink = async (index) => {
//     const updatedLinks = scannedLinks.filter((_, i) => i !== index);
//     setScannedLinks(updatedLinks);
//     try {
//       await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
//     } catch (error) {
//       console.error("Error saving after delete:", error);
//     }
//   };

//   // Function to submit student data
//   const submitStudentData = async () => {
//     if (Object.keys(parsedData).length === 0) {
//       Alert.alert("Error", "No data to submit.");
//       return;
//     }
//     const updatedRecords = [...studentRecords, parsedData];
//     setStudentRecords(updatedRecords);
//     try {
//       await AsyncStorage.setItem("studentRecords", JSON.stringify(updatedRecords));
//       Alert.alert("Success", "Student data submitted!");
//       resetScan(); // Reset after submission
//     } catch (error) {
//       console.error("Error saving student data:", error);
//       Alert.alert("Error", "Failed to save data.");
//     }
//   };

//   // Function to handle submit button (opens modal for links)
//   const handleSubmit = () => {
//     setModalVisible(true);
//   };

//   // Render item for FlatList
//   const renderLinkItem = ({ item, index }) => (
//     <View style={styles.linkItem}>
//       <TouchableOpacity style={styles.linkTouchable} onPress={() => handleLinkPress(item)}>
//         <Text style={styles.linkText}>{item}</Text>
//       </TouchableOpacity>
//       <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLink(index)}>
//         <Text style={styles.deleteText}>Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // Render item for modal FlatList (without delete button)
//   const renderModalLinkItem = ({ item }) => (
//     <TouchableOpacity style={styles.modalLinkItem} onPress={() => handleLinkPress(item)}>
//       <Text style={styles.modalLinkText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   // Waiting UI
//   if (device == null) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>Camera permission not granted</Text>
//       </View>
//     );
//   }

//   // Scanner view
//   return (
//     <View style={styles.container}>
//       {/* Mode toggle button */}
//       <View style={styles.modeContainer}>
//         <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
//           <Text style={styles.modeText}>
//             Switch to {scanMode === 'qr' ? 'Text Recognition' : 'QR Scan'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {!scannedValue ? (
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           codeScanner={scanMode === 'qr' ? codeScanner : undefined} // Only use codeScanner for QR
//           frameProcessor={scanMode === 'text' ? frameProcessor : undefined} // Use frameProcessor for text
//         />
//       ) : (
//         <View style={styles.overlay}>
//           {Object.keys(parsedData).length > 0 ? (
//             <ScrollView style={styles.formContainer}>
//               <Text style={styles.formTitle}>Student Details</Text>
//               {Object.entries(parsedData).map(([key, value]) => (
//                 <View key={key} style={styles.inputContainer}>
//                   <Text style={styles.label}>
//                     {key === 'certificatenumber' ? 'Certificate Number' :
//                       key === 'name' ? 'Name' :
//                         key === 'session' ? 'Session' :
//                           key === 'universityid' ? 'University ID' :
//                             key === 'ogpa' ? 'OGPA' :
//                               key === 'degreeprogramme' ? 'Degree Programme' :
//                                 key === 'university' ? 'University' :
//                                   key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     value={value}
//                     onChangeText={(text) => setParsedData({ ...parsedData, [key]: text })}
//                     placeholder={`Enter ${key}`}
//                   />
//                 </View>
//               ))}
//               <TouchableOpacity style={styles.submitFormButton} onPress={submitStudentData}>
//                 <Text style={styles.submitFormText}>Submit Data</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           ) : (
//             <Text style={styles.text}>
//               {scanMode === 'qr' ? 'Scanned QR' : 'Recognized Text'}: {scannedValue}
//             </Text>
//           )}
//           <TouchableOpacity style={styles.button} onPress={resetScan}>
//             <Text style={styles.buttonText}>Scan Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Link list box - only show in QR mode */}
//       {scanMode === 'qr' && (
//         <View style={styles.linkListContainer}>
//           <View style={styles.listHeader}>
//             <Text style={styles.listTitle}>Scanned Links:</Text>
//             <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//               <Text style={styles.submitText}>Submit All</Text>
//             </TouchableOpacity>
//           </View>
//           <FlatList
//             data={scannedLinks}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={renderLinkItem}
//             style={styles.flatList}
//           />
//         </View>
//       )}

//       {/* Modal for displaying all links */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>All Scanned Links</Text>
//             <FlatList
//               data={scannedLinks}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={renderModalLinkItem}
//               style={styles.modalFlatList}
//             />
//             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default QRScanner;

// // Updated Styles (unchanged)
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   info: { fontSize: 16, color: "#666" },
//   modeContainer: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//     zIndex: 10,
//   },
//   modeButton: {
//     backgroundColor: '#ffa500',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignSelf: 'center',
//   },
//   modeText: { color: '#fff', fontWeight: 'bold' },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.8)",
//     padding: 20,
//   },
//   text: { color: "#fff", fontSize: 18, marginBottom: 20, textAlign: 'center' },
//   formContainer: { width: '100%', maxHeight: '80%' },
//   formTitle: { color: "#fff", fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   inputContainer: { marginBottom: 15 },
//   label: { color: "#fff", fontSize: 16, marginBottom: 5 },
//   input: {
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 5,
//     fontSize: 16,
//   },
//   submitFormButton: {
//     backgroundColor: "#28a745",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//     alignSelf: 'center',
//   },
//   submitFormText: { color: "#fff", fontWeight: "bold" },
//   button: {
//     backgroundColor: "#1e90ff",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
//   linkListContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     padding: 10,
//     maxHeight: 200,
//   },
//   listHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   listTitle: { fontSize: 16, fontWeight: 'bold' },
//   submitButton: {
//     backgroundColor: '#28a745',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   submitText: { color: '#fff', fontWeight: 'bold' },
//   flatList: { flex: 1 },
//   linkItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   linkTouchable: { flex: 1 },
//   linkText: { color: '#007bff', textDecorationLine: 'underline', flex: 1 },
//   deleteButton: {
//     backgroundColor: '#ff4444',
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   deleteText: { color: '#fff', fontWeight: 'bold' },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     maxHeight: '70%',
//   },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
//   modalFlatList: { flex: 1 },
//   modalLinkItem: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   modalLinkText: { color: '#007bff', textDecorationLine: 'underline' },
//   closeButton: {
//     backgroundColor: '#6c757d',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginTop: 10,
//     alignSelf: 'center',
//   },
//   closeText: { color: '#fff', fontWeight: 'bold' },
// });



















// // working QR

//  import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
// import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const QRScanner = () => {
//   const device = useCameraDevice('back');
//   const [hasPermission, setHasPermission] = useState(false);
//   const [scannedValue, setScannedValue] = useState(null);

//   // Request camera permission
//   useEffect(() => {
//     const requestPermission = async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === "granted");
//     };
//     requestPermission();
//   }, []);

//   // Code scanner hook for real-time QR detection
//   const codeScanner = useCodeScanner({
//     codeTypes: ['qr'], // Focus on QR codes
//     onCodeScanned: async (codes) => {
//       if (scannedValue || codes.length === 0) return; // Prevent multiple scans
//       const data = codes[0].value; // First detected code
//       setScannedValue(data);
//       try {
//         await AsyncStorage.setItem("scannedQRValue", data);
//         Alert.alert("QR Scanned", `Value: ${data}`);
//       } catch (error) {
//         console.error("AsyncStorage error:", error);
//         Alert.alert("Error", "Failed to save scanned value.");
//       }
//     },
//   });

//   // Reset to scan again
//   const resetScan = () => {
//     setScannedValue(null);
//   };

//   // Waiting UI
//   if (device == null) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>Camera permission not granted</Text>
//       </View>
//     );
//   }

//   // Scanner view
//   return (
//     <View style={styles.container}>
//       {!scannedValue ? (
//         <Camera
//           style={StyleSheet.absoluteFill}
//           device={device}
//           isActive={true}
//           codeScanner={codeScanner} // Enable real-time scanning
//         />
//       ) : (
//         <View style={styles.overlay}>
//           <Text style={styles.text}>Scanned Value: {scannedValue}</Text>
//           <TouchableOpacity style={styles.button} onPress={resetScan}>
//             <Text style={styles.buttonText}>Scan Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };


// export default QRScanner;

// // Styles (unchanged)
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   info: { fontSize: 16, color: "#666" },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.8)",
//   },
//   text: { color: "#fff", fontSize: 18, marginBottom: 20 },
//   button: {
//     backgroundColor: "#1e90ff",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold" },
// });


















// // import React, { useState, useEffect } from "react";
// // import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking, FlatList } from "react-native";
// // import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const QRScanner = () => {
// //   const device = useCameraDevice('back');
// //   const [hasPermission, setHasPermission] = useState(false);
// //   const [scannedValue, setScannedValue] = useState(null);
// //   const [scannedLinks, setScannedLinks] = useState([]); // Array to hold list of scanned links

// //   // Function to check if a string is a valid URL
// //   const isValidUrl = (string) => {
// //     try {
// //       new URL(string);
// //       return true;
// //     } catch (_) {
// //       return false;
// //     }
// //   };

// //   // Load scanned links from AsyncStorage on component mount
// //   useEffect(() => {
// //     const loadScannedLinks = async () => {
// //       try {
// //         const storedLinks = await AsyncStorage.getItem("scannedLinks");
// //         if (storedLinks) {
// //           setScannedLinks(JSON.parse(storedLinks));
// //         }
// //       } catch (error) {
// //         console.error("Error loading scanned links:", error);
// //       }
// //     };
// //     loadScannedLinks();
// //   }, []);

// //   // Request camera permission
// //   useEffect(() => {
// //     const requestPermission = async () => {
// //       const status = await Camera.requestCameraPermission();
// //       setHasPermission(status === "granted");
// //     };
// //     requestPermission();
// //   }, []);

// //   // Code scanner hook for real-time QR detection
// //   const codeScanner = useCodeScanner({
// //     codeTypes: ['qr'], // Focus on QR codes
// //     onCodeScanned: async (codes) => {
// //       if (scannedValue || codes.length === 0) return; // Prevent multiple scans
// //       const data = codes[0].value; // First detected code
// //       setScannedValue(data);

// //       // If it's a valid URL, add to links list
// //       if (isValidUrl(data)) {
// //         const updatedLinks = [...scannedLinks, data];
// //         setScannedLinks(updatedLinks);
// //         try {
// //           await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //         } catch (error) {
// //           console.error("AsyncStorage error:", error);
// //         }
// //       }

// //       Alert.alert("QR Scanned", `Value: ${data}`);
// //     },
// //   });

// //   // Reset to scan again
// //   const resetScan = () => {
// //     setScannedValue(null);
// //   };

// //   // Function to handle link click
// //   const handleLinkPress = (url) => {
// //     Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
// //   };

// //   // Function to delete a link from the list
// //   const deleteLink = async (index) => {
// //     const updatedLinks = scannedLinks.filter((_, i) => i !== index);
// //     setScannedLinks(updatedLinks);
// //     try {
// //       await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //     } catch (error) {
// //       console.error("Error saving after delete:", error);
// //     }
// //   };

// //   // Render item for FlatList
// //   const renderLinkItem = ({ item, index }) => (
// //     <View style={styles.linkItem}>
// //       <TouchableOpacity style={styles.linkTouchable} onPress={() => handleLinkPress(item)}>
// //         <Text style={styles.linkText}>{item}</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLink(index)}>
// //         <Text style={styles.deleteText}>Delete</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Waiting UI
// //   if (device == null) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Loading camera...</Text>
// //       </View>
// //     );
// //   }

// //   if (!hasPermission) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Camera permission not granted</Text>
// //       </View>
// //     );
// //   }

// //   // Scanner view
// //   return (
// //     <View style={styles.container}>
// //       {!scannedValue ? (
// //         <Camera
// //           style={StyleSheet.absoluteFill}
// //           device={device}
// //           isActive={true}
// //           codeScanner={codeScanner} // Enable real-time scanning
// //         />
// //       ) : (
// //         <View style={styles.overlay}>
// //           <Text style={styles.text}>Scanned Value: {scannedValue}</Text>
// //           <TouchableOpacity style={styles.button} onPress={resetScan}>
// //             <Text style={styles.buttonText}>Scan Again</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //       {/* Link list box - always visible */}
// //       <View style={styles.linkListContainer}>
// //         <Text style={styles.listTitle}>Scanned Links:</Text>
// //         <FlatList
// //           data={scannedLinks}
// //           keyExtractor={(item, index) => index.toString()}
// //           renderItem={renderLinkItem}
// //           style={styles.flatList}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // export default QRScanner;

// // // Updated Styles
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   info: { fontSize: 16, color: "#666" },
// //   overlay: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.8)",
// //   },
// //   text: { color: "#fff", fontSize: 18, marginBottom: 20 },
// //   button: {
// //     backgroundColor: "#1e90ff",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //   },
// //   buttonText: { color: "#fff", fontWeight: "bold" },
// //   linkListContainer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: 'rgba(255,255,255,0.9)',
// //     padding: 10,
// //     maxHeight: 200, // Limit height to make it a "box"
// //   },
// //   listTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
// //   flatList: { flex: 1 },
// //   linkItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   linkTouchable: { flex: 1 },
// //   linkText: { color: '#007bff', textDecorationLine: 'underline', flex: 1 },
// //   deleteButton: {
// //     backgroundColor: '#ff4444',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //     marginLeft: 10,
// //   },
// //   deleteText: { color: '#fff', fontWeight: 'bold' },
// // });














// // its working

// // import React, { useState, useEffect } from "react";
// // import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking, FlatList, Modal } from "react-native";
// // import { Camera, useCameraDevice, useCodeScanner } from "react-native-vision-camera";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const QRScanner = () => {
// //   const device = useCameraDevice('back');
// //   const [hasPermission, setHasPermission] = useState(false);
// //   const [scannedValue, setScannedValue] = useState(null);
// //   const [scannedLinks, setScannedLinks] = useState([]); // Array to hold list of scanned links
// //   const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

// //   // Function to check if a string is a valid URL
// //   const isValidUrl = (string) => {
// //     try {
// //       new URL(string);
// //       return true;
// //     } catch (_) {
// //       return false;
// //     }
// //   };

// //   // Load scanned links from AsyncStorage on component mount
// //   useEffect(() => {
// //     const loadScannedLinks = async () => {
// //       try {
// //         const storedLinks = await AsyncStorage.getItem("scannedLinks");
// //         if (storedLinks) {
// //           setScannedLinks(JSON.parse(storedLinks));
// //         }
// //       } catch (error) {
// //         console.error("Error loading scanned links:", error);
// //       }
// //     };
// //     loadScannedLinks();
// //   }, []);

// //   // Request camera permission
// //   useEffect(() => {
// //     const requestPermission = async () => {
// //       const status = await Camera.requestCameraPermission();
// //       setHasPermission(status === "granted");
// //     };
// //     requestPermission();
// //   }, []);

// //   // Code scanner hook for real-time QR detection
// //   const codeScanner = useCodeScanner({
// //     codeTypes: ['qr'], // Focus on QR codes
// //     onCodeScanned: async (codes) => {
// //       if (scannedValue || codes.length === 0) return; // Prevent multiple scans
// //       const data = codes[0].value; // First detected code
// //       setScannedValue(data);

// //       // If it's a valid URL, add to links list
// //       if (isValidUrl(data)) {
// //         const updatedLinks = [...scannedLinks, data];
// //         setScannedLinks(updatedLinks);
// //         try {
// //           await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //         } catch (error) {
// //           console.error("AsyncStorage error:", error);
// //         }
// //       }

// //       Alert.alert("QR Scanned", `Value: ${data}`);
// //     },
// //   });

// //   // Reset to scan again
// //   const resetScan = () => {
// //     setScannedValue(null);
// //   };

// //   // Function to handle link click
// //   const handleLinkPress = (url) => {
// //     Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
// //   };

// //   // Function to delete a link from the list
// //   const deleteLink = async (index) => {
// //     const updatedLinks = scannedLinks.filter((_, i) => i !== index);
// //     setScannedLinks(updatedLinks);
// //     try {
// //       await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //     } catch (error) {
// //       console.error("Error saving after delete:", error);
// //     }
// //   };

// //   // Function to handle submit button (opens modal)
// //   const handleSubmit = () => {
// //     setModalVisible(true);
// //   };

// //   // Render item for FlatList
// //   const renderLinkItem = ({ item, index }) => (
// //     <View style={styles.linkItem}>
// //       <TouchableOpacity style={styles.linkTouchable} onPress={() => handleLinkPress(item)}>
// //         <Text style={styles.linkText}>{item}</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLink(index)}>
// //         <Text style={styles.deleteText}>Delete</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Render item for modal FlatList (without delete button)
// //   const renderModalLinkItem = ({ item }) => (
// //     <TouchableOpacity style={styles.modalLinkItem} onPress={() => handleLinkPress(item)}>
// //       <Text style={styles.modalLinkText}>{item}</Text>
// //     </TouchableOpacity>
// //   );

// //   // Waiting UI
// //   if (device == null) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Loading camera...</Text>
// //       </View>
// //     );
// //   }

// //   if (!hasPermission) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Camera permission not granted</Text>
// //       </View>
// //     );
// //   }

// //   // Scanner view
// //   return (
// //     <View style={styles.container}>
// //       {!scannedValue ? (
// //         <Camera
// //           style={StyleSheet.absoluteFill}
// //           device={device}
// //           isActive={true}
// //           codeScanner={codeScanner} // Enable real-time scanning
// //         />
// //       ) : (
// //         <View style={styles.overlay}>
// //           <Text style={styles.text}>Scanned Value: {scannedValue}</Text>
// //           <TouchableOpacity style={styles.button} onPress={resetScan}>
// //             <Text style={styles.buttonText}>Scan Again</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}
// //       {/* Link list box - always visible */}
// //       <View style={styles.linkListContainer}>
// //         <View style={styles.listHeader}>
// //           <Text style={styles.listTitle}>Scanned Links:</Text>
// //           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
// //             <Text style={styles.submitText}>Submit All</Text>
// //           </TouchableOpacity>
// //         </View>
// //         <FlatList
// //           data={scannedLinks}
// //           keyExtractor={(item, index) => index.toString()}
// //           renderItem={renderLinkItem}
// //           style={styles.flatList}
// //         />
// //       </View>

// //       {/* Modal for displaying all links */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>All Scanned Links</Text>
// //             <FlatList
// //               data={scannedLinks}
// //               keyExtractor={(item, index) => index.toString()}
// //               renderItem={renderModalLinkItem}
// //               style={styles.modalFlatList}
// //             />
// //             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
// //               <Text style={styles.closeText}>Close</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // export default QRScanner;

// // // Updated Styles
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   info: { fontSize: 16, color: "#666" },
// //   overlay: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.8)",
// //   },
// //   text: { color: "#fff", fontSize: 18, marginBottom: 20 },
// //   button: {
// //     backgroundColor: "#1e90ff",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //   },
// //   buttonText: { color: "#fff", fontWeight: "bold" },
// //   linkListContainer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: 'rgba(255,255,255,0.9)',
// //     padding: 10,
// //     maxHeight: 200, 
// //   },
// //   listHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   listTitle: { fontSize: 16, fontWeight: 'bold' },
// //   submitButton: {
// //     backgroundColor: '#28a745',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //   },
// //   submitText: { color: '#fff', fontWeight: 'bold' },
// //   flatList: { flex: 1 },
// //   linkItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   linkTouchable: { flex: 1 },
// //   linkText: { color: '#007bff', textDecorationLine: 'underline', flex: 1 },
// //   deleteButton: {
// //     backgroundColor: '#ff4444',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //     marginLeft: 10,
// //   },
// //   deleteText: { color: '#fff', fontWeight: 'bold' },
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 10,
// //     width: '80%',
// //     maxHeight: '70%',
// //   },
// //   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
// //   modalFlatList: { flex: 1 },
// //   modalLinkItem: {
// //     padding: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   modalLinkText: { color: '#007bff', textDecorationLine: 'underline' },
// //   closeButton: {
// //     backgroundColor: '#6c757d',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 5,
// //     marginTop: 10,
// //     alignSelf: 'center',
// //   },
// //   closeText: { color: '#fff', fontWeight: 'bold' },
// // });



















// // import React, { useState, useEffect } from "react";
// // import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking, FlatList, Modal } from "react-native";
// // import { Camera, useCameraDevice, useCodeScanner, useFrameProcessor } from "react-native-vision-camera";
// // import { runOnJS } from "react-native-reanimated";
// // import { recognizeText } from "@react-native-vision-camera/text-recognition"; // Import the plugin
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const QRScanner = () => {
// //   const device = useCameraDevice('back');
// //   const [hasPermission, setHasPermission] = useState(false);
// //   const [scannedValue, setScannedValue] = useState(null);
// //   const [scannedLinks, setScannedLinks] = useState([]); // Array to hold list of scanned links
// //   const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
// //   const [scanMode, setScanMode] = useState('qr'); // 'qr' or 'text' for mode switching

// //   // Function to check if a string is a valid URL
// //   const isValidUrl = (string) => {
// //     try {
// //       new URL(string);
// //       return true;
// //     } catch (_) {
// //       return false;
// //     }
// //   };

// //   // Load scanned links from AsyncStorage on component mount
// //   useEffect(() => {
// //     const loadScannedLinks = async () => {
// //       try {
// //         const storedLinks = await AsyncStorage.getItem("scannedLinks");
// //         if (storedLinks) {
// //           setScannedLinks(JSON.parse(storedLinks));
// //         }
// //       } catch (error) {
// //         console.error("Error loading scanned links:", error);
// //       }
// //     };
// //     loadScannedLinks();
// //   }, []);

// //   // Request camera permission
// //   useEffect(() => {
// //     const requestPermission = async () => {
// //       const status = await Camera.requestCameraPermission();
// //       setHasPermission(status === "granted");
// //     };
// //     requestPermission();
// //   }, []);

// //   // Code scanner hook for QR codes
// //   const codeScanner = useCodeScanner({
// //     codeTypes: ['qr'], // Only for QR
// //     onCodeScanned: async (codes) => {
// //       if (scannedValue || codes.length === 0) return; // Prevent multiple scans
// //       const data = codes[0].value; // Detected QR value
// //       setScannedValue(data);

// //       // If it's a valid URL, add to links list
// //       if (isValidUrl(data)) {
// //         const updatedLinks = [...scannedLinks, data];
// //         setScannedLinks(updatedLinks);
// //         try {
// //           await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //         } catch (error) {
// //           console.error("AsyncStorage error:", error);
// //         }
// //       }

// //       Alert.alert("QR Scanned", `Value: ${data}`);
// //     },
// //   });

// //   // Frame processor for text recognition (only if plugin is available)
// //   const frameProcessor = useFrameProcessor((frame) => {
// //     'worklet';
// //     try {
// //       const result = recognizeText(frame); // Use the plugin's function
// //       if (result && result.text) {
// //         runOnJS(setScannedValue)(result.text);
// //         runOnJS(Alert.alert)("Text Recognized", `Value: ${result.text}`);
// //       }
// //     } catch (error) {
// //       console.error("Text recognition error:", error); // Log but don't crash
// //     }
// //   }, []);

// //   // Reset to scan again
// //   const resetScan = () => {
// //     setScannedValue(null);
// //   };

// //   // Toggle scan mode
// //   const toggleMode = () => {
// //     setScanMode(scanMode === 'qr' ? 'text' : 'qr');
// //     setScannedValue(null); // Reset scanned value when switching modes
// //   };

// //   // Function to handle link click
// //   const handleLinkPress = (url) => {
// //     Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
// //   };

// //   // Function to delete a link from the list
// //   const deleteLink = async (index) => {
// //     const updatedLinks = scannedLinks.filter((_, i) => i !== index);
// //     setScannedLinks(updatedLinks);
// //     try {
// //       await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //     } catch (error) {
// //       console.error("Error saving after delete:", error);
// //     }
// //   };

// //   // Function to handle submit button (opens modal)
// //   const handleSubmit = () => {
// //     setModalVisible(true);
// //   };

// //   // Render item for FlatList
// //   const renderLinkItem = ({ item, index }) => (
// //     <View style={styles.linkItem}>
// //       <TouchableOpacity style={styles.linkTouchable} onPress={() => handleLinkPress(item)}>
// //         <Text style={styles.linkText}>{item}</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLink(index)}>
// //         <Text style={styles.deleteText}>Delete</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Render item for modal FlatList (without delete button)
// //   const renderModalLinkItem = ({ item }) => (
// //     <TouchableOpacity style={styles.modalLinkItem} onPress={() => handleLinkPress(item)}>
// //       <Text style={styles.modalLinkText}>{item}</Text>
// //     </TouchableOpacity>
// //   );

// //   // Waiting UI
// //   if (device == null) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Loading camera...</Text>
// //       </View>
// //     );
// //   }

// //   if (!hasPermission) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Camera permission not granted</Text>
// //       </View>
// //     );
// //   }

// //   // Scanner view
// //   return (
// //     <View style={styles.container}>
// //       {/* Mode toggle button */}
// //       <View style={styles.modeContainer}>
// //         <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
// //           <Text style={styles.modeText}>
// //             Switch to {scanMode === 'qr' ? 'Text Recognition' : 'QR Scan'}
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {!scannedValue ? (
// //         <Camera
// //           style={StyleSheet.absoluteFill}
// //           device={device}
// //           isActive={true}
// //           codeScanner={scanMode === 'qr' ? codeScanner : undefined} // Only use codeScanner for QR
// //           frameProcessor={scanMode === 'text' ? frameProcessor : undefined} // Use frameProcessor for text
// //         />
// //       ) : (
// //         <View style={styles.overlay}>
// //           <Text style={styles.text}>
// //             {scanMode === 'qr' ? 'Scanned QR' : 'Recognized Text'}: {scannedValue}
// //           </Text>
// //           <TouchableOpacity style={styles.button} onPress={resetScan}>
// //             <Text style={styles.buttonText}>Scan Again</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Link list box - only show in QR mode */}
// //       {scanMode === 'qr' && (
// //         <View style={styles.linkListContainer}>
// //           <View style={styles.listHeader}>
// //             <Text style={styles.listTitle}>Scanned Links:</Text>
// //             <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
// //               <Text style={styles.submitText}>Submit All</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <FlatList
// //             data={scannedLinks}
// //             keyExtractor={(item, index) => index.toString()}
// //             renderItem={renderLinkItem}
// //             style={styles.flatList}
// //           />
// //         </View>
// //       )}

// //       {/* Modal for displaying all links */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>All Scanned Links</Text>
// //             <FlatList
// //               data={scannedLinks}
// //               keyExtractor={(item, index) => index.toString()}
// //               renderItem={renderModalLinkItem}
// //               style={styles.modalFlatList}
// //             />
// //             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
// //               <Text style={styles.closeText}>Close</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // export default QRScanner;

// // // Styles (unchanged)
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   info: { fontSize: 16, color: "#666" },
// //   modeContainer: {
// //     position: 'absolute',
// //     top: 50,
// //     left: 20,
// //     right: 20,
// //     zIndex: 10,
// //   },
// //   modeButton: {
// //     backgroundColor: '#ffa500',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     alignSelf: 'center',
// //   },
// //   modeText: { color: '#fff', fontWeight: 'bold' },
// //   overlay: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.8)",
// //   },
// //   text: { color: "#fff", fontSize: 18, marginBottom: 20, textAlign: 'center' },
// //   button: {
// //     backgroundColor: "#1e90ff",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //   },
// //   buttonText: { color: "#fff", fontWeight: "bold" },
// //   linkListContainer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: 'rgba(255,255,255,0.9)',
// //     padding: 10,
// //     maxHeight: 200,
// //   },
// //   listHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   listTitle: { fontSize: 16, fontWeight: 'bold' },
// //   submitButton: {
// //     backgroundColor: '#28a745',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //   },
// //   submitText: { color: '#fff', fontWeight: 'bold' },
// //   flatList: { flex: 1 },
// //   linkItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   linkTouchable: { flex: 1 },
// //   linkText: { color: '#007bff', textDecorationLine: 'underline', flex: 1 },
// //   deleteButton: {
// //     backgroundColor: '#ff4444',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //     marginLeft: 10,
// //   },
// //   deleteText: { color: '#fff', fontWeight: 'bold' },
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 10,
// //     width: '80%',
// //     maxHeight: '70%',
// //   },
// //   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
// //   modalFlatList: { flex: 1 },
// //   modalLinkItem: {
// //     padding: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   modalLinkText: { color: '#007bff', textDecorationLine: 'underline' },
// //   closeButton: {
// //     backgroundColor: '#6c757d',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 5,
// //     marginTop: 10,
// //     alignSelf: 'center',
// //   },
// //   closeText: { color: '#fff', fontWeight: 'bold' },
// // });













// // import React, { useState, useEffect } from "react";
// // import { View, Text, StyleSheet, Alert, TouchableOpacity, Linking, FlatList, Modal, TextInput, ScrollView } from "react-native";
// // import { Camera, useCameraDevice, useCodeScanner, useFrameProcessor } from "react-native-vision-camera";
// // import { runOnJS } from "react-native-reanimated";
// // import { recognizeText } from "@react-native-vision-camera/text-recognition"; // Import the plugin
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// // const QRScanner = () => {
// //   const device = useCameraDevice('back');
// //   const [hasPermission, setHasPermission] = useState(false);
// //   const [scannedValue, setScannedValue] = useState(null);
// //   const [parsedData, setParsedData] = useState({}); // Object to hold parsed student data
// //   const [scannedLinks, setScannedLinks] = useState([]); // Array to hold list of scanned links
// //   const [studentRecords, setStudentRecords] = useState([]); // Array to hold submitted student records
// //   const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
// //   const [scanMode, setScanMode] = useState('qr'); // 'qr' or 'text' for mode switching

// //   // Function to check if a string is a valid URL
// //   const isValidUrl = (string) => {
// //     try {
// //       new URL(string);
// //       return true;
// //     } catch (_) {
// //       return false;
// //     }
// //   };

// //   // Function to parse QR data into key-value pairs (e.g., "name: anil roll number: 123" -> { name: 'anil', rollNumber: '123' })
// //   const parseStudentData = (data) => {
// //     const pairs = data.split(/\s+/); // Split by spaces
// //     const parsed = {};
// //     for (let i = 0; i < pairs.length; i += 2) {
// //       const key = pairs[i].replace(':', '').toLowerCase().replace(' ', ''); // Remove colon and spaces
// //       const value = pairs[i + 1] || '';
// //       if (key && value) {
// //         parsed[key] = value;
// //       }
// //     }
// //     return parsed;
// //   };

// //   // Load scanned links and student records from AsyncStorage on component mount
// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         const storedLinks = await AsyncStorage.getItem("scannedLinks");
// //         if (storedLinks) {
// //           setScannedLinks(JSON.parse(storedLinks));
// //         }
// //         const storedRecords = await AsyncStorage.getItem("studentRecords");
// //         if (storedRecords) {
// //           setStudentRecords(JSON.parse(storedRecords));
// //         }
// //       } catch (error) {
// //         console.error("Error loading data:", error);
// //       }
// //     };
// //     loadData();
// //   }, []);

// //   // Request camera permission
// //   useEffect(() => {
// //     const requestPermission = async () => {
// //       const status = await Camera.requestCameraPermission();
// //       setHasPermission(status === "granted");
// //     };
// //     requestPermission();
// //   }, []);

// //   // Code scanner hook for QR codes
// //   const codeScanner = useCodeScanner({
// //     codeTypes: ['qr'], // Only for QR
// //     onCodeScanned: async (codes) => {
// //       if (scannedValue || codes.length === 0) return; // Prevent multiple scans
// //       const data = codes[0].value; // Detected QR value
// //       setScannedValue(data);

// //       // Parse the data if it's student info
// //       const parsed = parseStudentData(data);
// //       if (Object.keys(parsed).length > 0) {
// //         setParsedData(parsed);
// //       } else if (isValidUrl(data)) {
// //         // If it's a URL, add to links list
// //         const updatedLinks = [...scannedLinks, data];
// //         setScannedLinks(updatedLinks);
// //         try {
// //           await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //         } catch (error) {
// //           console.error("AsyncStorage error:", error);
// //         }
// //       }

// //       Alert.alert("QR Scanned", `Value: ${data}`);
// //     },
// //   });

// //   // Frame processor for text recognition (only if plugin is available)
// //   const frameProcessor = useFrameProcessor((frame) => {
// //     'worklet';
// //     try {
// //       const result = recognizeText(frame); // Use the plugin's function
// //       if (result && result.text) {
// //         runOnJS(setScannedValue)(result.text);
// //         runOnJS(Alert.alert)("Text Recognized", `Value: ${result.text}`);
// //       }
// //     } catch (error) {
// //       console.error("Text recognition error:", error); // Log but don't crash
// //     }
// //   }, []);

// //   // Reset to scan again
// //   const resetScan = () => {
// //     setScannedValue(null);
// //     setParsedData({});
// //   };

// //   // Toggle scan mode
// //   const toggleMode = () => {
// //     setScanMode(scanMode === 'qr' ? 'text' : 'qr');
// //     setScannedValue(null);
// //     setParsedData({});
// //   };

// //   // Function to handle link click
// //   const handleLinkPress = (url) => {
// //     Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
// //   };

// //   // Function to delete a link from the list
// //   const deleteLink = async (index) => {
// //     const updatedLinks = scannedLinks.filter((_, i) => i !== index);
// //     setScannedLinks(updatedLinks);
// //     try {
// //       await AsyncStorage.setItem("scannedLinks", JSON.stringify(updatedLinks));
// //     } catch (error) {
// //       console.error("Error saving after delete:", error);
// //     }
// //   };

// //   // Function to submit student data
// //   const submitStudentData = async () => {
// //     if (Object.keys(parsedData).length === 0) {
// //       Alert.alert("Error", "No data to submit.");
// //       return;
// //     }
// //     const updatedRecords = [...studentRecords, parsedData];
// //     setStudentRecords(updatedRecords);
// //     try {
// //       await AsyncStorage.setItem("studentRecords", JSON.stringify(updatedRecords));
// //       Alert.alert("Success", "Student data submitted!");
// //       resetScan(); // Reset after submission
// //     } catch (error) {
// //       console.error("Error saving student data:", error);
// //       Alert.alert("Error", "Failed to save data.");
// //     }
// //   };

// //   // Function to handle submit button (opens modal for links)
// //   const handleSubmit = () => {
// //     setModalVisible(true);
// //   };

// //   // Render item for FlatList
// //   const renderLinkItem = ({ item, index }) => (
// //     <View style={styles.linkItem}>
// //       <TouchableOpacity style={styles.linkTouchable} onPress={() => handleLinkPress(item)}>
// //         <Text style={styles.linkText}>{item}</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity style={styles.deleteButton} onPress={() => deleteLink(index)}>
// //         <Text style={styles.deleteText}>Delete</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Render item for modal FlatList (without delete button)
// //   const renderModalLinkItem = ({ item }) => (
// //     <TouchableOpacity style={styles.modalLinkItem} onPress={() => handleLinkPress(item)}>
// //       <Text style={styles.modalLinkText}>{item}</Text>
// //     </TouchableOpacity>
// //   );

// //   // Waiting UI
// //   if (device == null) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Loading camera...</Text>
// //       </View>
// //     );
// //   }

// //   if (!hasPermission) {
// //     return (
// //       <View style={styles.center}>
// //         <Text style={styles.info}>Camera permission not granted</Text>
// //       </View>
// //     );
// //   }

// //   // Scanner view
// //   return (
// //     <View style={styles.container}>
// //       {/* Mode toggle button */}
// //       <View style={styles.modeContainer}>
// //         <TouchableOpacity style={styles.modeButton} onPress={toggleMode}>
// //           <Text style={styles.modeText}>
// //             Switch to {scanMode === 'qr' ? 'Text Recognition' : 'QR Scan'}
// //           </Text>
// //         </TouchableOpacity>
// //       </View>

// //       {!scannedValue ? (
// //         <Camera
// //           style={StyleSheet.absoluteFill}
// //           device={device}
// //           isActive={true}
// //           codeScanner={scanMode === 'qr' ? codeScanner : undefined} // Only use codeScanner for QR
// //           frameProcessor={scanMode === 'text' ? frameProcessor : undefined} // Use frameProcessor for text
// //         />
// //       ) : (
// //         <View style={styles.overlay}>
// //           {Object.keys(parsedData).length > 0 ? (
// //             <ScrollView style={styles.formContainer}>
// //               <Text style={styles.formTitle}>Student Details</Text>
// //               {Object.entries(parsedData).map(([key, value]) => (
// //                 <View key={key} style={styles.inputContainer}>
// //                   <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
// //                   <TextInput
// //                     style={styles.input}
// //                     value={value}
// //                     onChangeText={(text) => setParsedData({ ...parsedData, [key]: text })}
// //                     placeholder={`Enter ${key}`}
// //                   />
// //                 </View>
// //               ))}
// //               <TouchableOpacity style={styles.submitFormButton} onPress={submitStudentData}>
// //                 <Text style={styles.submitFormText}>Submit Data</Text>
// //               </TouchableOpacity>
// //             </ScrollView>
// //           ) : (
// //             <Text style={styles.text}>
// //               {scanMode === 'qr' ? 'Scanned QR' : 'Recognized Text'}: {scannedValue}
// //             </Text>
// //           )}
// //           <TouchableOpacity style={styles.button} onPress={resetScan}>
// //             <Text style={styles.buttonText}>Scan Again</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Link list box - only show in QR mode */}
// //       {scanMode === 'qr' && (
// //         <View style={styles.linkListContainer}>
// //           <View style={styles.listHeader}>
// //             <Text style={styles.listTitle}>Scanned Links:</Text>
// //             <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
// //               <Text style={styles.submitText}>Submit All</Text>
// //             </TouchableOpacity>
// //           </View>
// //           <FlatList
// //             data={scannedLinks}
// //             keyExtractor={(item, index) => index.toString()}
// //             renderItem={renderLinkItem}
// //             style={styles.flatList}
// //           />
// //         </View>
// //       )}

// //       {/* Modal for displaying all links */}
// //       <Modal
// //         animationType="slide"
// //         transparent={true}
// //         visible={modalVisible}
// //         onRequestClose={() => setModalVisible(false)}
// //       >
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalTitle}>All Scanned Links</Text>
// //             <FlatList
// //               data={scannedLinks}
// //               keyExtractor={(item, index) => index.toString()}
// //               renderItem={renderModalLinkItem}
// //               style={styles.modalFlatList}
// //             />
// //             <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
// //               <Text style={styles.closeText}>Close</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // export default QRScanner;

// // // Updated Styles
// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#000" },
// //   center: { flex: 1, justifyContent: "center", alignItems: "center" },
// //   info: { fontSize: 16, color: "#666" },
// //   modeContainer: {
// //     position: 'absolute',
// //     top: 50,
// //     left: 20,
// //     right: 20,
// //     zIndex: 10,
// //   },
// //   modeButton: {
// //     backgroundColor: '#ffa500',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     alignSelf: 'center',
// //   },
// //   modeText: { color: '#fff', fontWeight: 'bold' },
// //   overlay: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.8)",
// //     padding: 20,
// //   },
// //   text: { color: "#fff", fontSize: 18, marginBottom: 20, textAlign: 'center' },
// //   formContainer: { width: '100%', maxHeight: '80%' },
// //   formTitle: { color: "#fff", fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
// //   inputContainer: { marginBottom: 15 },
// //   label: { color: "#fff", fontSize: 16, marginBottom: 5 },
// //   input: {
// //     backgroundColor: "#fff",
// //     padding: 10,
// //     borderRadius: 5,
// //     fontSize: 16,
// //   },
// //   submitFormButton: {
// //     backgroundColor: "#28a745",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     marginTop: 20,
// //     alignSelf: 'center',
// //   },
// //   submitFormText: { color: "#fff", fontWeight: "bold" },
// //   button: {
// //     backgroundColor: "#1e90ff",
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 10,
// //     marginTop: 20,
// //   },
// //   buttonText: { color: "#fff", fontWeight: "bold" },
// //   linkListContainer: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: 'rgba(255,255,255,0.9)',
// //     padding: 10,
// //     maxHeight: 200,
// //   },
// //   listHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 10,
// //   },
// //   listTitle: { fontSize: 16, fontWeight: 'bold' },
// //   submitButton: {
// //     backgroundColor: '#28a745',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //   },
// //   submitText: { color: '#fff', fontWeight: 'bold' },
// //   flatList: { flex: 1 },
// //   linkItem: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   linkTouchable: { flex: 1 },
// //   linkText: { color: '#007bff', textDecorationLine: 'underline', flex: 1 },
// //   deleteButton: {
// //     backgroundColor: '#ff4444',
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     borderRadius: 5,
// //     marginLeft: 10,
// //   },
// //   deleteText: { color: '#fff', fontWeight: 'bold' },
// //   modalOverlay: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderRadius: 10,
// //     width: '80%',
// //     maxHeight: '70%',
// //   },
// //   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
// //   modalFlatList: { flex: 1 },
// //   modalLinkItem: {
// //     padding: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ccc',
// //   },
// //   modalLinkText: { color: '#007bff', textDecorationLine: 'underline' },
// //   closeButton: {
// //     backgroundColor: '#6c757d',
// //     paddingVertical: 10,
// //     paddingHorizontal: 20,
// //     borderRadius: 5,
// //     marginTop: 10,
// //     alignSelf: 'center',
// //   },
// //   closeText: { color: '#fff', fontWeight: 'bold' },
// // });








































// handwriting

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, TextInput } from "react-native";
// import { Camera, useCameraDevice, useFrameProcessor } from "react-native-vision-camera";
// import { runOnJS } from "react-native-reanimated";
// import { recognizeText } from "@react-native-vision-camera/text-recognition";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const HandwritingDetector = ({ navigation }) => {  // Assuming navigation prop from React Navigation
//   const device = useCameraDevice('back');
//   const [hasPermission, setHasPermission] = useState(false);
//   const [detectedNumbers, setDetectedNumbers] = useState([]);  // List of detected numbers
//   const [currentDetected, setCurrentDetected] = useState('');  // Current detected text
//   const [storedNumbers, setStoredNumbers] = useState([]);  // Stored numbers from AsyncStorage

//   // Load stored numbers on mount
//   useEffect(() => {
//     const loadStoredNumbers = async () => {
//       try {
//         const stored = await AsyncStorage.getItem("detectedNumbers");
//         if (stored) {
//           setStoredNumbers(JSON.parse(stored));
//         }
//       } catch (error) {
//         console.error("Error loading stored numbers:", error);
//       }
//     };
//     loadStoredNumbers();
//   }, []);

//   // Request camera permission
//   useEffect(() => {
//     const requestPermission = async () => {
//       const status = await Camera.requestCameraPermission();
//       setHasPermission(status === "granted");
//     };
//     requestPermission();
//   }, []);

//   // Frame processor for handwriting detection (focus on numbers)
//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet';
//     try {
//       const result = recognizeText(frame);
//       if (result && result.text) {
//         // Filter for digits only (e.g., "2", "123")
//         const numbersOnly = result.text.replace(/[^0-9]/g, '').trim();
//         if (numbersOnly && numbersOnly !== currentDetected) {
//           runOnJS(setCurrentDetected)(numbersOnly);
//           runOnJS(setDetectedNumbers)((prev) => [...prev, numbersOnly]);  // Add to list
//         }
//       }
//     } catch (error) {
//       console.error("Handwriting detection error:", error);
//     }
//   }, [currentDetected]);

//   // Store the current detected number
//   const storeNumber = async () => {
//     if (!currentDetected) {
//       Alert.alert("No number detected", "Please write a number in view of the camera.");
//       return;
//     }
//     const updatedStored = [...storedNumbers, currentDetected];
//     setStoredNumbers(updatedStored);
//     try {
//       await AsyncStorage.setItem("detectedNumbers", JSON.stringify(updatedStored));
//       Alert.alert("Stored!", `Number "${currentDetected}" saved.`);
//       setCurrentDetected('');  // Reset
//     } catch (error) {
//       console.error("Error storing number:", error);
//       Alert.alert("Error", "Failed to store.");
//     }
//   };

//   // Clear detected list
//   const clearDetected = () => {
//     setDetectedNumbers([]);
//     setCurrentDetected('');
//   };

//   // Delete a stored number
//   const deleteStoredNumber = async (index) => {
//     const updatedStored = storedNumbers.filter((_, i) => i !== index);
//     setStoredNumbers(updatedStored);
//     try {
//       await AsyncStorage.setItem("detectedNumbers", JSON.stringify(updatedStored));
//     } catch (error) {
//       console.error("Error deleting stored number:", error);
//     }
//   };

//   // Waiting UI
//   if (device == null) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>Loading camera...</Text>
//       </View>
//     );
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.info}>Camera permission not granted</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         frameProcessor={frameProcessor}  // Continuous detection
//       />
      
//       {/* Overlay for detected info */}
//       <View style={styles.overlay}>
//         <Text style={styles.title}>Handwriting Detector</Text>
//         <Text style={styles.detectedText}>
//           Detected Number: {currentDetected || 'None'}
//         </Text>
//         <TouchableOpacity style={styles.storeButton} onPress={storeNumber}>
//           <Text style={styles.buttonText}>Store Number</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.clearButton} onPress={clearDetected}>
//           <Text style={styles.buttonText}>Clear Detected</Text>
//         </TouchableOpacity>
        
//         {/* List of detected numbers */}
//         <Text style={styles.listTitle}>Recent Detected:</Text>
//         <FlatList
//           data={detectedNumbers}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item }) => <Text style={styles.listItem}>{item}</Text>}
//           style={styles.flatList}
//         />
        
//         {/* Stored numbers */}
//         <Text style={styles.listTitle}>Stored Numbers:</Text>
//         <FlatList
//           data={storedNumbers}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({ item, index }) => (
//             <View style={styles.storedItem}>
//               <Text style={styles.listItem}>{item}</Text>
//               <TouchableOpacity onPress={() => deleteStoredNumber(index)}>
//                 <Text style={styles.deleteText}>Delete</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//           style={styles.flatList}
//         />
        
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.buttonText}>Back to Scanner</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default HandwritingDetector;

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   info: { fontSize: 16, color: "#666" },
//   overlay: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     right: 20,
//     bottom: 50,
//     backgroundColor: "rgba(0,0,0,0.7)",
//     padding: 20,
//     borderRadius: 10,
//   },
//   title: { color: "#fff", fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
//   detectedText: { color: "#fff", fontSize: 18, marginBottom: 10 },
//   storeButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 5, marginBottom: 10 },
//   clearButton: { backgroundColor: "#ffc107", padding: 10, borderRadius: 5, marginBottom: 20 },
//   buttonText: { color: "#fff", textAlign: 'center', fontWeight: 'bold' },
//   listTitle: { color: "#fff", fontSize: 16, fontWeight: 'bold', marginTop: 10 },
//   flatList: { maxHeight: 100, marginBottom: 10 },
//   listItem: { color: "#fff", fontSize: 16, padding: 5 },
//   storedItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 },
//   deleteText: { color: "#ff4444", fontWeight: 'bold' },
//   backButton: { backgroundColor: "#1e90ff", padding: 10, borderRadius: 5, marginTop: 20 },
// });

















// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   Platform,
//   PermissionsAndroid,
// } from "react-native";
// import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   signInAnonymously,
//   signInWithCustomToken,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // --- Firebase Config ---
// const firebaseConfig =
//   typeof __firebase_config !== "undefined"
//     ? JSON.parse(__firebase_config)
//     : {};
// const initialAuthToken =
//   typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// // --- API Config ---
// const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
// const API_KEY = ""; // Add your Gemini API key here

// // --- Permissions Helper ---
// const requestPermissions = async () => {
//   if (Platform.OS === "android") {
//     const read = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//     );
//     const write = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//     );
//     const camera = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.CAMERA
//     );

//     return (
//       read === PermissionsAndroid.RESULTS.GRANTED &&
//       write === PermissionsAndroid.RESULTS.GRANTED &&
//       camera === PermissionsAndroid.RESULTS.GRANTED
//     );
//   }
//   return true;
// };

// // --- Helper: Convert URI to Base64 ---
// const fileToBase64 = async (uri) => {
//   const response = await fetch(uri);
//   const blob = await response.blob();
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result.split(",")[1]);
//     reader.onerror = (error) => reject(error);
//     reader.readAsDataURL(blob);
//   });
// };

// const QRScanner = () => {
//   const [isAuthReady, setIsAuthReady] = useState(false);
//   const [userId, setUserId] = useState(null);
//   const [db, setDb] = useState(null);
//   const [auth, setAuth] = useState(null);

//   const [imageUri, setImageUri] = useState(null);
//   const [base64Image, setBase64Image] = useState(null);
//   const [results, setResults] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // 1️⃣ Initialize Firebase
//   useEffect(() => {
//     try {
//       const app = initializeApp(firebaseConfig);
//       const firestoreDb = getFirestore(app);
//       const firebaseAuth = getAuth(app);

//       setDb(firestoreDb);
//       setAuth(firebaseAuth);

//       const authenticate = async () => {
//         if (initialAuthToken) {
//           await signInWithCustomToken(firebaseAuth, initialAuthToken);
//         } else {
//           await signInAnonymously(firebaseAuth);
//         }
//       };

//       const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
//         setUserId(user?.uid || Date.now().toString());
//         setIsAuthReady(true);
//       });

//       authenticate();
//       return () => unsubscribe();
//     } catch (e) {
//       console.error("Firebase init failed:", e);
//     }
//   }, []);

//   // 2️⃣ Pick Image (gallery)
//   const pickImage = useCallback(async () => {
//     setError(null);
//     setResults("");

//     const hasPermission = await requestPermissions();
//     if (!hasPermission) {
//       Alert.alert("Permission required", "Camera and storage access are needed!");
//       return;
//     }

//     launchImageLibrary({ mediaType: "photo", quality: 1 }, async (response) => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         console.error("ImagePicker Error:", response.errorMessage);
//         Alert.alert("Error", response.errorMessage || "Unknown error");
//         return;
//       }

//       const uri = response.assets?.[0]?.uri;
//       if (!uri) {
//         setError("No image selected");
//         return;
//       }

//       setImageUri(uri);
//       try {
//         const base64 = await fileToBase64(uri);
//         setBase64Image(base64);
//       } catch (e) {
//         console.error("Base64 conversion failed:", e);
//         setError("Failed to convert image to Base64");
//       }
//     });
//   }, []);

//   // 3️⃣ Process Image with Gemini API
//   const processImageWithGemini = useCallback(async () => {
//     if (!base64Image) {
//       setError("Please upload an image first.");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     setResults("");

//     const systemPrompt =
//       "You are an expert OCR system. Extract printed and handwritten numbers clearly.";
//     const userQuery =
//       "Extract and classify all numbers in the document image as Handwritten or Printed.";

//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

//     const payload = {
//       contents: [
//         {
//           role: "user",
//           parts: [
//             { text: userQuery },
//             {
//               inlineData: {
//                 mimeType: "image/jpeg",
//                 data: base64Image,
//               },
//             },
//           ],
//         },
//       ],
//       systemInstruction: {
//         parts: [{ text: systemPrompt }],
//       },
//     };

//     try {
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       const result = await response.json();
//       const candidate = result.candidates?.[0];

//       if (candidate?.content?.parts?.[0]?.text) {
//         setResults(candidate.content.parts[0].text);
//       } else {
//         setError("No valid response from Gemini API.");
//       }
//     } catch (e) {
//       console.error("Gemini API call failed:", e);
//       setError("Failed to communicate with AI model.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [base64Image]);

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.title}>📄 Paper OCR App (CLI)</Text>
//         <Text style={styles.subtitle}>
//           Upload a document image to extract printed and handwritten numbers.
//         </Text>

//         {/* Upload Button */}
//         <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
//           <Text style={styles.uploadButtonText}>
//             {imageUri ? "Change Image" : "Select Image"}
//           </Text>
//         </TouchableOpacity>

//         {/* Preview */}
//         {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

//         {/* Process Button */}
//         <TouchableOpacity
//           style={[
//             styles.processButton,
//             (!base64Image || isLoading) && styles.disabledButton,
//           ]}
//           disabled={!base64Image || isLoading}
//           onPress={processImageWithGemini}
//         >
//           {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.processButtonText}>Run OCR & Detect Numbers</Text>}
//         </TouchableOpacity>

//         {/* Error */}
//         {error && <Text style={styles.errorText}>{error}</Text>}

//         {/* Results */}
//         {results ? (
//           <View style={styles.resultsContainer}>
//             <Text style={styles.resultsTitle}>Extraction Results</Text>
//             <Text style={styles.resultsText}>{results}</Text>
//           </View>
//         ) : null}
//       </View>
//     </ScrollView>
//   );
// };

// export default QRScanner;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#f9fafb",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//   },
//   card: {
//     width: "100%",
//     maxWidth: 380,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#1d4ed8",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginBottom: 20,
//   },
//   uploadButton: {
//     backgroundColor: "#2563eb",
//     borderRadius: 10,
//     paddingVertical: 12,
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   uploadButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   previewImage: {
//     width: "100%",
//     height: 220,
//     borderRadius: 12,
//     resizeMode: "contain",
//     marginBottom: 20,
//     backgroundColor: "#f3f4f6",
//   },
//   processButton: {
//     backgroundColor: "#16a34a",
//     borderRadius: 10,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   disabledButton: {
//     backgroundColor: "#9ca3af",
//   },
//   processButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
//   errorText: {
//     marginTop: 16,
//     color: "#dc2626",
//     fontSize: 14,
//     textAlign: "center",
//   },
//   resultsContainer: {
//     marginTop: 20,
//     backgroundColor: "#f3f4f6",
//     borderRadius: 10,
//     padding: 12,
//   },
//   resultsTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1d4ed8",
//     marginBottom: 8,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: "#374151",
//     lineHeight: 20,
//   },
// });
