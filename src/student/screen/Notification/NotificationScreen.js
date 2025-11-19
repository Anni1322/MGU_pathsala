// igkv
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Linking, } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { API_BASE_URL } from '../../../common/config/BaseUrl';
import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';


export default function JobListingScreen() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();


 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const sessionData = await SessionService.getSession();
        const apiList = getApiList();
        const response = await HttpService.get(apiList.GetNotificationList);
        if (response?.status !== 200) {
          throw new Error('Failed to fetch profile data');
        }
        const json = await response?.data;
        setNewsData(json.NotificationList || []);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  const openPDF = (filePath) => {
    if (filePath) {
      Linking.openURL(filePath).catch((err) =>
        console.error("Failed to open PDF:", err)
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <EvilIcons name="navicon" size={30} color="#1b001eff" />
        <View style={styles.headerRight}>
          <FontAwesome6 name="bell" size={24} color="#1b001eff" />
          <View style={styles.notificationDot} />
        </View>
      </View> */}

      {/* Loader / News List */}
      {loading ? (
        <ActivityIndicator size="large" color="#3a2d75" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {newsData.map((item) => (
            <View key={item.News_Notification_Main_Id} style={styles.card}>
              <View style={styles.cardHeader}>
                {/* Static icon for logo */}
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                  }}
                  style={styles.logo}
                />
                
                {/* Open PDF button */}
                <TouchableOpacity
                  style={styles.handIconContainer}
                  onPress={() => openPDF(item.File_Path)}
                >
                  <FontAwesome6 name="file-pdf" size={22} color="#d9534f" />
                </TouchableOpacity>
              </View>

              {/* Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tagBlue}>
                  <Text style={styles.tagBlueText}>Notification</Text>
                  <View style={styles.jobInfo}>
                    <Text style={styles.position}>{item.Main_Title}</Text>
                    {/* <Text style={styles.company}>{item.Sub_Title}</Text> */}
                  </View>
                </View>
                <View style={styles.tagRed}>
                  <Text style={styles.tagRedText}>
                    <Text style={styles.company}>{item.Sub_Title}</Text>
                    {/* ID: {item.News_Notification_Detail_Id} */}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.description}>
                Tap on "View PDF" to read the full notification.

              </Text>

              {/* Bottom Row */}
              <View style={styles.bottomRow}>
                <Text style={styles.date}>{item.news_date}</Text>
                {item.File_Path ? (
                  <TouchableOpacity
                    style={styles.seeMoreBtn}
                    onPress={() => openPDF(item.File_Path)}
                  >
                    <Text style={styles.seeMoreText}>View PDF</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Bottom Navigation */}
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem}>
          <FontAwesome6 name="square-check" size={24} color="#3a2d75" />
          <Text style={styles.bottomNavText}>Study Material</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem}>
          <FontAwesome6 name="file-circle-check" size={24} color="#3a2d75" />
          <Text style={styles.bottomNavText}>Assignment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn}>
          <View style={styles.homeBtnCircle}>
            <Icon name="graduation-cap" size={30} color="#3a2d75" />
          </View>
          <Text style={[styles.bottomNavText, { marginTop: 6 }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomNavItem}>
          <FontAwesome6 name="user" size={24} color="#3a2d75" />
          <Text style={styles.bottomNavText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <FontAwesome6 name="gear" size={24} color="#3a2d75" />
          <Text style={styles.bottomNavText}>Setting</Text>
        </TouchableOpacity>
      </View> */}


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f0fe' },
  header: {
    height: 60,
    backgroundColor: '#f5f7fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerRight: { position: 'relative' },
  notificationDot: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  scrollContainer: { paddingHorizontal: 12, paddingBottom: 90 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, borderRadius: 8, marginRight: 10 },
  jobInfo: { flex: 1 },
  position: { fontWeight: '700', fontSize: 12 },
  company: { fontSize: 13, color: '#333' },
  handIconContainer: { paddingHorizontal: 10 },
  tagsContainer: { marginVertical: 10 },
  tagBlue: {
    backgroundColor: '#e9f3ffff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  tagBlueText: { color: '#3a83f1', fontWeight: '500', fontSize: 12 },
  tagRed: {
    backgroundColor: '#f7ccce',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagRedText: { color: '#f14d55', fontWeight: '500', fontSize: 12 },
  description: { fontSize: 12, color: '#666', lineHeight: 18 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  date: { fontSize: 11, color: '#999' },
  seeMoreBtn: {
    backgroundColor: '#167ffa',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  seeMoreText: { color: '#fff', fontSize: 13 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#f5f7fa',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#3a2d75',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 10,
  },
  bottomNavItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  bottomNavText: { fontSize: 11, color: '#3a2d75', marginTop: 2 },
  homeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  homeBtnCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3a2d75',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
});