import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { downloadFile } from "../../../common/Services/pdfService";
import alertService from '../../../common/Services/alert/AlertService';
import { HttpService } from '../../../common/Services/HttpService';
import requestAndroidPermission from "../../../common/Services/requestStoragePermission";
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import SessionService from '../../../common/Services/SessionService';
import Loading from '../../../common/Services/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_BASE_URL } from '../../../common/config/BaseUrl';

export default function RegistraionCardList() {
  const [srcData, setSrcData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID
      };
      const apiList = getApiList();
      const RegistrationCardListeApi = apiList.GetRegistrationCardList;
      const response = await HttpService.post(RegistrationCardListeApi, payload);
      // console.log(response.data, "response RegistrationCardListeApi");

      setSrcData(response?.data?.RegistrationCardList || []);
    } catch (error) {
      // console.log("API Error:", error);
      setSrcData([]);
    }
  };

  const downloadRegistrionCard = async (reg_no) => {
    try {
      const payload = {
        Reg_No: reg_no,
      };
      const apiList = getApiList();
      const RegistrationCardApi = apiList.DownloadRegistrationCard;
      const response = await HttpService.post(RegistrationCardApi, payload);
      const filePath = API_BASE_URL + '/' + response?.data?.Response?.[0]?.FilePath;

      if (filePath) {
        // console.log('RegistrationCard Path:', filePath);
        setLoading(true);
        await downloadFile(filePath, `${reg_no}_registration_card.pdf`);
        setLoading(false);
      } else {
        console.error('No file path returned from API.');
        alertService.show({
          title: 'Error',
          message: 'No file available to download.',
          type: 'warning',
        });
      }
    } catch (error) {
      // console.log('API Error:', error);
      alertService.show({
        title: 'API Error',
        message: error.message || 'Failed to fetch registration card path.',
        type: 'error',
      });
      setLoading(false);
    }
  };

  const handleIndividualPDFDownload = async (item) => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Storage permission is required to save the file.');
        return;
      }
    }
    console.log(item.Registration_Id);
    await downloadRegistrionCard(item.Registration_Id);
  };

  return (
    <SafeAreaView style={styles.content}>
      <ScrollView style={styles.content}>
        <Header title="Registration Card List" />

        <Text style={styles.header}> Registration Card List</Text>

        {/* Conditionally render Loading component */}
        {loading ? (
          <Loading size="large" color="#3498db" />

        ) : (
          <View style={styles.container}>
            <View style={styles.cardGrid}>
              {srcData.map((item, index) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardTitle} numberOfLines={3} ellipsizeMode="tail">{item.Session}</Text>
                  <Text style={styles.cardTitle} numberOfLines={3} ellipsizeMode="tail">{item.Year} - {item.Semester}</Text>
                  <TouchableOpacity
                    style={styles.cardPdfButton}
                    onPress={() => handleIndividualPDFDownload(item)}
                  >
                    <FontAwesome6 name="file-pdf" size={16} color="#ffffffff" />
                    <Text style={styles.cardPdfButtonText}>PDF</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#EBEDEC',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    backgroundColor: '#B87C4C',
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffffff",
    borderRadius: 30,
    margin: 10,
    padding: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: '#fff'
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 10,
  },
  card: {
    borderTopWidth: 10,
    borderTopColor: '#A72703',
    borderBottomWidth: 10,
    borderBottomColor: '#FDE7B3',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 35,
    shadowColor: '#000',
    shadowRadius: 8,
    // width: 140,
    margin: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0e0b5aff",
    marginBottom: 2,
    numberOfLines: 2,
    ellipsizeMode: "tail",
  },
  cardPdfButton: {
    flexDirection: "row",
    backgroundColor: "#427A76",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    alignSelf: "flex-start",
  },
  cardPdfButtonText: {
    color: "#fafafaff",
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "bold",
  },
});
