
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Animated,
  TextInput,
  RefreshControl,
  SafeAreaView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

// Services & Components
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import getApiList from "../../config/Api/ApiList";
import SessionService from "../../../common/Services/SessionService";
import { downloadFile } from "../../../common/Services/pdfService";
import alertService from '../../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../../common/config/BaseUrl';
import colors from "../../../common/config/colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2;

const gradientColors = [
  ["#4158D0", "#C850C0"], // Modern Purple
  ["#00DBDE", "#FC00FF"], // Cyber Blue
  ["#8EC5FC", "#E0C3FC"], // Soft Lavendar
  ["#FBAB7E", "#F7CE68"], // Warm Gold
];

const AdmitCard = () => {
  const [admitCardList, setAdmitCardList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
    // Corrected Animation Call
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Filter Logic (Triggers whenever searchQuery or main list changes)
  useEffect(() => {
    const results = admitCardList.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.Semester?.toLowerCase().includes(query) ||
        item.Exam_Type_Name_E?.toLowerCase().includes(query) ||
        item.Year?.toLowerCase().includes(query) ||
        item.Session?.toLowerCase().includes(query)
      );
    });
    setFilteredList(results);
  }, [searchQuery, admitCardList]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID,
      };
      const response = await HttpService.post(getApiList().GetAdmitCardList, payload);
      const list = response?.data?.AdmitCardList || [];
      setAdmitCardList(list);
      setFilteredList(list);
    } catch (error) {
      console.error("API Error:", error);
      setAdmitCardList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleDownload = async (item) => {
    try {
      setLoading(true);
      const response = await HttpService.post(getApiList().DownloadAdmitCard, { 
        AdmitCode: item.Registration_Id 
      });
      const filePath = API_BASE_URL + "/" + response?.data?.Response[0]?.FilePath;
      if (filePath) {
        await downloadFile(filePath, `${item.Registration_Id}_AdmitCard.pdf`);
      } else {
        alertService.show({ title: "Wait", message: "File not yet generated.", type: "warning" });
      }
    } catch (error) {
      alertService.show({ title: "Error", message: "Download failed.", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const renderCard = ({ item, index }) => {
    const cardColors = gradientColors[index % gradientColors.length];
    const isAvailable = !!item.Admit_Card_Issue_Main_ID;

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <LinearGradient 
          colors={cardColors} 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 1}} 
          style={styles.card}
        >
          <View style={styles.glassBadge}>
             <Text style={styles.badgeText}>{item.Session}</Text>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.semesterText}>{item.Year} - {item.Semester}</Text>
            <View style={styles.infoRow}>
               <FontAwesome6 name="file-invoice" size={11} color="rgba(255,255,255,0.8)" />
               <Text style={styles.examTypeText}>{item.Exam_Type_Name_E}</Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={!isAvailable}
            activeOpacity={0.8}
            style={[styles.downloadBtn, !isAvailable && styles.disabledBtn]}
            onPress={() => handleDownload(item)}
          >
            <View style={styles.btnContent}>
               <FontAwesome6 name="file-pdf" size={14} color={isAvailable ? "#4158D0" : "#999"} />
               <Text style={[styles.downloadBtnText, !isAvailable && {color: "#999"}]}>
                 {isAvailable ? "DOWNLOAD" : "Not Generate"}
               </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      {/* Modern Search Section */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <FontAwesome6 name="magnifying-glass" size={14} color="#A0A0A0" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Semester or Exam..."
            placeholderTextColor="#A0A0A0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <FontAwesome6 name="circle-xmark" size={16} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4158D0" />
        }
      >
        <View style={styles.titleContainer}>
           <Text style={styles.mainTitle}>Admit Card</Text>
           <Text style={styles.subTitle}>{filteredList.length} Admit Card found</Text>
        </View>

        {filteredList.length > 0 ? (
          <FlatList
            data={filteredList}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderCard}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={styles.listPadding}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="folder-open" size={50} color="#E0E0E0" />
            <Text style={styles.noData}>No admit cards match your search.</Text>
          </View>
        )}
      </ScrollView>

      {loading && !refreshing && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderMsg}>Processing Request...</Text>
        </View>
      )}
      
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFC" },
  
  // Search Styles
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },

  // Title Styles
  titleContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  mainTitle: { fontSize: 24, fontWeight: "800", color: "#1A1A1A" },
  subTitle: { fontSize: 12, color: '#999', marginTop: 2, fontWeight: '500' },

  // List Styles
  listPadding: { paddingHorizontal: 15, paddingBottom: 100 },
  columnWrapper: { justifyContent: "space-between" },

  // Card Styles
  card: {
    width: CARD_WIDTH,
    height: 185,
    borderRadius: 22,
    padding: 14,
    marginBottom: 18,
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  glassBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  
  cardContent: { marginTop: 8 },
  semesterText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 5 },
  examTypeText: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600' },

  // Button Styles
  downloadBtn: {
    backgroundColor: '#FFF',
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  downloadBtnText: { color: '#4158D0', fontWeight: '800', fontSize: 11 },
  disabledBtn: { backgroundColor: 'rgba(255,255,255,0.5)' },

  // Loader & Empty Styles
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderMsg: { color: "#fff", marginTop: 12, fontWeight: '600', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  noData: { marginTop: 12, color: '#BBB', fontSize: 14, textAlign: 'center' }
});

export default AdmitCard;









// import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Dimensions, ScrollView, } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
// import React, { useState, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Header from "../../layout/Header/Header2";
// import Footer from "../../layout/Footer/Footer";
// import { HttpService } from "../../../common/Services/HttpService";
// import getApiList from "../../config/Api/ApiList";
// import SessionService from "../../../common/Services/SessionService";
// import { downloadFile } from "../../../common/Services/pdfService";
// import alertService from '../../../common/Services/alert/AlertService';
// import { API_BASE_URL } from '../../../common/config/BaseUrl'
// import colors from "../../../common/config/colors";


// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 45) / 2;  

// const gradientColors = [
//   // ["#6a11cb", "#2575fc"],
//   // ["#ff9966", "#ff5e62"],
//   // ["#00c6ff", "#0072ff"],
//   // ["#f953c6", "#b91d73"],
//   ["#36d1dc", "#5b86e5"],
//   ["#fbc2eb", "#a6c1ee"],
//   // ["#7f00ff", "#e100ff"],
//   // ["#3a7bd5", "#00d2ff"],
//   ["#f1c40f", "#e67e22"],
// ];

// const AdmitCard = () => {
//   const [admitCardList, setAdmitCardList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchData();

//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const sessionData = await SessionService.getSession();
//       console.log(sessionData,'sessionData')
//       const payload = {
//         LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
//         STUDENT_ID: sessionData?.STUDENT_ID,
//       };

//       const apiList = getApiList();
//       const AdmitCardListApi = apiList.GetAdmitCardList;
//       const response = await HttpService.post(AdmitCardListApi, payload);

//       setAdmitCardList(response?.data?.AdmitCardList || []);
//       setLoading(false);
//     } catch (error) {
//       console.log("API Error:", error);
//       setAdmitCardList([]);
//     }
//   };

//   const handleDownload = async (item) => {
//     try {
//       setLoading(true);

//       const payload = { AdmitCode: item.Registration_Id };
//       const apiList = getApiList();
//       const DownloadAdmitCardAPI = apiList.DownloadAdmitCard;

//       const response = await HttpService.post(DownloadAdmitCardAPI, payload);
//       const filePath = API_BASE_URL + "/" + response?.data?.Response[0]?.FilePath;

//       if (filePath) {
//         await downloadFile(filePath, `${item.Registration_Id}_admitCard.pdf`);
//       } else {
//         alertService.show({
//           title: "Error",
//           message: "No file available to download.",
//           type: "warning",
//         });
//       }
//     } catch (error) {
//       alertService.show({
//         title: "Download Failed",
//         message: error?.message || "Something went wrong",
//         type: "danger",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderCard = ({ item, index }) => {
//     const colors = gradientColors[index % gradientColors.length];

//     return (
//       <LinearGradient colors={colors} style={styles.card}>
//         <View style={styles.rowBetween}>
//           {/* <View style={styles.row}>
//             <FontAwesome6 name="calendar" size={16} color="#fff" />
//             <Text style={styles.cardText}>{item.Session}</Text>
//           </View> */}
//           <View style={styles.row}>
//             <FontAwesome6 name="layer-group" size={16} color="#fff" />
//             <Text style={styles.cardText}>
//               {item.Year} - {item.Semester}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.rowBetween}>
//           <View style={styles.row}>
//             <FontAwesome6 name="id-card" size={16} color="#fff" />
//             <Text style={styles.cardText}>{item.Session}</Text>
//             {/* <Text style={styles.cardText}>{item.Registration_Id}</Text> */}
//           </View>
//           <View style={styles.row}>
//             <FontAwesome6 name="file-lines" size={16} color="#fff" />
//             <Text style={styles.cardText}>{item.Exam_Type_Name_E}</Text>
//           </View>


//         </View>

//         <TouchableOpacity
//           disabled={!item.Admit_Card_Issue_Main_ID}
//           style={[styles.downloadBtn, !item.Admit_Card_Issue_Main_ID && styles.disabledBtn]}
//           onPress={() => handleDownload(item)}
//         >
//           <FontAwesome6 name="file-pdf" size={22} color="#fff" />
//           <Text style={styles.downloadBtnText}>Download PDF</Text>
//         </TouchableOpacity>
//       </LinearGradient>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#edf6f9" }}>
//       <Header />
//       {loading && (
//         <View style={styles.loaderOverlay}>
//           <ActivityIndicator size="large" color="#db9900" />
//           <Text style={{ color: "#fff", marginTop: 10, fontSize: 14 }}>Loading...</Text>
//         </View>
//       )}

//       <ScrollView>

//         {/* <View style={styles.card}> */}
//         <Text style={styles.title}>Your Admit Cards</Text>
//         {/* </View> */}


//         {admitCardList?.length > 0 ? (
//           <FlatList
//             data={admitCardList}
//             numColumns={2}
//             renderItem={renderCard}
//             keyExtractor={(item, index) => index.toString()}
//             columnWrapperStyle={{ justifyContent: "space-between" }}
//             contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 60 }}
//           />
//         ) : (
//           <Text style={styles.noData}>No Admit Card Found</Text>
//         )}
//       </ScrollView>

//       <Footer />
//     </SafeAreaView>
//   );
// };

// export default AdmitCard;

// const styles = StyleSheet.create({
//   title: {
//     margin:10,
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//     marginVertical: 12,
//     backgroundColor: colors.footercolor,
//     paddingVertical: 8,
//     borderRadius: 8,
//     color: colors.background,
//   },
//   card: {
//     width: CARD_WIDTH,
//     padding: 12,
//     borderRadius: 16,
//     marginBottom: 14,
//     elevation: 36,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     borderWidth:2,
//     borderColor:"#fff"
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   rowBetween: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 6,
//   },
//   cardText: {
//     marginLeft: 6,
//     fontSize: 12.5,
//     fontWeight: "500",
//     color: "#fff",
//   },
//   downloadBtn: {
//     marginTop: 10,
//     paddingVertical: 8,
//     backgroundColor: "rgba(255,255,255,0.25)",
//     borderRadius: 10,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 6,
//   },
//   downloadBtnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 13,
//     marginLeft: 6,
//   },
//   disabledBtn: {
//     opacity: 0.4,
//   },
//   noData: {
//     textAlign: "center",
//     padding: 20,
//     fontSize: 15,
//     color: "gray",
//   },
//   loaderOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 999,
//   },
// });
