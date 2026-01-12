
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, 
  Alert, FlatList, ActivityIndicator, Dimensions 
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';

// Services & Components
import { HttpService } from "../../../common/Services/HttpService";
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import SessionService from '../../../common/Services/SessionService';
import { API_BASE_URL } from '../../../common/config/BaseUrl';
import { downloadFile } from "../../../common/Services/pdfService";
import colors from '../../../common/config/colors';

const { width } = Dimensions.get('window');

const Transcript = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        STUDENT_ID: sessionData?.STUDENT_ID,
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        U_ID: sessionData?.STUDENT_ID,
      };
      
      const apiList = getApiList();
      const response = await HttpService.post(apiList?.getTranscriptPath, payload);
      const filePath = response?.data?.TranscriptPathRes?.File_Path;

      if (!filePath) throw new Error('Official transcript not yet available.');

      const baseUrl = API_BASE_URL.replace(/\/$/, '');
      const fullUrl = `${baseUrl}/${filePath.replace(/^\//, '')}`;
      
      const downloadResult = await downloadFile(fullUrl, 'Official_Transcript.pdf');
      
      const newFile = {
        name: 'Official_Transcript.pdf',
        path: downloadResult?.localPath || fullUrl,
        date: new Date().toLocaleDateString()
      };
      setFiles([newFile]);
      
      Alert.alert('Success', 'Your official transcript has been saved to your device.');
    } catch (error) {
      Alert.alert('Download Error', error?.message || 'Unable to fetch transcript.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Transcript</Text>
          <Text style={styles.subTitle}>Securely download your academic record</Text>
        </View>

        {/* --- MODERN TRANSCRIPT CARD --- */}
        <View style={styles.documentCard}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="file-contract" size={40} color={colors.footercolor} />
          </View>
          
          <Text style={styles.docName}>Consolidated Grade Sheet</Text>
          <Text style={styles.docInfo}>Verified by University Registrar</Text>

          <View style={styles.divider} />

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.footercolor} />
              <Text style={styles.loadingText}>Verifying Credentials...</Text>
            </View>
          ) : (
            <TouchableOpacity 
              activeOpacity={0.8}
              style={styles.mainDownloadBtn} 
              onPress={handleDownloadPDF}
            >
              <FontAwesome6 name="cloud-arrow-down" size={18} color="#FFF" />
              <Text style={styles.btnText}>DOWNLOAD TRANSCRIPT</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- DOWNLOAD HISTORY / FILE LIST --- */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent Downloads</Text>
          <FlatList
            data={files}
            keyExtractor={(item) => item.path}
            renderItem={({ item }) => (
              <View style={styles.fileRow}>
                <View style={styles.fileIconCircle}>
                  <FontAwesome6 name="file-pdf" size={16} color="#E63946" />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>{item.name}</Text>
                  <Text style={styles.fileDate}>Downloaded on {item.date}</Text>
                </View>
                <TouchableOpacity style={styles.shareBtn}>
                  <FontAwesome6 name="share-nodes" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              !loading && <Text style={styles.emptyText}>No recent downloads found.</Text>
            }
          />
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  
  titleSection: { marginBottom: 25 },
  mainTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A1A' },
  subTitle: { fontSize: 13, color: '#666', marginTop: 4 },

  documentCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  docName: { fontSize: 18, fontWeight: '700', color: '#333' },
  docInfo: { fontSize: 12, color: '#999', marginTop: 4 },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  mainDownloadBtn: {
    backgroundColor: colors.footercolor,
    flexDirection: 'row',
    width: '100%',
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  btnText: { color: '#FFF', fontWeight: '800', letterSpacing: 1 },
  
  loadingBox: { alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#666', fontWeight: '600' },

  historySection: { marginTop: 30, flex: 1 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 15 },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  fileIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: { flex: 1, marginLeft: 12 },
  fileName: { fontSize: 14, fontWeight: '600', color: '#333' },
  fileDate: { fontSize: 11, color: '#999', marginTop: 2 },
  shareBtn: { padding: 10 },
  emptyText: { textAlign: 'center', color: '#BBB', marginTop: 20, fontSize: 13 },
});

export default Transcript;













// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, FlatList, Share } from 'react-native';
// import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
// import alertService from '../../../common/Services/alert/AlertService';
// import { HttpService } from "../../../common/Services/HttpService";
// import getApiList from "../../config/Api/ApiList";
// import Header from "../../layout/Header/Header2";
// import Footer from "../../layout/Footer/Footer";
// import SessionService from '../../../common/Services/SessionService';
// import Loading from '../../../common/Services/Loading'; // Assuming this is a spinner component
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { API_BASE_URL } from '../../../common/config/BaseUrl';
// import { downloadFile } from "../../../common/Services/pdfService";
// import colors from '../../../common/config/colors';

// const Transcript = () => {
//   const [transcriptUrl, setTranscriptUrl] = useState(null);
//   const [studentdetail, setStudentdetail] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [files, setFiles] = useState([]);

//   const handleDownloadPDF = async (id) => {
//     setLoading(true);
//     try {
//       const sessionData = await SessionService.getSession();
//       const payload = {
//         STUDENT_ID: sessionData?.STUDENT_ID,
//         LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//         U_ID: sessionData?.STUDENT_ID,
//       };
//       const apiList = getApiList();
//       const response = await HttpService.post(apiList?.getTranscriptPath, payload);
//       const filePath = response?.data?.TranscriptPathRes?.File_Path;
//       if (!filePath) {
//         throw new Error('No file path returned from API.');
//       }
//       const baseUrl = API_BASE_URL.replace(/\/$/, '');
//       const fullUrl = `${baseUrl}/${filePath.replace(/^\//, '')}`;
//       const downloadResult = await downloadFile(fullUrl, 'transcript.pdf');
//       const newFile = {
//         name: 'transcript.pdf',
//         path: downloadResult?.localPath || fullUrl
//       };
//       setFiles([newFile]);
//     } catch (error) {
//       console.error('Download error:', error);
//       Alert.alert(
//         'Transcript Download Failed',
//         error?.message || 'Something went wrong. Please try again.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF1DC' }}>
//       <Header />
//       <Text style={styles.header}>Transcript Download</Text>
//       <View style={styles.container}>
//         <View style={styles.card}>

//           <View style={styles.infoRow}>
//             <TouchableOpacity
//               onPress={handleDownloadPDF}
//               disabled={loading} // Disable button during loading
//               style={[styles.downloadButton, loading && styles.disabledButton]}
//               accessibilityLabel="Download Transcript PDF"
//               accessibilityHint="Tap to download your transcript as a PDF"
//             >
//               <FontAwesome6 name="download" size={30} color={loading ? "#ccc" : "#c70000ff"} />
//               {loading && <Text style={styles.buttonText}>Downloading...</Text>}
//             </TouchableOpacity>
//             <Text style={styles.title}>Click to Download</Text>
//           </View>

//           {loading ? (
//             <View style={styles.loaderContainer}>
//               <Loading /> {/* Use the imported Loading component */}
//               <Text style={styles.loadingText}>Please wait while we prepare your download...</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={files}
//               keyExtractor={(item) => item.path}
//               // renderItem={({ item }) => (
//               //   <TouchableOpacity
//               //     onPress={() => shareFile(item.path)}
//               //     style={styles.fileRow}
//               //     accessibilityLabel={`Share ${item.name}`}
//               //     accessibilityHint="Tap to share this PDF file"
//               //   >
//               //     <FontAwesome6 name="file-pdf" size={18} color="#c70000ff" style={styles.fileIcon} />
//               //     <Text style={styles.fileText}>{item.name}</Text>
//               //     <FontAwesome6 name="share" size={16} color="#636e72" />
//               //   </TouchableOpacity>
//               // )}
//               contentContainerStyle={files.length === 0 ? styles.emptyList : { paddingBottom: 20 }}
//             // ListEmptyComponent={<Text style={styles.emptyText}>No files downloaded yet.</Text>}
//             />
//           )}
//         </View>
//       </View>
//       <Footer />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // paddingHorizontal: 20,
//   },
//   header: {
//     backgroundColor: colors.footercolor,
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: colors.background,
//     borderRadius: 20,
//     margin: 10,
//     padding: 15,
//     textAlign: 'center',
//     elevation: 13,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   card: {
//     backgroundColor: colors.footercolor,
//     borderRadius: 15,
//     padding: 20,
//     width: '90%',  
//     // flex: 1, 
//     // elevation: 5,
//     // shadowColor: '#000',
//     // shadowOffset: { width: 0, height: 5 },
//     // shadowOpacity: 0.1,
//     // shadowRadius: 6,
//     // alignItems: 'center',
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: colors.background,
//   },
//   infoRow: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   downloadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//   },
//   disabledButton: {
//     opacity: 0.5,
//   },
//   buttonText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#636e72',
//   },
//   loaderContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   loadingText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#636e72',
//     marginTop: 10,
//   },
//   fileRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     backgroundColor: '#c4dfffff',
//     borderRadius: 10,
//     width: '100%',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   fileIcon: {
//     marginRight: 10,
//   },
//   fileText: {
//     fontSize: 16,
//     color: '#2f3640',
//     flex: 1,
//   },
//   emptyList: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#636e72',
//     textAlign: 'center',
//   },
// });

// export default Transcript;

