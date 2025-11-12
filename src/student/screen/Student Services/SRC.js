import React, { useEffect, useState } from "react";
import {
  PermissionsAndroid,
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { generateAndOpenPDF } from "../../../common/Services/pdfService";

import alertService from '../../../common/Services/alert/AlertService';
import Apiservice from "../../../common/Services/ApiService"
import requestAndroidPermission from "../../../common/Services/requestStoragePermission"
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import SessionService from '../../../common/Services/SessionService';




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
      const apiList = getApiList();
      const RegistrationCardListeApi = apiList.GetRegistrationCardList;
      const response = await Apiservice.request({
        endpoint: RegistrationCardListeApi,
        payload,
        method: "POST",
      });

      let SRCList = [
        {
          Session: "2022-23",
          Year: "I Year",
          Semester: "II Semester",
          Registration_Id: "226482",
          Semester_Id: "2",
          Academic_Session_Id: "22",
          OGPA_Formula_Status: "New_Formula",
        },
        {
          Session: "2023-24",
          Year: "I Year",
          Semester: "I Semester",
          Registration_Id: "232002",
          Semester_Id: "1",
          Academic_Session_Id: "23",
          OGPA_Formula_Status: "New_Formula",
        },
        {
          Session: "2023-24",
          Year: "II Year",
          Semester: "II Semester",
          Registration_Id: "248272",
          Semester_Id: "2",
          Academic_Session_Id: "23",
          OGPA_Formula_Status: "New_Formula",
        },
        {
          Session: "2024-25",
          Year: "II Year",
          Semester: "I Semester",
          Registration_Id: "248977",
          Semester_Id: "1",
          Academic_Session_Id: "24",
          OGPA_Formula_Status: "New_Formula",
        },
      ];

      // TODO: Replace hardcoded with actual API response when ready
      // setSrcData(response?.data?.RegistrationCardList || []);
      setSrcData(SRCList || []);
    } catch (error) {
      // console.log("API Error:", error);
      setSrcData([]);
    }
  };

  const handleIndividualPDFDownload = async (item) => {
    if (Platform.OS === "android") {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) {
        Alert.alert("Permission denied", "Storage permission is required to save the file.");
        return;
      }
    }
    const content = [
      { text: "Student Registration Card (SRC)", x: 50, y: 350, size: 18, color: [0, 0.4, 0] },
      { text: `${item.Session} | ${item.Year} | ${item.Semester} | Reg: ${item.Registration_Id}`, x: 50, y: 320, size: 14 },
    ];
    await generateAndOpenPDF(`SRC_${item.Registration_Id}`, content, "MyApp_SRC_PDFs");
  };

  return (
    <View style={styles.content}>
      {/* <Header title="Semester Report Card" backgroundColor="#3c0064ff" /> */}
      <Header title="Semester Report Card"  />
      <ScrollView>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {srcData.map((item, index) => (
              <View key={index} style={styles.card}>
                {/* <View style={styles.leftIcon}>
                  <FontAwesome6 name="leanpub" size={32} color="#E32D2D" />
                </View> */}

                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.Year} - {item.Semester}</Text>
                  <View style={styles.underline} />
                  <Text style={styles.subTitle}>{item.Session}</Text>
                </View>

                <TouchableOpacity
                  style={styles.rightIcon}
                  onPress={() => handleIndividualPDFDownload(item)}
                >
                  {/* <FontAwesome6 name="cloud-download" size={28} color="#3B65E3" /> */}
                  <FontAwesome6 name="download" size={20} color="#3c0064ff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  leftIcon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#30387D",
    fontWeight: "600",
    fontSize: 16,
  },
  underline: {
    width: 90,
    height: 2,
    backgroundColor: "#4A47F6",
    marginVertical: 2,
  },
  subTitle: {
    color: "#3B3F68",
    fontSize: 14,
  },
  rightIcon: {
    backgroundColor: "#E2E7FF",
    padding: 8,
    borderRadius: 30,
  },
});
