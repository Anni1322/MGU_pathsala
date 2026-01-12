
import React, { useEffect, useState } from "react";
import { 
  Platform, View, Text, StyleSheet, ScrollView, 
  TouchableOpacity, Alert, Dimensions, ActivityIndicator 
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import { downloadFile } from "../../../common/Services/pdfService";
import alertService from '../../../common/Services/alert/AlertService';
import { HttpService } from '../../../common/Services/HttpService';
import requestAndroidPermission from "../../../common/Services/requestStoragePermission";
import getApiList from "../../config/Api/ApiList";
import SessionService from '../../../common/Services/SessionService';

// Layout
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import colors from "../../../common/config/colors";
import { API_BASE_URL } from '../../../common/config/BaseUrl';

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2;

export default function RegistraionCardList() {
  const [srcData, setSrcData] = useState([]);
  const [loading, setLoading] = useState(true); // Default to true for initial fetch
  const [downloading, setDownloading] = useState(false); // New state for PDF generation progress

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Start loader
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID
      };
      const apiList = getApiList();
      const response = await HttpService.post(apiList.GetRegistrationCardList, payload);
      
      setSrcData(response?.data?.RegistrationCardList || []);
    } catch (error) {
      setSrcData([]);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleIndividualPDFDownload = async (item) => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) return;
    }

    try {
      setDownloading(true);
      const payload = { Reg_No: item.Registration_Id };
      const response = await HttpService.post(getApiList().DownloadRegistrationCard, payload);
      const filePath = API_BASE_URL + '/' + response?.data?.Response?.[0]?.FilePath;

      if (filePath) {
        await downloadFile(filePath, `${item.Registration_Id}_card.pdf`);
      } else {
        alertService.show({ title: 'Error', message: 'File not generated yet.', type: 'warning' });
      }
    } catch (error) {
      alertService.show({ title: 'Error', message: 'Failed to download PDF.', type: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header title="Registration" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerText}>Registration Cards</Text>
        </View>

        {loading ? (
          /* --- MODERN LOADER SECTION --- */
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.bgcolor} />
            <Text style={styles.loadingText}>Fetching your documents...</Text>
          </View>
        ) : srcData.length === 0 ? (
          /* --- EMPTY STATE SECTION --- */
          <View style={styles.centerBox}>
            <FontAwesome6 name="folder-open" size={60} color="#DDD" />
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptySub}>Your registration cards will appear here once issued by the university.</Text>
            <TouchableOpacity style={styles.refreshBtn} onPress={fetchData}>
              <Text style={styles.refreshText}>Refresh Page</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* --- DATA GRID SECTION --- */
          <View style={styles.grid}>
            {srcData.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.accentLine} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.Session}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.Year} - {item.Semester}</Text>
                
                <TouchableOpacity 
                  style={styles.btn} 
                  onPress={() => handleIndividualPDFDownload(item)}
                  disabled={downloading}
                >
                  <FontAwesome6 name="file-pdf" size={14} color="#FFF" />
                  <Text style={styles.btnText}>{downloading ? 'Please wait...' : 'Get PDF'}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Overlay Loader for PDF Downloading */}
      {downloading && (
        <View style={styles.overlayLoader}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.overlayText}>Generating PDF...</Text>
        </View>
      )}

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, backgroundColor: '#F8F9FA' },
  headerWrapper: { padding: 20 },
  headerText: { fontSize: 24, fontWeight: '800', color: '#333' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, justifyContent: 'space-between' },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  accentLine: { position: 'absolute', top: 0, left: 15, right: 15, height: 3, backgroundColor: colors.bgcolor, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 },
  badge: { backgroundColor: '#F0F2F5', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: colors.bgcolor },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#444', height: 40 },
  
  btn: { backgroundColor: colors.bgcolor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10, marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12, marginLeft: 8 },

  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 15, color: '#666', fontWeight: '500' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#999', marginTop: 20 },
  emptySub: { textAlign: 'center', color: '#BBB', marginTop: 10, lineHeight: 20 },
  refreshBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: colors.bgcolor, borderRadius: 10 },
  refreshText: { color: colors.bgcolor, fontWeight: 'bold' },

  overlayLoader: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  overlayText: { color: '#FFF', marginTop: 10, fontWeight: 'bold' }
});











// import React, { useEffect, useState } from "react";
// import { Platform, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
// import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
// import { downloadFile } from "../../../common/Services/pdfService";
// import alertService from '../../../common/Services/alert/AlertService';
// import { HttpService } from '../../../common/Services/HttpService';
// import requestAndroidPermission from "../../../common/Services/requestStoragePermission";
// import getApiList from "../../config/Api/ApiList";
// import Header from "../../layout/Header/Header2";
// import Footer from "../../layout/Footer/Footer";
// import SessionService from '../../../common/Services/SessionService';
// import Loading from '../../../common/Services/Loading';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { API_BASE_URL } from '../../../common/config/BaseUrl';
// import colors from "../../../common/config/colors";

// export default function RegistraionCardList() {
//   const [srcData, setSrcData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const sessionData = await SessionService.getSession();
//       const payload = {
//         LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//         STUDENT_ID: sessionData?.STUDENT_ID
//       };
//       const apiList = getApiList();
//       const RegistrationCardListeApi = apiList.GetRegistrationCardList;
//       const response = await HttpService.post(RegistrationCardListeApi, payload);
//       // console.log(response.data, "response RegistrationCardListeApi");

//       setSrcData(response?.data?.RegistrationCardList || []);
//     } catch (error) {
//       // console.log("API Error:", error);
//       setSrcData([]);
//     }
//   };

//   const downloadRegistrionCard = async (reg_no) => {
//     try {
//       const payload = {
//         Reg_No: reg_no,
//       };
//       const apiList = getApiList();
//       const RegistrationCardApi = apiList.DownloadRegistrationCard;
//       const response = await HttpService.post(RegistrationCardApi, payload);
//       const filePath = API_BASE_URL + '/' + response?.data?.Response?.[0]?.FilePath;

//       if (filePath) {
//         // console.log('RegistrationCard Path:', filePath);
//         setLoading(true);
//         await downloadFile(filePath, `${reg_no}_registration_card.pdf`);
//         setLoading(false);
//       } else {
//         console.error('No file path returned from API.');
//         alertService.show({
//           title: 'Error',
//           message: 'No file available to download.',
//           type: 'warning',
//         });
//       }
//     } catch (error) {
//       // console.log('API Error:', error);
//       alertService.show({
//         title: 'API Error',
//         message: error.message || 'Failed to fetch registration card path.',
//         type: 'error',
//       });
//       setLoading(false);
//     }
//   };

//   const handleIndividualPDFDownload = async (item) => {
//     if (Platform.OS === 'android') {
//       const hasPermission = await requestAndroidPermission();
//       if (!hasPermission) {
//         Alert.alert('Permission denied', 'Storage permission is required to save the file.');
//         return;
//       }
//     }
//     console.log(item.Registration_Id);
//     await downloadRegistrionCard(item.Registration_Id);
//   };

//   return (
//     <SafeAreaView style={styles.content}>
//       <ScrollView style={styles.content}>
//         <Header title="Registration Card List" />
//         <Text style={styles.header}> Registration Card List</Text>
//         {/* Conditionally render Loading component */}
//         {loading ? (
//           <Loading size="large" color="#3498db" />

//         ) : (
//           <View style={styles.container}>
//             <View style={styles.cardGrid}>
//               {srcData.map((item, index) => (
//                 <View key={index} style={styles.card}>
//                   <Text style={styles.cardTitle} numberOfLines={3} ellipsizeMode="tail">{item.Session}</Text>
//                   <Text style={styles.cardTitle} numberOfLines={3} ellipsizeMode="tail">{item.Year} - {item.Semester}</Text>
//                   <TouchableOpacity
//                     style={styles.cardPdfButton}
//                     onPress={() => handleIndividualPDFDownload(item)}
//                   >
//                     <FontAwesome6 name="file-pdf" size={16} color="#ffffffff" />
//                     <Text style={styles.cardPdfButtonText}>PDF</Text>
//                   </TouchableOpacity>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}
//       </ScrollView>
//       <Footer />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     flex: 1,
//     backgroundColor: '#EBEDEC',
//   },
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   header: {
//     backgroundColor: colors.bgcolor,
//     fontSize: 18,
//     fontWeight: "bold",
//     color: colors.background,
//     borderRadius: 30,
//     margin: 10,
//     padding: 10,
//     textAlign: "center",
//     borderWidth: 1,
//     borderColor: '#fff'
//   },
//   cardGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "flex-start",
//     padding: 10,
//   },
//   card: {
//     borderTopWidth: 10,
//     borderTopColor: colors.bgcolor,
//     borderBottomWidth: 10,
//     borderBottomColor: colors.dangerD,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 10,
//     padding: 10,
//     elevation: 35,
//     shadowColor: '#000',
//     shadowRadius: 8,
//     // width: 140,
//     margin: 10,
//   },
//   cardTitle: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#0e0b5aff",
//     marginBottom: 2,
//     numberOfLines: 2,
//     ellipsizeMode: "tail",
//   },
//   cardPdfButton: {
//     flexDirection: "row",
//     backgroundColor:colors.dangerD,
//     padding: 8,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,
//     alignSelf: "flex-start",
//   },
//   cardPdfButtonText: {
//     color: "#fafafaff",
//     fontSize: 14,
//     marginLeft: 5,
//     fontWeight: "bold",
//   },
// });
