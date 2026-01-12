import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { SafeAreaView } from 'react-native-safe-area-context';

// Services
import Apiservice from "../../../common/Services/ApiService";
import requestAndroidPermission from "../../../common/Services/requestStoragePermission";
import getApiList from "../../config/Api/ApiList";
import SessionService from '../../../common/Services/SessionService';

// Layout
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";

const { width } = Dimensions.get("window");

export default function SRCPage() {
  const [srcData, setSrcData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID,
      };
      
      // Hardcoded data for UI demonstration
      let SRCList = [
        { Session: "2022-23", Year: "I Year", Semester: "II Semester", Registration_Id: "226482" },
        { Session: "2023-24", Year: "I Year", Semester: "I Semester", Registration_Id: "232002" },
        { Session: "2023-24", Year: "II Year", Semester: "II Semester", Registration_Id: "248272" },
        { Session: "2024-25", Year: "II Year", Semester: "I Semester", Registration_Id: "248977" },
      ];

      setSrcData(SRCList || []);
    } catch (error) {
      setSrcData([]);
    }
  };

  const handleDownload = async (item) => {
    if (Platform.OS === "android") {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) return;
    }
    Alert.alert("Download", `Downloading Report for ${item.Semester}...`);
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header title="Semester Report Card" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.topInfo}>
          <Text style={styles.mainHeading}>Academic Progress</Text>
          <Text style={styles.subHeading}>Download your semester-wise performance reports</Text>
        </View>

        {srcData.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            activeOpacity={0.8} 
            style={styles.card}
            onPress={() => handleDownload(item)}
          >
            {/* Accent colored bar on the left */}
            <View style={styles.accentBar} />
            
            <View style={styles.iconBox}>
              <FontAwesome6 name="file-invoice" size={20} color="#3c0064" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.Year} - {item.Semester}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.Session}</Text>
              </View>
            </View>

            <View style={styles.actionContainer}>
              <View style={styles.downloadCircle}>
                <FontAwesome6 name="arrow-down-to-bracket" size={16} color="#3c0064" />
              </View>
              <Text style={styles.sizeText}>PDF</Text>
            </View>
          </TouchableOpacity>
        ))}
        
        {/* Spacer for bottom navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#F8F9FD", // Modern off-white/blue tint
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  topInfo: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1C3D",
  },
  subHeading: {
    fontSize: 13,
    color: "#7E84A3",
    marginTop: 4,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginBottom: 14,
    borderRadius: 20,
    alignItems: "center",
    // Premium Shadow
    elevation: 4,
    shadowColor: "#3c0064",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: "#3c0064",
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#F3EFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#1A1C3D",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: -0.3,
  },
  badge: {
    backgroundColor: "#EBEFFA",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    color: "#30387D",
    fontSize: 11,
    fontWeight: "600",
  },
  actionContainer: {
    alignItems: 'center',
  },
  downloadCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8F9FD",
    borderWidth: 1,
    borderColor: '#E2E7FF',
    justifyContent: "center",
    alignItems: "center",
  },
  sizeText: {
    fontSize: 10,
    color: "#7E84A3",
    marginTop: 4,
    fontWeight: '700',
  }
});




















// import React, { useEffect, useState } from "react";
// import {
//   PermissionsAndroid,
//   Platform,
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
// import { generateAndOpenPDF } from "../../../common/Services/pdfService";

// import alertService from '../../../common/Services/alert/AlertService';
// import Apiservice from "../../../common/Services/ApiService"
// import requestAndroidPermission from "../../../common/Services/requestStoragePermission"
// import getApiList from "../../config/Api/ApiList";
// import Header from "../../layout/Header/Header2";
// import Footer from "../../layout/Footer/Footer";
// import SessionService from '../../../common/Services/SessionService';




// export default function SRCPage() {
//   const [srcData, setSrcData] = useState([]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const sessionData = await SessionService.getSession();
//       const payload = {
//         LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//         STUDENT_ID: sessionData?.STUDENT_ID,
//       };
//       const apiList = getApiList();
//       const RegistrationCardListeApi = apiList.GetRegistrationCardList;
//       const response = await Apiservice.request({
//         endpoint: RegistrationCardListeApi,
//         payload,
//         method: "POST",
//       });

//       let SRCList = [
//         {
//           Session: "2022-23",
//           Year: "I Year",
//           Semester: "II Semester",
//           Registration_Id: "226482",
//           Semester_Id: "2",
//           Academic_Session_Id: "22",
//           OGPA_Formula_Status: "New_Formula",
//         },
//         {
//           Session: "2023-24",
//           Year: "I Year",
//           Semester: "I Semester",
//           Registration_Id: "232002",
//           Semester_Id: "1",
//           Academic_Session_Id: "23",
//           OGPA_Formula_Status: "New_Formula",
//         },
//         {
//           Session: "2023-24",
//           Year: "II Year",
//           Semester: "II Semester",
//           Registration_Id: "248272",
//           Semester_Id: "2",
//           Academic_Session_Id: "23",
//           OGPA_Formula_Status: "New_Formula",
//         },
//         {
//           Session: "2024-25",
//           Year: "II Year",
//           Semester: "I Semester",
//           Registration_Id: "248977",
//           Semester_Id: "1",
//           Academic_Session_Id: "24",
//           OGPA_Formula_Status: "New_Formula",
//         },
//       ];

//       // TODO: Replace hardcoded with actual API response when ready
//       // setSrcData(response?.data?.RegistrationCardList || []);
//       setSrcData(SRCList || []);
//     } catch (error) {
//       // console.log("API Error:", error);
//       setSrcData([]);
//     }
//   };

//   const handleIndividualPDFDownload = async (item) => {
//     if (Platform.OS === "android") {
//       const hasPermission = await requestAndroidPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission denied", "Storage permission is required to save the file.");
//         return;
//       }
//     }
//     const content = [
//       { text: "Student Registration Card (SRC)", x: 50, y: 350, size: 18, color: [0, 0.4, 0] },
//       { text: `${item.Session} | ${item.Year} | ${item.Semester} | Reg: ${item.Registration_Id}`, x: 50, y: 320, size: 14 },
//     ];
//     // await generateAndOpenPDF(`SRC_${item.Registration_Id}`, content, "MyApp_SRC_PDFs");
//   };

//   return (
//     <View style={styles.content}>
//       {/* <Header title="Semester Report Card" backgroundColor="#3c0064ff" /> */}
//       <Header title="Semester Report Card"  />
//       <ScrollView>
//         <View style={styles.container}>
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             {srcData.map((item, index) => (
//               <View key={index} style={styles.card}>
//                 {/* <View style={styles.leftIcon}>
//                   <FontAwesome6 name="leanpub" size={32} color="#E32D2D" />
//                 </View> */}

//                 <View style={styles.textContainer}>
//                   <Text style={styles.title}>{item.Year} - {item.Semester}</Text>
//                   <View style={styles.underline} />
//                   <Text style={styles.subTitle}>{item.Session}</Text>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.rightIcon}
//                   onPress={() => handleIndividualPDFDownload(item)}
//                 >
//                   {/* <FontAwesome6 name="cloud-download" size={28} color="#3B65E3" /> */}
//                   <FontAwesome6 name="download" size={20} color="#3c0064ff" />
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   container: {
//     flex: 1,
//   },
//   scrollContainer: {
//     paddingVertical: 10,
//   },
//   card: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     padding: 15,
//     marginVertical: 6,
//     marginHorizontal: 10,
//     borderRadius: 12,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     alignItems: "center",
//   },
//   leftIcon: {
//     marginRight: 12,
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     color: "#30387D",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   underline: {
//     width: 90,
//     height: 2,
//     backgroundColor: "#4A47F6",
//     marginVertical: 2,
//   },
//   subTitle: {
//     color: "#3B3F68",
//     fontSize: 14,
//   },
//   rightIcon: {
//     backgroundColor: "#E2E7FF",
//     padding: 8,
//     borderRadius: 30,
//   },
// });
