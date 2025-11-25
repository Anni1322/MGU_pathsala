// ui 
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { API_BASE_URL } from '../../../common/config/BaseUrl';
import { useRoute } from '@react-navigation/native';

import getApiList from "../../config/Api/ApiList";
import Header from "../../layout/Header/Header2";
import Footer from "../../layout/Footer/Footer";
import { HttpService } from "../../../common/Services/HttpService";
import SessionService from '../../../common/Services/SessionService';
import colors from '../../../common/config/colors';

const ProfileScreen = () => {
  const route = useRoute();
  const student = route.params || {};

  const [profileData, setProfileData] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  const capitalizeFirstLetter = (str) =>
    typeof str === 'string' ? str.charAt(0).toUpperCase() + str.slice(1) : str;

  // Reverted to the original recursive function (simpler and correct for typical data)
  const capitalizeObjectStrings = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(capitalizeObjectStrings);
    } else if (typeof obj === 'object' && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, capitalizeObjectStrings(v)])
      );
    } else if (typeof obj === 'string') {
      return capitalizeFirstLetter(obj);
    }
    return obj;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const sessionData = await SessionService.getSession();
        const payload = {
          LOGIN_TYPE: sessionData?.[0]?.LOGIN_TYPE,
          STUDENT_ID: sessionData?.STUDENT_ID,
        };

        const apiList = getApiList();
        const response = await HttpService.post(apiList.profile, payload);
        if (response?.status !== 200) {
          throw new Error('Failed to fetch profile data');
        }

        const profile = capitalizeObjectStrings(response?.data?.StudentProfile);
        const photoPath = response.data?.Profile_Photo?.[0]?.ProfilePhotoPath;
        const finalPhoto = photoPath
          ? API_BASE_URL + photoPath.replace('../', '/')
          : null;

        setProfileData(profile);
        setProfilePhoto(finalPhoto);
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array: runs only once on mount. Change to [student] if needed for re-fetches on param changes.

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c5a7ffff" />
        <Text style={styles.loaderText}>Loading your profile...</Text>
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.loaderText}>No profile data available.</Text>
      </View>
    );
  }

  const data = profileData[0] || {};

  return (
    <LinearGradient colors={[colors.lite2, colors.background]}
    
     style={styles.container}>
      <Header />
      <SafeAreaView style={styles.safeArea}>
        {/* User Card */}
       
        <View style={styles.userCard}>
          <Image
            source={{
              uri:
                profilePhoto ||
                'https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{data['Student Name'] || '—'}</Text>
            <Text style={styles.userRole}>{data.Degree_Programme_Name || '—'}</Text>
            <Text style={styles.userTag}>
              {data.Course_Year_Name} • {data.Semester_Name}
            </Text>
          </View>
        </View>
      

        {/* Scrollable Profile Info */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <ProfileSection title="Basic Details">
            <ProfileItem label="Father's Name" value={data.Father_Name} icon="user" />
            <ProfileItem label="Mother's Name" value={data.Mother_Name} icon="user" />
            <ProfileItem label="Date of Birth" value={data.DOB + " 👉🏻 " + data.Sex} icon="calendar-days" />
            {/* <ProfileItem label="" value={data.Sex}  /> */}
          </ProfileSection>

          <ProfileSection title="Admission Details">
            <ProfileItem label="Admission Session" value={data.Admission_Session} icon="calendar-plus" />
            <ProfileItem label="Admission Quota" value={data.Admsn_Quota_Type} icon="scale-balanced" />
            <ProfileItem label="Category" value={data.Admitted_Category} icon="users" />
          </ProfileSection>

          <ProfileSection title="Academic Details">
            <ProfileItem label="University ID" value={data.University_ID} icon="id-card" />
            <ProfileItem label="Verified Category" value={data.Verified_Cateogy} icon="check-double" />
            <ProfileItem label="Degree Program" value={data.Degree_Programme_Name} icon="graduation-cap" />
            <ProfileItem label="Subject" value={data.Subject_Name} icon="book" />
            <ProfileItem label="College" value={data.College_Name} icon="building-columns" />
            <ProfileItem label="Faculty" value={data.Faculty_Name} icon="landmark" />
            <ProfileItem label="Entrance Type" value={data.Entrance_Exam_Type_Name} icon="file-pen" />
          </ProfileSection>

          <ProfileSection title="Contact Details">
            <ProfileItem label="Email" value={data.E_Mail} icon="envelope" />
            <ProfileItem label="Mobile" value={data.Mobile} icon="mobile-screen-button" />
          </ProfileSection>

          <ProfileSection title="Address Details">
            <ProfileItem label="Address" value={data['Permanent Address']} icon="location-dot" />
            <ProfileItem label="City" value={data.per_district + " Nationality : " + data.per_country} icon="location-pin" />
            {/* <ProfileItem label="Nationality" value={data.per_country} icon="flag" /> */}
          </ProfileSection>
        </ScrollView>
      </SafeAreaView>
      <Footer />
    </LinearGradient>
  );
};

const ProfileSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const ProfileItem = ({ label, value, icon }) => (
  <View style={styles.itemRow}>
    <FontAwesome6 name={icon} size={16} color="#6e4bd8" style={styles.icon} />
    <Text style={styles.itemText}>
      <Text style={styles.labelText}>{label}:</Text> {value || '—'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  
  },
  topcard:{
    backgroundColor:colors.lite2
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  userCard: {
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    // borderRadius: 55,
    padding: 10,
    marginVertical: 20,
    shadowColor: '#ffffffff',
    borderRadius:10,
    height:150,
    // shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 55,  
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop:45,
    // borderRightWidth:14,
    // borderRightColor:'#ff9100ff'
  },
  avatar: {
     marginTop:-45,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#884DFF',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  userTag: {
    fontSize: 14,
    color: '#888',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  section: {
    // backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    // shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8.05,
    // shadowRadius: 15,
    // elevation: 2,
    borderWidth: 3,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    // borderBottomWidth: 3,
    // borderBottomColor: '#ff6720ff',
    paddingBottom: 5,
    borderRadius:15,
    backgroundColor:'#ffd5c1ff',
    padding:10
  },
  sectionContent: {
    // No additional styles needed, as children handle layout
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  labelText: {
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileScreen;

