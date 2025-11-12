
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
        <ActivityIndicator size="large" color="#884DFF" />
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
    <LinearGradient colors={['#ffffff55', '#cfcfcf55']} style={styles.container}>
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
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.userName}>{data['Student Name'] || '—'}</Text>
            <Text style={styles.userRole}>{data.Degree_Programme_Name || '—'}</Text>
            <Text style={styles.userTag}>
              {data.Course_Year_Name} • {data.Semester_Name}
            </Text>
          </View>
        </View>

        {/* Scrollable Profile Info */}
        <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
          <ProfileSection title="Basic Details">
            <ProfileItem label="Father's Name" value={data.Father_Name} icon="user" />
            <ProfileItem label="Mother's Name" value={data.Mother_Name} icon="user" />
            <ProfileItem label="Date of Birth" value={data.DOB} icon="calendar-days" />
            <ProfileItem label="Gender" value={data.Sex} icon="venus-mars" />
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
            <ProfileItem label="City" value={data.per_district} icon="location-pin" />
            <ProfileItem label="Nationality" value={data.per_country} icon="flag" />
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
      <Text style={{ fontWeight: 'bold' }}>{label}:</Text> {value || '—'}
    </Text>
  </View>
);

 


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    padding: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    backgroundColor: '#ff9a2d',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  iconDiamond: {
    fontSize: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#370095ff',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    color: '#350000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRole: {
    color: '#00206cff',
    fontSize: 16,
  },
  userTag: {
    color: '#560000ff',
    fontSize: 14,
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#ffe1e1ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
    borderWidth: 0.2,
    borderColor: "#ff00f2ff"
  },


  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
  logoutCard: {
    backgroundColor: '#f95f5f',
    borderRadius: 15,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutSub: {
    color: '#fcecec',
    fontSize: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    color: '#666',
  },
});
export default ProfileScreen;
