import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Dimensions, ScrollView, } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import getApiList from "../../config/Api/ApiList";
import SessionService from "../../../common/Services/SessionService";
import { downloadFile } from "../../../common/Services/pdfService";
import alertService from '../../../common/Services/alert/AlertService';
import { API_BASE_URL } from '../../../common/config/BaseUrl'


const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 45) / 2;  

const gradientColors = [
  // ["#6a11cb", "#2575fc"],
  // ["#ff9966", "#ff5e62"],
  // ["#00c6ff", "#0072ff"],
  // ["#f953c6", "#b91d73"],
  ["#36d1dc", "#5b86e5"],
  ["#fbc2eb", "#a6c1ee"],
  // ["#7f00ff", "#e100ff"],
  // ["#3a7bd5", "#00d2ff"],
  ["#f1c40f", "#e67e22"],
];

const AdmitCard = () => {
  const [admitCardList, setAdmitCardList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID,
      };

      const apiList = getApiList();
      const AdmitCardListApi = apiList.GetAdmitCardList;
      const response = await HttpService.post(AdmitCardListApi, payload);

      setAdmitCardList(response?.data?.AdmitCardList || []);
      setLoading(false);
    } catch (error) {
      console.log("API Error:", error);
      setAdmitCardList([]);
    }
  };

  const handleDownload = async (item) => {
    try {
      setLoading(true);

      const payload = { AdmitCode: item.Registration_Id };
      const apiList = getApiList();
      const DownloadAdmitCardAPI = apiList.DownloadAdmitCard;

      const response = await HttpService.post(DownloadAdmitCardAPI, payload);
      const filePath = API_BASE_URL + "/" + response?.data?.Response[0]?.FilePath;

      if (filePath) {
        await downloadFile(filePath, `${item.Registration_Id}_admitCard.pdf`);
      } else {
        alertService.show({
          title: "Error",
          message: "No file available to download.",
          type: "warning",
        });
      }
    } catch (error) {
      alertService.show({
        title: "Download Failed",
        message: error?.message || "Something went wrong",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderCard = ({ item, index }) => {
    const colors = gradientColors[index % gradientColors.length];

    return (
      <LinearGradient colors={colors} style={styles.card}>
        <View style={styles.rowBetween}>
          {/* <View style={styles.row}>
            <FontAwesome6 name="calendar" size={16} color="#fff" />
            <Text style={styles.cardText}>{item.Session}</Text>
          </View> */}
          <View style={styles.row}>
            <FontAwesome6 name="layer-group" size={16} color="#fff" />
            <Text style={styles.cardText}>
              {item.Year} - {item.Semester}
            </Text>
          </View>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.row}>
            <FontAwesome6 name="id-card" size={16} color="#fff" />
            <Text style={styles.cardText}>{item.Session}</Text>
            {/* <Text style={styles.cardText}>{item.Registration_Id}</Text> */}
          </View>
          <View style={styles.row}>
            <FontAwesome6 name="file-lines" size={16} color="#fff" />
            <Text style={styles.cardText}>{item.Exam_Type_Name_E}</Text>
          </View>


        </View>

        <TouchableOpacity
          disabled={!item.Admit_Card_Issue_Main_ID}
          style={[styles.downloadBtn, !item.Admit_Card_Issue_Main_ID && styles.disabledBtn]}
          onPress={() => handleDownload(item)}
        >
          <FontAwesome6 name="file-pdf" size={22} color="#fff" />
          <Text style={styles.downloadBtnText}>Download PDF</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#edf6f9" }}>
      <Header />
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#db9900" />
          <Text style={{ color: "#fff", marginTop: 10, fontSize: 14 }}>Loading...</Text>
        </View>
      )}

      <ScrollView>

        {/* <View style={styles.card}> */}
        <Text style={styles.title}>Your Admit Cards</Text>
        {/* </View> */}


        {admitCardList?.length > 0 ? (
          <FlatList
            data={admitCardList}
            numColumns={2}
            renderItem={renderCard}
            keyExtractor={(item, index) => index.toString()}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 60 }}
          />
        ) : (
          <Text style={styles.noData}>No Admit Card Found</Text>
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default AdmitCard;

const styles = StyleSheet.create({
  title: {
    margin:10,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
    backgroundColor: "#ffdc84ff",
    paddingVertical: 8,
    borderRadius: 8,
    color: "#0b4b33",
  },
  card: {
    width: CARD_WIDTH,
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 36,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth:2,
    borderColor:"#fff"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardText: {
    marginLeft: 6,
    fontSize: 12.5,
    fontWeight: "500",
    color: "#fff",
  },
  downloadBtn: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  downloadBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    marginLeft: 6,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  noData: {
    textAlign: "center",
    padding: 20,
    fontSize: 15,
    color: "gray",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
