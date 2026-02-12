

import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { PermissionsAndroid } from 'react-native';

const AdminExamination = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    // Request permission for external storage access on Android (if required)
    const requestPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Permission Required',
                    message: 'This app needs access to your storage to read files.',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // console.log('Storage permission granted');
            } else {
                // console.log('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    // Function to open the folder and get files
    const openFolder = async () => {
        setLoading(true);
        try {
            // Request permission if accessing external storage on Android
            if (Platform.OS === 'android') {
                await requestPermissions();
            }

            // Define the base path where the file was saved
            let basePath;
            if (Platform.OS === 'android') {
                basePath = RNFS.DownloadDirectoryPath;
            } else {
                basePath = RNFS.DocumentDirectoryPath || RNFS.ExternalDirectoryPath;
            }

            const folderName = 'MGUVV';  
            const folderPath = `${basePath}/${folderName}`;
            // console.log('Opening folder:', folderPath);

            // Read all files in the specified folder
            const fileList = await RNFS.readDir(folderPath);
            // console.log('Files in the folder:', fileList);

            setFiles(fileList); // Store the file data in the state (or handle it as needed)

        } catch (error) {
            console.error("Error opening folder:", error);
        } finally {
            setLoading(false);
        }
    };


    // Function to share a file
    const shareFile = async (filePath) => {
        try {
            // Check if the file exists
            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
                console.error("File does not exist:", filePath);
                return;
            }
            const isPDF = filePath.toLowerCase().endsWith('.pdf');
            const mimeType = isPDF ? 'application/pdf' : 'application/octet-stream';
            const fileUrl = `file://${filePath}`;
            const shareOptions = {
                title: 'Share File',
                url: fileUrl,
                type: mimeType,
            };
            await Share.open(shareOptions)
                .then((res) => console.log('Shared successfully!', res))
                .catch((err) => console.error('Error sharing: ', err));
        } catch (error) {
            console.error("Error sharing file:", error);
        }
    };
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Button title="Open Folder" onPress={openFolder} />
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={files}
                    keyExtractor={(item) => item.path}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => shareFile(item.path)}>
                            <View style={{ marginBottom: 10 }}>
                                <Text>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

export default AdminExamination;














// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';

// const AdminExamination = () => {
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     const courses = [
//         { label: 'Java', value: 'java' },
//         { label: 'Python', value: 'python' },
//         { label: 'JavaScript', value: 'javascript' },
//         { label: 'C++', value: 'cpp' },
//         { label: 'Go', value: 'go' },
//         { label: 'Rust', value: 'rust' },
//     ];

//     const handleChange = (item) => {
//         console.log('Selected:', item.label, item.value);
//         Alert.alert('Course Selected', `You selected: ${item.label}`);
//         setSelectedCourse(item.label);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Courses Page</Text>

//             <Dropdown
//                 style={styles.dropdown}
//                 placeholderStyle={styles.placeholderStyle}
//                 selectedTextStyle={styles.selectedTextStyle}
//                 data={courses}
//                 labelField="label"
//                 valueField="value"
//                 placeholder="Select a course"
//                 value={selectedCourse}
//                 onChange={handleChange}
//             />

//             {selectedCourse && (
//                 <Text style={styles.selectedText}>Selected: {selectedCourse}</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 22,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#333',
//     },
//     dropdown: {
//         height: 50,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingHorizontal: 12,
//     },
//     placeholderStyle: {
//         fontSize: 16,
//         color: '#999',
//     },
//     selectedTextStyle: {
//         fontSize: 16,
//         color: '#333',
//     },
//     selectedText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: '#007BFF',
//         textAlign: 'center',
//     },
// });

// export default AdminExamination;










// Popup dropdwon
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import ModalSelector from 'react-native-modal-selector';

// const AdminExamination = () => {
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     const courses = [
//         { key: 1, label: 'Java' },
//         { key: 2, label: 'Python' },
//         { key: 3, label: 'JavaScript' },
//         { key: 4, label: 'C++' },
//         { key: 5, label: 'Go' },
//         { key: 6, label: 'Rust' },
//     ];

//     const handleChange = (option) => {
//         setSelectedCourse(option.label);
//         Alert.alert('Course Selected', `You selected: ${option.label}`);
//         console.log('Selected:', option.label);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Courses Page</Text>

//             <ModalSelector
//                 data={courses}
//                 initValue="Select a course"
//                 onChange={handleChange}
//                 style={styles.selector}
//                 initValueTextStyle={styles.initValueText}
//                 selectTextStyle={styles.selectedTextStyle}
//             />

//             {selectedCourse && (
//                 <Text style={styles.selectedText}>Selected: {selectedCourse}</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 22,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#333',
//     },
//     selector: {
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//         padding: 10,
//     },
//     initValueText: {
//         color: '#999',
//         fontSize: 16,
//     },
//     selectedTextStyle: {
//         color: '#333',
//         fontSize: 16,
//     },
//     selectedText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: '#007BFF',
//         textAlign: 'center',
//     },
// });

// export default AdminExamination;


// customize popup
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import ModalSelector from 'react-native-modal-selector';

// const AdminExamination = () => {
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     const courses = [
//         { key: 1, label: 'Java' },
//         { key: 2, label: 'Python' },
//         { key: 3, label: 'JavaScript' },
//         { key: 4, label: 'C++' },
//         { key: 5, label: 'Go' },
//         { key: 6, label: 'Rust' },
//     ];

//     const handleChange = (option) => {
//         setSelectedCourse(option.label);
//         Alert.alert('Course Selected', `You selected: ${option.label}`);
//         console.log('Selected:', option.label);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Courses Page</Text>

//             <ModalSelector
//                 data={courses}
//                 initValue="Select a course"
//                 onChange={handleChange}
//                 style={styles.selector}
//                 initValueTextStyle={styles.initValueText}
//                 selectTextStyle={styles.selectedTextStyle}

//                 // Popup customization props:
//                 optionTextStyle={styles.optionTextStyle}
//                 optionContainerStyle={styles.optionContainerStyle}
//                 optionStyle={styles.optionStyle}
//                 cancelText="Cancel"
//                 cancelTextStyle={styles.cancelTextStyle}
//                 overlayStyle={styles.overlayStyle}
//             />

//             {selectedCourse && (
//                 <Text style={styles.selectedText}>Selected: {selectedCourse}</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 22,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#333',
//     },
//     selector: {
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//         padding: 10,
//     },
//     initValueText: {
//         color: '#999',
//         fontSize: 16,
//     },
//     selectedTextStyle: {
//         color: '#333',
//         fontSize: 16,
//     },
//     selectedText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: '#007BFF',
//         textAlign: 'center',
//     },
//     // Popup styles
//     optionTextStyle: {
//         color: '#2a9d8f',
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     optionContainerStyle: {
//         backgroundColor: '#f0f4f8',
//         borderRadius: 8,
//         marginVertical: 6,
//         marginHorizontal: 12,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//     },
//     optionStyle: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     cancelTextStyle: {
//         color: '#e76f51',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     overlayStyle: {
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
// });

// export default AdminExamination;




// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import ModalSelector from 'react-native-modal-selector';

// const AdminExamination = () => {
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     const courses = [
//         { key: 1, label: 'Java' },
//         { key: 2, label: 'Python' },
//         { key: 3, label: 'JavaScript' },
//         { key: 4, label: 'C++' },
//         { key: 5, label: 'Go' },
//         { key: 6, label: 'Rust' },
//         { key: 7, label: 'Swift' },
//         { key: 8, label: 'Kotlin' },
//         { key: 9, label: 'Dart' },
//     ];

//     const handleChange = (option) => {
//         setSelectedCourse(option.label);
//         Alert.alert('Course Selected', `You selected: ${option.label}`);
//         console.log('Selected:', option.label);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Courses Page</Text>
//             <View style={{ flexDirection: 'row', }}>
//                 <ModalSelector
//                     data={courses}
//                     initValue="Select a course"
//                     onChange={handleChange}
//                     style={styles.selector}
//                     initValueTextStyle={styles.initValueText}
//                     selectTextStyle={styles.selectedTextStyle}

//                     // popup open from bottom
//                     animationType="slide"

//                     // customize popup style
//                     optionTextStyle={styles.optionTextStyle}
//                     optionContainerStyle={styles.optionContainerStyle}
//                     optionStyle={styles.optionStyle}
//                     cancelText="Cancel"
//                     cancelTextStyle={styles.cancelTextStyle}
//                     overlayStyle={styles.overlayStyle}

//                     // max height of popup list (makes it scrollable)
//                     optionListContainerStyle={styles.optionListContainerStyle}
//                 />
//                 <ModalSelector
//                     data={courses}
//                     initValue="Select a course"
//                     onChange={handleChange}
//                     style={styles.selector}
//                     initValueTextStyle={styles.initValueText}
//                     selectTextStyle={styles.selectedTextStyle}

//                     // popup open from bottom
//                     animationType="slide"

//                     // customize popup style
//                     optionTextStyle={styles.optionTextStyle}
//                     optionContainerStyle={styles.optionContainerStyle}
//                     optionStyle={styles.optionStyle}
//                     cancelText="Cancel"
//                     cancelTextStyle={styles.cancelTextStyle}
//                     overlayStyle={styles.overlayStyle}

//                     // max height of popup list (makes it scrollable)
//                     optionListContainerStyle={styles.optionListContainerStyle}
//                 />
//             </View>
//             {selectedCourse && (
//                 <Text style={styles.selectedText}>Selected: {selectedCourse}</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 22,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#333',
//     },
//     selector: {
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 8,
//         padding: 10,
//     },
//     initValueText: {
//         color: '#999',
//         fontSize: 16,
//     },
//     selectedTextStyle: {
//         color: '#333',
//         fontSize: 16,
//     },
//     selectedText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: '#007BFF',
//         textAlign: 'center',
//     },

//     optionTextStyle: {
//         color: '#2a9d8f',
//         fontSize: 18,
//         fontWeight: '600',
//         // remove height here
//     },
//     optionListContainerStyle: {
//         backgroundColor: '#f0f4f8',
//         borderTopLeftRadius: 12,
//         borderTopRightRadius: 12,
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         marginHorizontal: 12,
//         borderRadius: 20,
//         maxHeight: 400,
//     },
//     optionStyle: {
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     cancelTextStyle: {
//         color: '#e76f51',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     overlayStyle: {
//         backgroundColor: 'rgba(221, 221, 221, 0.74)',
//     },
//     optionListContainerStyle: {
//         maxHeight: 250,
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 12,
//         marginHorizontal: 12,
//         backgroundColor: '#fff',
//     },
// });

// export default AdminExamination;





// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import DropdownSelector from '../components/DropdownSelector';  

// const AdminExamination = () => {
//     const [selectedCourse, setSelectedCourse] = useState(null);

//     const courses = [
//         { key: 1, label: 'Java' },
//         { key: 2, label: 'Python' },
//         { key: 3, label: 'JavaScript' },
//         { key: 4, label: 'C++' },
//         { key: 5, label: 'Go' },
//         { key: 6, label: 'Rust' },
//         { key: 7, label: 'Swift' },
//         { key: 8, label: 'Kotlin' },
//         { key: 9, label: 'Dart' },
//     ];
//     const courses2 = [
//         { key: 1, label: 'anil' },
//         { key: 2, label: 'Python' },
//         { key: 3, label: 'JavaScript' },
//         { key: 4, label: 'C++' },
//         { key: 5, label: 'Go' },
//         { key: 6, label: 'Rust' },
//         { key: 7, label: 'Swift' },
//         { key: 8, label: 'Kotlin' },
//         { key: 9, label: 'Dart' },
//     ];

//     const handleChange = (option) => {
//         setSelectedCourse(option.label);
//         Alert.alert('Course Selected', `You selected: ${option.label}`);
//         console.log('Selected:', option.label);
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>My Courses Page</Text>
//             <View style={{ flexDirection: 'row',  justifyContent: 'space-between' }}>
//                 <DropdownSelector
//                     data={courses}
//                     initValue="Select a course"
//                     onChange={handleChange}
//                 />
//                 <DropdownSelector
//                     data={courses2}
//                     initValue="Select another course"
//                     onChange={handleChange}
//                 />
//             </View>
//             {selectedCourse && (
//                 <Text style={styles.selectedText}>Selected: {selectedCourse}</Text>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         padding: 16,
//         backgroundColor: '#fff',
//     },
//     title: {
//         fontSize: 22,
//         marginBottom: 20,
//         textAlign: 'center',
//         color: '#333',
//     },
//     selectedText: {
//         marginTop: 20,
//         fontSize: 18,
//         color: '#007BFF',
//         textAlign: 'center',
//     },
// });

// export default AdminExamination;




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Pressable,
//   Alert
// } from 'react-native';

// const presetAmounts = [5, 10, 15, 20, 50, 100, 200, 500];

// export default function AdminExamination() {
//   const [amount, setAmount] = useState(50);  

//   const increment = () => setAmount(prev => prev + 1);
//   const decrement = () => setAmount(prev => (prev > 1 ? prev - 1 : 1));

//   const handlePreset = (value) => setAmount(value);

//   const handleTopup = () => {
//     Alert.alert("Topup", `Topped up $${amount} successfully!`);
//   };

//   return (
//     <View style={styles.container}>
//       {/* Card Info */}
//       <View style={styles.cardInfo}>
//         <Text style={styles.cardText}>💳 Debit</Text>
//         <Text style={styles.balanceText}>$1857.5</Text>
//       </View>

//       {/* Amount Section */}
//       <Text style={styles.label}>Amount</Text>

//       <View style={styles.amountInputRow}>
//         <TouchableOpacity onPress={decrement} style={styles.adjustButton}>
//           <Text style={styles.adjustText}>-</Text>
//         </TouchableOpacity>

//         <TextInput
//           style={styles.amountInput}
//           keyboardType="numeric"
//           value={amount.toString()}
//           onChangeText={text => {
//             const num = parseInt(text);
//             if (!isNaN(num)) setAmount(num);
//           }}
//         />

//         <TouchableOpacity onPress={increment} style={styles.adjustButton}>
//           <Text style={styles.adjustText}>+</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Preset Buttons */}
//       <View style={styles.presetContainer}>
//         {presetAmounts.map((val) => (
//           <TouchableOpacity
//             key={val}
//             style={[
//               styles.presetButton,
//               amount === val && styles.selectedPreset
//             ]}
//             onPress={() => handlePreset(val)}
//           >
//             <Text style={[
//               styles.presetText,
//               amount === val && styles.selectedText
//             ]}>${val}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Buttons */}
//       <View style={styles.footer}>
//         <TouchableOpacity style={styles.cancelButton}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>

//         <Pressable style={styles.topupButton} onPress={handleTopup}>
//           <Text style={styles.topupText}>Press & Hold to Topup</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#F5F7FF',
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   cardInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 30,
//     elevation: 4
//   },
//   cardText: {
//     fontSize: 16,
//     fontWeight: 'bold'
//   },
//   balanceText: {
//     fontSize: 16,
//     color: '#333'
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 10
//   },
//   amountInputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 25
//   },
//   amountInput: {
//     borderBottomWidth: 2,
//     borderColor: '#444',
//     width: 100,
//     fontSize: 28,
//     textAlign: 'center',
//     marginHorizontal: 20
//   },
//   adjustButton: {
//     backgroundColor: '#E0E0E0',
//     padding: 10,
//     borderRadius: 50
//   },
//   adjustText: {
//     fontSize: 20,
//     fontWeight: 'bold'
//   },
//   presetContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between'
//   },
//   presetButton: {
//     width: '22%',
//     padding: 10,
//     marginVertical: 6,
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     elevation: 2
//   },
//   selectedPreset: {
//     backgroundColor: '#4563FF'
//   },
//   presetText: {
//     fontSize: 16,
//     color: '#333'
//   },
//   selectedText: {
//     color: '#fff',
//     fontWeight: 'bold'
//   },
//   footer: {
//     marginTop: 40,
//     flexDirection: 'row',
//     justifyContent: 'space-between'
//   },
//   cancelButton: {
//     padding: 15,
//     backgroundColor: '#ddd',
//     borderRadius: 10,
//     width: '45%',
//     alignItems: 'center'
//   },
//   cancelText: {
//     fontSize: 16,
//     fontWeight: '600'
//   },
//   topupButton: {
//     padding: 15,
//     backgroundColor: '#4563FF',
//     borderRadius: 10,
//     width: '45%',
//     alignItems: 'center'
//   },
//   topupText: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600'
//   }
// });












// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
// import FileViewer from 'react-native-file-viewer';
// import Header from "../../layout/Header2";
// import getApiList from '../../Api/ApiList';
// import SessionService from "../../Services/SessionService";
// import Apiservice from "../../Services/ApiService";
// import { API_BASE_URL } from '../../config/BaseUrl'
// import alertService from '../../Services/alert/AlertService';
// import requestAndroidPermission from "../../Services/requestStoragePermission";

// const AdminExamination = () => {
//   const [transcriptUrl, setTranscriptUrl] = useState(null);
//   const [studentdetail, setStudentdetail] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const folderName = 'MGUVV';
//   const fileName = 'transcript.pdf';

//   const getLocalFilePath = () => {
//     let basePath =
//       Platform.OS === 'android'
//         ? RNFS.DownloadDirectoryPath
//         : RNFS.DocumentDirectoryPath || RNFS.ExternalDirectoryPath;
//     return `${basePath}/${folderName}/${fileName}`;
//   };

//   // 📥 Download & Share PDF
//   const handleDownload = async () => {
//     if (!transcriptUrl) {
//       Alert.alert('Not available', 'Transcript file not available yet.');
//       return;
//     }

//     try {
//       // Ask for permission on Android
//       if (Platform.OS === 'android') {
//         const hasPermission = await requestAndroidPermission();
//         if (!hasPermission) {
//           Alert.alert('Permission denied', 'Storage permission is required to save the file.');
//           return;
//         }
//       }

//       const localFile = getLocalFilePath();
//       const folderPath = localFile.replace(`/${fileName}`, '');

//       const folderExists = await RNFS.exists(folderPath);
//       if (!folderExists) {
//         await RNFS.mkdir(folderPath);
//       }

//       const downloadResult = await RNFS.downloadFile({
//         fromUrl: transcriptUrl,
//         toFile: localFile,
//       }).promise;

//       if (downloadResult.statusCode === 200) {
//         Alert.alert('Download successful', 'Check Download Folder > MGUVV');

//         // 🟢 Option to share PDF directly
//         const shareOptions = {
//           title: 'Share Transcript PDF',
//           message: 'Check out my Transcript PDF!',
//           url: `file://${localFile}`,
//           type: 'application/pdf',
//         };
//         Share.open(shareOptions).catch((err) => console.log('Error sharing: ', err));
//       } else {
//         Alert.alert('Error', 'Failed to download the transcript.');
//       }
//     } catch (error) {
//       console.error('Download failed:', error);
//       Alert.alert('Error', 'Something went wrong while downloading.');
//     }
//   };

//   // 📂 Open downloaded file safely
//   const handleOpenFolder = async () => {
//     const localFile = getLocalFilePath();
//     const fileExists = await RNFS.exists(localFile);

//     if (!fileExists) {
//       Alert.alert('File not found', 'Transcript file not found. Please download it first.');
//       return;
//     }

//     try {
//       // Use file:// prefix and open-with dialog
//       await FileViewer.open(`file://${localFile}`, {
//         showOpenWithDialog: true,
//         displayName: 'Transcript.pdf',
//         type: 'application/pdf',
//       });
//     } catch (error) {
//       console.log('Error opening file:', error);
//       Alert.alert(
//         'No PDF Viewer Found',
//         'No compatible app is available to open PDF files. Please install a PDF viewer such as Adobe Acrobat or Google PDF Viewer.'
//       );
//     }
//   };

// //   👍


//   // 🧾 Fetch session & transcript link
//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const sessionData = await SessionService.getSession();

//         const payload = {
//           LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//           STUDENT_ID: sessionData?.STUDENT_ID,
//           U_ID: sessionData?.STUDENT_ID,
//         };
//         setStudentdetail(sessionData);

//         const apiList = getApiList();
//         const TranscriptApi = apiList.getTranscriptPath;

//         const response = await Apiservice.request({
//           endpoint: TranscriptApi,
//           payload,
//           method: 'GET',
//         });

//         const filePath = response?.TranscriptPathRes?.File_Path;
//         const path = `${API_BASE_URL}/${filePath}`;
//         setTranscriptUrl(path);
//       } catch (error) {
//         console.error('Failed to load transcript:', error);
//         Alert.alert('Error', 'Could not fetch transcript data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSession();
//   }, []);

//   return (
//     <ScrollView>
//       <Header />
//       <View style={styles.container}>
//         {/* 🧾 Transcript Card */}
//         <View style={styles.card}>
//           <Text style={styles.title}>Transcript</Text>
//           <View style={styles.infoRow}>
//             <Text style={styles.label}>Student ID:</Text>
//             <Text style={styles.value}>{studentdetail?.STUDENT_ID}</Text>
//           </View>
//           <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
//             <FontAwesome6 name="file-pdf" size={20} color="#fff" />
//             <Text style={styles.downloadText}>Download & Share PDF</Text>
//           </TouchableOpacity>
//         </View>

//         {/* 📂 Open Folder Card */}
//         <View style={[styles.card, { marginTop: 15 }]}>
//           <Text style={styles.title}>Open Folder</Text>
//           <Text style={{ marginBottom: 10 }}>Check if your downloaded file exists.</Text>
//           <TouchableOpacity
//             style={[styles.downloadButton, { backgroundColor: '#28a745' }]}
//             onPress={handleOpenFolder}
//           >
//             <FontAwesome6 name="folder-open" size={20} color="#fff" />
//             <Text style={styles.downloadText}>Open Transcript Folder</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f6fa',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 10,
//     padding: 20,
//     width: '100%',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 3,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#2f3640',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 16,
//     color: '#636e72',
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1300baff',
//   },
//   downloadButton: {
//     flexDirection: 'row',
//     backgroundColor: '#e84118',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   downloadText: {
//     color: '#fff',
//     fontSize: 16,
//     marginLeft: 8,
//     fontWeight: 'bold',
//   },
// });


// export default AdminExamination;








