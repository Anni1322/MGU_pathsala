// api
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Apiservice from "../../../common/Services/ApiService"

import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';

const RegistrationCard = () => {
  const [registrationData, setRegistrationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const sessionData = await SessionService.getSession();
      const payload = {
        LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
        STUDENT_ID: sessionData?.STUDENT_ID
      };
      const apiList = getApiList();
      const RegistrationCardListeApi = apiList.GetRegistrationCardList;
      try {
        const profile = await Apiservice.request({
          endpoint: RegistrationCardListeApi,
          payload,
          method: 'POST'
        });
        // console.log('GetRegistrationCardList:', profile?.data?.RegistrationCardList);
        setRegistrationData(profile?.data?.RegistrationCardList || []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    fetchSessionAndProfile();
  }, []);

  const handleDownload = (item) => {
    alert(`Download PDF for Registration ID: ${item.Registration_Id}`);
  };

  const handleView = (item) => {
    alert(`View PDF for Registration ID: ${item.Registration_Id}`);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.content}>
      <Header title="Registration Card" />
      <View style={styles.container}>
        {registrationData.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Header Row */}
            <View style={styles.headerRow}>
              <View style={styles.header}>
                <FontAwesome6 name="check-circle" size={16} color="#ffffff" />
                <Text style={styles.headerTitle} numberOfLines={1}>
                  ID: {item.Registration_Id}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {item.RegStatus}
                </Text>
              </View>

              {/* Icons on Header Side */}
              <View style={styles.iconColumn}>
                {/* <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleView(item)}
                >
                  <FontAwesome6 name="eye" size={18} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#005822' }]}
                  onPress={() => handleDownload(item)}
                >
                  <FontAwesome6 name="download" size={18} color="#fff" />
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Content */}
            <Image
              source={require('../../../assets/icons/logo.jpg')}
              style={styles.avatar}
            />

            <Text style={styles.infoText} numberOfLines={1}>
              Session: {item.Session}
            </Text>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Year:</Text>
              <Text style={styles.value} numberOfLines={1}>{item.Year}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Semester:</Text>
              <Text style={styles.value} numberOfLines={1}>{item.Semester}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value} numberOfLines={1}>{item.Stu_Acad_Status_Name_E}</Text>
            </View>
            <View style={styles.detailBlock}>
              <Text style={styles.label}>Academic Session:</Text>
              <Text style={styles.value} numberOfLines={1}>{item.Academic_Session_Id}</Text>
            </View>

            <View style={styles.detailBlock}>
              <Text style={styles.label}>Payee ID:</Text>
              <Text style={styles.value} numberOfLines={1}>{item.UE_ID}</Text>
            </View>
          </View>
        ))}
      </View>
      <Footer />
    </ScrollView>
  );
};

export default RegistrationCard;

// Styles
const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#e1f4ffff',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 10,
    width: '90%',
    elevation: 3,
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  header: {
    backgroundColor: '#005822ff',
    borderRadius: 6,
    padding: 6,
    flex: 1,
    // marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 13,
  },
  iconColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#007b3e',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#006fdfff',
    marginBottom: 4,
    textAlign: 'center',
  },
  detailBlock: {
    flexDirection: 'row',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 4,
  },
  value: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1,
    maxWidth: '85%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005a0fff',
  },
});
